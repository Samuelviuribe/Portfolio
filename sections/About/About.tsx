'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/sections/About/about.module.css';

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
    const trackRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const animation = track.animate(
            [
                { transform: 'translateX(0)' },
                { transform: 'translateX(-50%)' },
            ],
            {
                duration: 22000,
                iterations: Infinity,
                easing: 'linear',
            },
        );

        animation.pause();
        setPaused(false);

        const updateAnimation = () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                animation.pause();
                setPaused(true);
            } else {
                animation.play();
                setPaused(false);
            }
        };

        updateAnimation();

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', updateAnimation);

        return () => {
            animation.cancel();
            mediaQuery.removeEventListener('change', updateAnimation);
        };
    }, []);

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
                    <span className={styles.skillsLabel}>
                        TOOLS & TECHNOLOGIES
                    </span>

                    <div
                        className={styles.carousel}
                        onMouseEnter={() => {
                            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                trackRef.current?.getAnimations().forEach((animation) => animation.pause());
                            }
                        }}
                        onMouseLeave={() => {
                            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                trackRef.current?.getAnimations().forEach((animation) => animation.play());
                            }
                        }}
                    >
                        <div
                            ref={trackRef}
                            className={styles.carouselTrack}
                            data-paused={paused}
                        >
                            {[...technologies, ...technologies].map((technology, index) => (
                                <div
                                    className={styles.technology}
                                    key={`${technology}-${index}`}
                                    aria-hidden={index >= technologies.length}
                                >
                                    <span className={styles.technologyDot} />
                                    {technology}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}