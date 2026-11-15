
"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./contact.module.css";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setStatus("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            turnstileToken,
            website: formData.get("website"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    JSON.stringify(result.errors || result.message)
                );
            }

            setStatus("Message sent successfully!");
            form.reset();

        } catch (error) {
            setStatus(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="contact" className={styles.contact}>
            <div className={styles.container}>
                <span className={styles.eyebrow}>GET IN TOUCH</span>

                <h2 className={styles.title}>
                    Let's start a <span>conversation.</span>
                </h2>

                <p className={styles.description}>
                    Have a project in mind, an opportunity or just want
                    to say hello? Feel free to get in touch.
                </p>

                <div className={styles.content}>
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.fieldGroup}>
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    width: "1px",
                                    height: "1px",
                                    overflow: "hidden",
                                    clip: "rect(0, 0, 0, 0)",
                                }}
                            >
                                <label htmlFor="website">Website</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>
                            
                            <div className={styles.field}>
                                <label htmlFor="name">NAME</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="email">EMAIL</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="subject">SUBJECT</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="What's this about?"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="message">MESSAGE</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Tell me about it..."
                                rows={5}
                                required
                            />
                        </div>

                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={(token) => setTurnstileToken(token)}
                            onExpire={() => setTurnstileToken(null)}
                            onError={() => setTurnstileToken(null)}
                        />

                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={loading || !turnstileToken}
                        >
                            {loading ? "Sending..." : "Send message"}
                            <span>↗</span>
                        </button>

                        {status && (
                            <p role="status" aria-live="polite">
                                {status}
                            </p>
                        )}
                    </form>

                    <aside className={styles.socials}>
                        <span className={styles.socialLabel}>ELSEWHERE</span>

                        <a
                            href="https://github.com/Samuelviuribe"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className={styles.socialIcon} />
                            GitHub <span>↗</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/samuel-via%C3%B1a-4066b9315/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin className={styles.socialIcon} />
                            LinkedIn <span>↗</span>
                        </a>
                    </aside>
                </div>
            </div>

            <footer className={styles.footer}>
                <span>© 2026 — Samuel Viaña</span>
                <span>Software Engineering Student</span>
            </footer>
        </section>
    );
}
