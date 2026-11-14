import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './contact.module.css';

export default function Contact() {
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
                    <form className={styles.form}>
                        <div className={styles.fieldGroup}>
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

                        <button type="submit" className={styles.submit}>
                            Send message <span>↗</span>
                        </button>
                    </form>

                    <aside className={styles.socials}>
                        <span className={styles.socialLabel}>ELSEWHERE</span>

                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className={styles.socialIcon} />
                            GitHub <span>↗</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/"
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
