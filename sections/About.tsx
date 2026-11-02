import styles from './about.module.css';

const details = [
    {
        title: 'EDUCATION',
        text: 'Software Engineering student at Universidad de Cartagena.',
    },
    {
        title: 'INTERESTS',
        text: 'Frontend development, UI/UX design, creative coding and interactive experiences.',
    },
    {
        title: 'WHAT I DO',
        text: 'Building responsive interfaces, developing web applications and exploring interactive technologies.',
    },
];

const technologies = [
    'JavaScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Three.js',
    'Figma',
];

export default function About() {
    return (
        <section id="about" className={styles.about}>
            <div className={styles.container}>
                <span className={styles.eyebrow}>03 / ABOUT ME</span>

                <h2>
                    A little about <span>what I do.</span>
                </h2>

                <p className={styles.intro}>
                    I'm a Software Engineering student passionate about
                    technology, design and building digital experiences.
                    I enjoy combining logical thinking with creativity
                    to develop useful and engaging products.
                </p>

                <div className={styles.details}>
                    {details.map((item) => (
                        <article key={item.title}>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>

                <div className={styles.skills}>
                    <span>TOOLS & TECHNOLOGIES</span>

                    <p>{technologies.join(' / ')}</p>
                </div>
            </div>
        </section>
    );
}