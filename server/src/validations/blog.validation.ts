import zod from "zod";

export const BLOG_CREATE_VALIDATION = zod.object({
    title: zod.string(),
    summary: zod.string(),
    content: zod.string(),
    cover: zod.string(),
    published: zod.boolean().optional(),
});

export const BLOG_UPDATE_VALIDATION = zod.object({
    title: zod.string().optional(),
    summary: zod.string().optional(),
    content: zod.string().optional(),
    cover: zod.string().optional(),
    published: zod.boolean().optional(),
});

