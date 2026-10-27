import styles from '@/sections/hero.module.css';
export default function Hero() {

    return ( 
        <section id="home" className={styles.hero}>
        <h1>Samuel Viaña Uribe</h1>
        <p>SOFTWARE ENGINEERING · CREATIVE DEVELOPMENT</p>

        <h2>Building digital experiences.</h2>
        <p>Software, design and interactive technology.</p>

        <a href="#work">Explore my work ↘</a>
        </section>
    );
}