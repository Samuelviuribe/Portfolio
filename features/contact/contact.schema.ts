import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must have at least 2 characters")
        .max(80, "Name is too long"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(254, "Email is too long"),

    subject: z
        .string()
        .trim()
        .min(3, "Subject is required")
        .max(120, "Subject is too long"),

    message: z
        .string()
        .trim()
        .min(10, "Message must have at least 10 characters")
        .max(3000, "Message is too long"),

    turnstileToken: z
        .string()
        .min(1, "Turnstile token is required"),
    website: z
    .string()
    .max(0, "Invalid submission")
    .default(""),
});