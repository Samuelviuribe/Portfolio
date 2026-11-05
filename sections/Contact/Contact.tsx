import styles from './contact.module.css';

export default function Contact() {
    return (
        <section id="contact" className={styles.contact}>
            <div className={styles.container}>
                <span className={styles.eyebrow}>GET IN TOUCH</span>

                <h2 className={styles.title}>
                    Interested in <span>seeing more?</span>
                </h2>

                <p className={styles.description}>
                    If you'd like to explore more of my work,
                    discuss an idea or just say hello,
                    here are a few places where you can find me.
                </p>

                <div className={styles.links}>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                        GitHub <span>↗</span>
                    </a>

                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                        LinkedIn <span>↗</span>
                    </a>

                    <a href="mailto:your-email@example.com">
                        Email <span>↗</span>
                    </a>
                </div>
            </div>

            <footer className={styles.footer}>
                <span>© 2026 — Samuel Viaña</span>
                <span>Software Engineering Student</span>
            </footer>
        </section>
    );
}