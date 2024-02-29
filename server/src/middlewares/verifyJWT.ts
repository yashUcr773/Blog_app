import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const verifyJWT = async (c: Context, next: Next) => {
    try {
        const authHeader = c.req.header('authorization') || c.req.header('Authorization')

        if (!authHeader?.startsWith("Bearer ")) {
            c.status(403)
            return c.json({
                success: false,
                message: "Authentication Error",
            });
        }

        const token = authHeader.split(" ")[1];
        const {
            ACCESS_TOKEN_SECRET,
        } = c.env

        const { userInfo } = await verify(
            token,
            ACCESS_TOKEN_SECRET
        );

        c.set('userInfo', userInfo)
        return next();
    } catch (e: any) {
        console.log(e.message);
        c.status(403)
        return c.json({
            success: false,
            message: "Authentication Error",
        });
    }
};
