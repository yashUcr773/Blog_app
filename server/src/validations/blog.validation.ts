import zod from "zod";

export const BLOG_CREATE_VALIDATION = zod.object({
    title: zod.string(),
    summary: zod.string(),
    content: zod.string(),
    category: zod.string(),
    published: zod.boolean().optional(),
});

export const BLOG_UPDATE_VALIDATION = zod.object({
    blogId: zod.string(),
    title: zod.union([zod.string(), zod.undefined()]),
    summary: zod.union([zod.string(), zod.undefined()]),
    content: zod.union([zod.string(), zod.undefined()]),
    category: zod.union([zod.string(), zod.undefined()]),
    published: zod.union([zod.boolean(), zod.undefined()]),
});

