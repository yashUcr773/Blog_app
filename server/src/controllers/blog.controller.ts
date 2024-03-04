import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from "hono";
import { BLOG_CREATE_VALIDATION, BLOG_UPDATE_VALIDATION } from '../validations/blog.validation';
import { CONSTANTS } from '../config/constants';


export const getAllBlogs = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // check for duplicate emails in the db
        const blogs = await prisma.post.findMany({ include: { author: { select: { username: true, email: true, id: true } }, category: true } });

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

export const getBlogsOfUser = async (c: Context) => {
    try {

        const { userId } = c.req.param()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        // check for duplicate emails in the db
        const blogs = await prisma.post.findMany({ where: { authorId: userId }, include: { author: { select: { username: true, email: true } } } });

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

        const { title, content, cover, summary, publishedStr, category }: any = await c.req.parseBody();
        const userInfo = c.get('userInfo')
        const published = publishedStr === 'true' ? true : false

        const { success, error }: any = BLOG_CREATE_VALIDATION.safeParse({
            title, summary, content, published, category
        })

        if (!success) {
            c.status(400)
            return c.json({
                message: "All Fiends are required.",
                success: false,
                error: error.issues,
            });
        }

        // upload image to AWS
        const formData = new FormData();
        formData.append('cover', cover as any);
        const response = await fetch(CONSTANTS.FILE_UPLOADER_URL, {
            method: 'POST',
            body: formData,
        });
        const uploaderData: any = await response.json()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.create({
            data: {
                title,
                cover: CONSTANTS.CF_BASE_URL + uploaderData.filename,
                summary,
                content,
                published,
                author: {
                    connect: { id: userInfo.userId }
                },
                category: {
                    connectOrCreate: {
                        create: {
                            name: category as string
                        },
                        where: {
                            name: category as string
                        },
                    }
                }
            },
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

        const { title, content, cover, summary, published, category, blogId }: any = await c.req.parseBody();
        const { success, error }: any = BLOG_UPDATE_VALIDATION.safeParse({
            blogId, title, summary, content, published, category
        })

        if (!success) {
            c.status(400)
            return c.json({
                message: "Atleast 1 field is required.",
                success: false,
                error: error.issues,
            });
        }

        let updatedObj: any = { updated: true }
        if (title !== undefined) updatedObj.title = title
        if (cover !== undefined) {
            // upload image to AWS
            const formData = new FormData();
            formData.append('cover', cover as any);
            const response = await fetch(CONSTANTS.FILE_UPLOADER_URL, {
                method: 'POST',
                body: formData,
            });
            const uploaderData: any = await response.json()
            updatedObj.cover = CONSTANTS.CF_BASE_URL + uploaderData.filename
        }
        if (summary !== undefined) updatedObj.summary = summary
        if (content !== undefined) updatedObj.content = content
        if (published !== undefined) updatedObj.published = published
        if (category !== undefined) updatedObj.category = {
            connectOrCreate: {
                create: {
                    name: category as string
                },
                where: {
                    name: category as string
                },
            }
        }

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
            include: {
                author: { select: { username: true, email: true, id: true } },
                category: { select: { name: true } }
            }
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

export const publishBlog = async (c: Context) => {
    try {
        const { blogId }: any = await c.req.param()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.update({
            where: { id: blogId },
            data: { published: true }
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Blog Published.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

export const unpublishBlog = async (c: Context) => {
    try {
        const { blogId }: any = await c.req.param()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.update({
            where: { id: blogId },
            data: { published: false }
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Blog Published.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

export const deleteBlog = async (c: Context) => {
    try {
        const { blogId }: any = await c.req.param()

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.post.delete({
            where: { id: blogId },
        });

        c.status(200)
        return c.json({
            success: true,
            message: "Blog Deleted.",
            blog
        });
    } catch (err: any) {
        console.log(err)
        c.status(500)
        return c.json({ success: false, message: err.message });
    }
};

