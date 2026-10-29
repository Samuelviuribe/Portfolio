import styles from '@/sections/hero.module.css';
export default function Hero() {

    return (
        <section id="home" className={styles.hero}>
            <div className={styles.intro}>
                <h1 className={styles.name}>
                    <span>  
                        Samuel Viaña Uribe.
                    </span>
                </h1>
                <p className={styles.eyebrow}>
                    SOFTWARE ENGINEERING · CREATIVE DEVELOPMENT
                </p>

                <h2>Building digital experiences.</h2>
                <p className={styles.description}>
                    Software, design and interactive technology.
                </p>

                <a className={styles.cta} href="#work">
                    Explore my work ↘
                </a>
            </div>

            <aside className={styles.paradoxPanel}>
                <span className={styles.panelLabel}>
                 01 / A MATHEMATICAL PARADOX   
                </span>    
                <h3>
                    Can one sphere become two?
                </h3>
                    <p>
                    The Banach–Tarski paradox shows that, under specific mathematical
                    assumptions, a solid sphere can be decomposed into a finite number
                    of pieces and reassembled into two identical copies.
                    </p>
                <span className={styles.scrollHint}>
                    SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
                </span>    
            </aside>
        </section>
    );
}