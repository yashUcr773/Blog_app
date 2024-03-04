import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from 'hono';
import { USER_SIGNIN_VALIDATOR, USER_SIGNUP_VALIDATOR } from '../validations/user.validation';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { tokenCookieOptions } from '../config/cookieOptions';
import { sign, verify } from 'hono/jwt';
import { _decodePassword, _encodePassword } from '../utils/password.utils';

interface TokensInterface {
    userId: string,
    email: string,
    username: string
}

export const handleSignup = async (c: Context) => {
    try {
        const { email, password, username } = await c.req.json();
        const { success, error }: any = USER_SIGNUP_VALIDATOR.safeParse({
            email, password, username
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
                OR: [
                    {
                        email: { contains: email },
                    },
                    {
                        username: { contains: username },
                    },
                ],
            },
        });

        if (duplicate) {
            c.status(409)
            return c.json({ success: false, message: "Email or Username Taken." }); //Conflict
        }

        //encrypt the password
        const hashedPassword = _encodePassword(password)
        const newUser = await prisma.user.create({
            data: {
                email, username, password: hashedPassword, refreshToken: "",
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
            username: newUser.username,
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
            },
            select: {
                id: true,
                email: true,
                username: true,
                profilePhoto: true
            }
        });

        // send cookie and response
        setCookie(c, "jwt", refreshToken, tokenCookieOptions);

        c.status(200)
        return c.json({
            success: true,
            message: "User Created Successfully.",
            user: ({ ...updatedUser, accessToken: accessToken })
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

        if (!success) {
            deleteCookie(c, "jwt");
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

        // check if user exists in db
        const foundUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: { contains: email },
                    },
                    {
                        username: { contains: email },
                    },
                ]
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
                message: "Email/Username or password incorrect.",
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
            username: foundUser?.username || "",
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
            },
            select: {
                id: true,
                email: true,
                username: true,
                profilePhoto: true
            }
        });


        // send cookie and response
        setCookie(c, "jwt", refreshToken, tokenCookieOptions);
        c.status(200)
        return c.json({
            success: true,
            message: "Login Successful",
            user: ({ ...updatedUser, accessToken: accessToken })
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
            },
            select: {
                id: true,
                email: true,
                username: true,
                profilePhoto: true
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
        const [newAccessToken, newRefreshToken] = await _generateTokens({
            userId: foundUser.id,
            email: foundUser.email,
            username: foundUser.username,
        }, ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY);

        c.status(200)
        return c.json({
            success: true,
            message: "Token Refreshed",
            newAccessToken,
            user: sendUserData && foundUser
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

async function _generateTokens({ userId, email, username }: TokensInterface, ACCESS_TOKEN_SECRET: string, ACCESS_TOKEN_EXPIRY: string, REFRESH_TOKEN_SECRET: string, REFRESH_TOKEN_EXPIRY: string) {
    const accessToken = await sign(
        {
            userInfo: {
                userId,
                email,
                username
            },
            exp: (Math.round(Date.now() / 1000) - 1) + +ACCESS_TOKEN_EXPIRY,
            iat: (Math.round(Date.now() / 1000) - 1)
        },
        ACCESS_TOKEN_SECRET,
    );

    const refreshToken = await sign(
        {
            userInfo: {
                userId,
                email,
                username
            },
            exp: (Math.round(Date.now() / 1000) - 1) + +REFRESH_TOKEN_EXPIRY,
            iat: (Math.round(Date.now() / 1000) - 1)

        },
        REFRESH_TOKEN_SECRET,

    );

    return [accessToken, refreshToken];
}