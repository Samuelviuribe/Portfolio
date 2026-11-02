import styles from '@/sections/hero.module.css';
export default function Hero() {

    return (
        <section id="home" className={styles.hero}>
            <div className={styles.intro}>

                <p className={styles.eyebrow}>
                    SOFTWARE ENGINEERING
                    <span> · </span>
                    CREATIVE DEVELOPMENT
                </p>

                <div className={styles.typingSequence}>
                    <h1 className={styles.name}>
                        <span>Samuel Viaña Uribe.</span>
                    </h1>

                    <h2 className={styles.headline}>
                        <span>Building digital experiences.</span>
                    </h2>
                </div>

                <p className={styles.description}>
                    Software, design and interactive technology. <br /> 
                    Exploring the intersection between functionality and creativity.
                </p>

                <div className={styles.actions}>
                    <a className={styles.cta} href="#work">
                        Explore my work <span>↗</span>
                    </a>

                    <a className={styles.secondaryCta} href="app/about-the-paradox">
                        Discover the paradox <span>↗</span>
                    </a>
                </div>

            </div>
        </section>
    );
}