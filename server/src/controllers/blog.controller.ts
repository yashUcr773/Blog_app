import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from "hono";

export const getAllBlogs = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // check for duplicate emails in the db
        const blogs = await prisma.post.findMany({ include: { author: { select: { name: true, email: true } } } });

        c.status(200)
        return c.json({
            success: true,
            message: "Blogs Found.",
            blogs
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

export const addBlog = async (c: Context) => {
    try {

        const { title, content } = await c.req.json();
        const userInfo = c.get('userInfo')

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.create({
            data: {
                title, content, authorId: userInfo.userId
            }
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Blogs Created.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

export const updateBlog = async (c: Context) => {
    try {

        const { title, content, blogId, published } = await c.req.json();

        let updatedObj: any = {}
        if (title !==undefined) updatedObj.title = title
        if (content !== undefined) updatedObj.content = content
        if (published !== undefined) updatedObj.published = published


        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.update({
            where: { id: blogId },
            data: updatedObj
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Blogs Updated.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

export const getBlogById = async (c: Context) => {
    try {

        const { blogId } = c.req.param()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.findFirst({
            where: {
                id: blogId
            },
            include: { author: { select: { name: true, email: true } } }
        },);

        c.status(200)
        return c.json({
            success: true,
            message: "Blogs Found.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};