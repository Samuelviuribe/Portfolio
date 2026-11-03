import styles from './work.module.css';

const projects = [
    {
        number: '01',
        title: 'Project One',
        category: 'WEB DEVELOPMENT',
        description: 'A digital experience focused on design, functionality and interaction.',
        technologies: ['Next.js', 'React', 'TypeScript'],
    },
    {
        number: '02',
        title: 'Project Two',
        category: 'SOFTWARE DEVELOPMENT',
        description: 'A software solution designed to solve a practical problem.',
        technologies: ['Python', 'Database', 'UI Design'],
    },
    {
        number: '03',
        title: 'Project Three',
        category: 'CREATIVE DEVELOPMENT',
        description: 'An exploration of interactive technology and visual experiences.',
        technologies: ['Three.js', 'WebGL', 'React'],
    },
];

export default function Work() {
    return (
        <section id="work" className={styles.work}>
            <header className={styles.header}>
                <span className={styles.eyebrow}>02 / SELECTED WORK</span>
                <h2>Things I've built.</h2>
                <p>
                    A collection of projects exploring software,
                    design and interactive technology.
                </p>
            </header>

            <div className={styles.projects}>
                {projects.map((project) => (
                    <article className={styles.project} key={project.number}>
                        <span className={styles.number}>{project.number}</span>

                        <div className={styles.projectInfo}>
                            <span className={styles.category}>
                                {project.category}
                            </span>

                            <h3>{project.title}</h3>

                            <p>{project.description}</p>

                            <div className={styles.technologies}>
                                {project.technologies.map((tech) => (
                                    <span key={tech}>{tech}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.preview}>
                            <span>PROJECT PREVIEW</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}