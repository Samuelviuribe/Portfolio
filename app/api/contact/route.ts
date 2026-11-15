import { NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/contact.schema";
import { Resend } from "resend";
import { contactRateLimit } from "@/lib/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request: Request) {

    try {
        const requiredEnv = [
            "RESEND_API_KEY",
            "CONTACT_TO_EMAIL",
            "TURNSTILE_SECRET_KEY",
            "UPSTASH_REDIS_REST_URL",
            "UPSTASH_REDIS_REST_TOKEN",
        ];

        const missingEnv = requiredEnv.filter((key) => !process.env[key]);

        if (missingEnv.length > 0) {
            throw new Error(`Missing environment variables: ${missingEnv.join(", ")}`);
        }

        let data;

        try {
            data = await request.json();
        } catch {
            return NextResponse.json(
                { message: "Invalid JSON format" },
                { status: 400 }
            );
        }

        const result = contactSchema.safeParse(data);


        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid form data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

        if (!ip) {
            return NextResponse.json(
                { message: "Could not identify request source" },
                { status: 400 }
            );
        }

        const { success, limit, remaining, reset } =
            await contactRateLimit.limit(ip);

        if (!success) {
            return NextResponse.json(
                { message: "Too many requests. Try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(
                            Math.ceil((reset - Date.now()) / 1000)
                        ),
                        "X-RateLimit-Limit": String(limit),
                        "X-RateLimit-Remaining": String(remaining),
                    },
                }
            );
        }



        const { name, email, subject, message, turnstileToken } = result.data;


        if (result.data.website) {
            return NextResponse.json(
                { message: "Invalid submission" },
                { status: 400 }
            );
        }


        const verification = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    secret: process.env.TURNSTILE_SECRET_KEY!,
                    response: turnstileToken,
                }),
            }
        );

        const verificationResult = await verification.json();

        if (!verificationResult.success) {
            return NextResponse.json(
                { message: "Security verification failed" },
                { status: 403 }
            );
        }

        const { error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: process.env.CONTACT_TO_EMAIL!,
            replyTo: email,
            subject: `Portfolio contact: ${subject}`,
            text: `
            Name: ${name}
            Email: ${email}

            Message:
            ${message}
            `,
        });



        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                { message: "Could not send email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Email sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}