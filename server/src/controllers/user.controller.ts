import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { USER_UPDATE_VALIDATOR } from "../validations/user.validation";
import { _decodePassword, _encodePassword } from "../utils/password.utils";
import { CONSTANTS } from "../config/constants";

export const getUserById = async (c: Context) => {
    try {
        const { id } = c.req.param();

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                profilePhoto: true
            }
        });

        if (!user) {
            c.status(404)
            return c.json({
                success: false,
                message: "User not found",
                user,
            });
        }

        c.status(200)
        return c.json({
            success: true,
            message: "User found",
            user,
        });
    } catch (e: any) {
        console.log(e);
        c.status(500)
        return c.json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

export const getAllUsers = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const users = await prisma.user.findMany({
            select: { email: true, id: true, username: true, profilePhoto: true }
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Users found",
            users,
        });
    } catch (e: any) {
        console.log(e);

        c.status(500)
        return c.json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

export const getUserByFilter = async (c: Context) => {
    try {

        const { mask } = c.req.query();

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const users = await prisma.user.findFirst({
            where: {
                username: { contains: mask }
            },
            select: { username: true, email: true, id: true, profilePhoto: true }
        },);

        c.status(200)
        return c.json({
            success: true,
            message: "Users found",
            users,
        });
    } catch (e: any) {
        console.log(e);
        c.status(500)
        return c.json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

export const updateUserInfo = async (c: Context) => {
    try {
        const { cover, currentPassword, newPassword, confirmPassword } = await c.req.parseBody();
        const userInfo = c.get('userInfo')
        const { success, error }: any = USER_UPDATE_VALIDATOR.safeParse({
            currentPassword, newPassword, confirmPassword
        });

        if (!success) {
            c.status(400)
            return c.json({
                message: "Atleast one field is required",
                success: false,
                error: error.issues,
            });
        }

        if (newPassword && (newPassword !== confirmPassword)) {
            c.status(400)
            return c.json({
                message: "Passwords do not match.",
                success: false,
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const foundUser = await prisma.user.findFirst({ where: { id: userInfo.userId } })
        if (currentPassword != null && currentPassword !== _decodePassword(foundUser?.password as string)) {
            c.status(400)
            return c.json({
                message: "Password incorrect.",
                success: false,
            });
        }

        let updatedObj: any = { updated: true }
        if (newPassword != null) updatedObj.password = _encodePassword(newPassword as string)
        if (cover != null) {
            const formData = new FormData();
            formData.append('cover', cover as any);
            const response = await fetch(CONSTANTS.FILE_UPLOADER_URL, {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    'authorization': (c.req.header('authorization') as string)
                })
            });
            const uploaderData: any = await response.json()
            updatedObj.profilePhoto = CONSTANTS.CF_BASE_URL + uploaderData.filename
        }

        let user = await prisma.user.update({
            where: {
                id: c.get('userInfo').userId,
            },
            data: updatedObj,
            select: { email: true, username: true, id: true, profilePhoto: true },
        });

        c.status(200)
        return c.json({
            message: "Updated successfully",
            success: true,
            user
        });
    } catch (e: any) {
        console.log(e)
        c.status(500)
        return c.json({ success: false, message: e.message });
    }
}