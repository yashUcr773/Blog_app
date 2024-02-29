import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from 'hono';
import { USER_SIGNIN_VALIDATOR, USER_SIGNUP_VALIDATOR } from '../validations/user.validation';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { tokenCookieOptions } from '../config/cookieOptions';
import { sign, verify } from 'hono/jwt';
import { nanoid } from 'nanoid';

interface TokensInterface {
    userId: string,
    email: string
}

export const handleSignup = async (c: Context) => {
    try {
        const { email, password, name } = await c.req.json();
        const { success, error }: any = USER_SIGNUP_VALIDATOR.safeParse({
            email, password, name
        });

        if (!success) {
            c.status(400)
            return c.json({
                message: "Email and password are required.",
                success: false,
                error: error.issues,
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // check for duplicate emails in the db
        const duplicate = await prisma.user.findFirst({
            where: {
                email: { contains: email },
            }
        });

        if (duplicate) {
            c.status(409)
            return c.json({ success: false, message: "Email exists." }); //Conflict
        }

        //encrypt the password
        const hashedPassword = _encodePassword(password)
        const newUser = await prisma.user.create({
            data: {
                email, name, password: hashedPassword, refreshToken: "",
            }
        });

        const {
            ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY

        } = c.env

        const [accessToken, refreshToken] = await _generateTokens({
            userId: newUser.id,
            email: newUser.email,
        }, ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY);

        // add refresh token in DB
        const updatedUser = await prisma.user.update({
            where: {
                id: newUser.id
            },
            data: {
                refreshToken: refreshToken,
            }
        });

        // send cookie and response
        setCookie(c, "jwt", refreshToken, tokenCookieOptions);

        c.status(200)
        return c.json({
            success: true,
            message: "User Created Successfully.",
            user: {
                userId: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                accessToken: accessToken,
            },
        });

    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });

    }
};

export const handleSignin = async (c: Context) => {

    try {
        // check if inputs are valid
        const { email, password } = await c.req.json();
        const { success, error }: any = USER_SIGNIN_VALIDATOR.safeParse({
            email,
            password,
        });

        deleteCookie(c, "jwt");
        if (!success) {
            c.status(400)
            return c.json({
                message: "Email and password are required.",
                success: false,
                error: error.issues,
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
        console.log('prisma')
        // console.log(prisma)

        // check if user exists in db
        const foundUser = await prisma.user.findFirst({
            where: {
                email: { contains: email },
            }
        });

        if (!foundUser) {
            deleteCookie(c, "jwt");
            c.status(401)
            return c.json({
                success: false,
                message: "Email or password incorrect.",
            });
        }

        const foundPassword = _decodePassword(foundUser.password)
        const match = password === foundPassword
        if (!match) {
            deleteCookie(c, "jwt");
            return c.json({
                success: false,
                message: "Email or password incorrect.",
            });
        }

        const {
            ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY

        } = c.env

        const [accessToken, refreshToken] = await _generateTokens({
            userId: foundUser?.id || "",
            email: foundUser?.email || "",
        }, ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY);

        const updatedUser = await prisma.user.update({
            where: {
                id: foundUser?.id
            },
            data: {
                refreshToken: refreshToken,
            }
        });


        // send cookie and response
        setCookie(c, "jwt", refreshToken, tokenCookieOptions);
        c.status(200)
        return c.json({
            success: true,
            message: "Login Successful",
            user: {
                userId: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                accessToken: accessToken,
            },
        });
    } catch (e) {
        console.log(e);
        c.status(500)
        return c.json({ success: false, message: "Server Error" });
    }
};

export const handleLogout = async (c: Context) => {
    try {
        // get inputs
        const refreshToken = getCookie(c, 'jwt');

        // if cookie does not exists, return
        if (!refreshToken) {
            c.status(200)
            return c.json({
                success: true,
                message: "Log out successful.",
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // find user from db with same refresh token
        const foundUser = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken,
            }
        });

        // if user does not exist, delete cookie and return
        if (!foundUser) {
            deleteCookie(c, 'jwt')
            c.status(200)
            return c.json({
                success: true,
                message: "Log out successful.",
            });
        }

        await prisma.user.update({
            where: {
                id: foundUser.id
            },
            data: {
                refreshToken: "",
            }
        });

        // delete cookie and return
        deleteCookie(c, "jwt");
        c.status(200)
        return c.json({
            success: true,
            message: "Log out successful.",
        });
    } catch (e) {
        console.log(e);
        c.status(403)
        return c.json({ success: false, message: "Authorization Error" });
    }
};

export const handleRefreshToken = async (c: Context) => {
    try {
        // get input
        const refreshToken = getCookie(c, 'jwt');
        const sendUserData = c.req.query('sendUserData');

        // if token not in cookie, return
        if (!refreshToken) {
            c.status(200)
            return c.json({
                success: false,
                message: "Authorization Error",
            });
        }


        // find user in DB
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const {
            ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY

        } = c.env

        await verify(refreshToken, REFRESH_TOKEN_SECRET)

        // find user from db with same refresh token
        const foundUser = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken,
            }
        });

        // If user not found
        if (!foundUser) {
            c.status(200)
            return c.json({
                success: false,
                message: "Authorization Error",
            });
        }

        // generate new tokens
        const [accessToken, newRefreshToken] = await _generateTokens({
            userId: foundUser.id,
            email: foundUser.email,
        }, ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY);

        c.status(200)
        return c.json({
            success: true,
            message: "Token Refreshed",
            accessToken,
            user: sendUserData && {
                userId: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
            },
        });
    } catch (e) {
        console.log(e)
        c.status(403)
        return c.json({
            success: false,
            message: "Authorization Error",
        });
    }
};

async function _generateTokens({ userId, email }: TokensInterface, ACCESS_TOKEN_SECRET: string, ACCESS_TOKEN_EXPIRY: string, REFRESH_TOKEN_SECRET: string, REFRESH_TOKEN_EXPIRY: string) {
    const accessToken = await sign(
        {
            userInfo: {
                userId,
                email,
            },
            exp: (Date.now() / 1000) + +ACCESS_TOKEN_EXPIRY,
            iat: (Date.now() / 1000)
        },
        ACCESS_TOKEN_SECRET,
    );

    const refreshToken = await sign(
        {
            userInfo: {
                userId,
                email,
            },
            exp: (Date.now() / 1000) + +REFRESH_TOKEN_EXPIRY,
            iat: (Date.now() / 1000)

        },
        REFRESH_TOKEN_SECRET,

    );

    return [accessToken, refreshToken];
}

function _decodePassword(password: string) {
    password = atob(password);
    const length = password.length;
    password = password.slice(length / 3, 2 * length / 3);
    return password
}

function _encodePassword(password: string) {
    const length = password.length;
    const prefix = nanoid(length);
    const suffix = nanoid(length);
    return btoa(prefix + password + suffix);
}