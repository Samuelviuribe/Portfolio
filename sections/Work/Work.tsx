 'use client';

import { useRef } from 'react';
import styles from './work.module.css';

const projects = [
    {
        number: '01',
        title: 'Project One',
        category: 'WEB DEVELOPMENT',
        description: 'A digital experience focused on design, functionality and interaction.',
        technologies: ['Next.js', 'React', 'TypeScript'],
        video: '/projects/acfinancial/Preview%20ACFinancial.mp4',
        
    },
    {
        number: '02',
        title: 'Project Two',
        category: 'SOFTWARE DEVELOPMENT',
        description: 'A software solution designed to solve a practical problem.',
        technologies: ['Python', 'Database', 'UI Design'],
        video: '/projects/magicballons/preview MagicBallons.mp4',
    },
    {
        number: '03',
        title: 'Project Three',
        category: 'CREATIVE DEVELOPMENT',
        description: 'An exploration of interactive technology and visual experiences.',
        technologies: ['Three.js', 'WebGL', 'React'],
        video: '/projects/sgdb/Preview_SGDB.mp4',
    },
];

function ProjectPreview({ video }: { video: string; }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(() => {});
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className={styles.preview}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                preload="none"
            />
        </div>
    );
}

export default function Work() {
    return (
        <section id="work" className={styles.work}>
            <header className={styles.header}>
                <span className={styles.eyebrow}>SELECTED WORK</span>
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

                        <ProjectPreview
                            video={project.video}
                            
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}