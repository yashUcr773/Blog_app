import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from "hono";

export const getAllCategories = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // check for duplicate emails in the db
        const categories = await prisma.category.findMany();

        c.status(200)
        return c.json({
            success: true,
            message: "Categories Found.",
            categories
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};
