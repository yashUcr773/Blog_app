import zod from "zod";

const passwordSchema = zod
    .string()
    .min(8)
    .max(24)
    .refine(
        (value) => {
            const hasLowerCase = /[a-z]/.test(value);
            const hasUpperCase = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                value
            );
            return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
        },
        {
            message:
                "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        }
    );

export const USER_SIGNUP_VALIDATOR = zod.object({
    name: zod.string().min(4).max(24),
    email: zod.string().min(4).max(64).email(),
    password: passwordSchema,
});

export const USER_SIGNIN_VALIDATOR = zod.object({
    email: zod.string(),
    password: zod.string(),
});
