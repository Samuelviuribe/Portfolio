
'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const start = Date.now();
        let hideTimer: number;
        let removeTimer: number;

        const waitForLoad = new Promise<void>((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', () => resolve(), { once: true });
            }
        });

        waitForLoad.then(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 2500 - elapsed);

            hideTimer = window.setTimeout(() => {
                setExiting(true);

                removeTimer = window.setTimeout(() => {
                    setVisible(false);
                }, 800);
            }, remaining);
        });

        return () => {
            window.clearTimeout(hideTimer);
            window.clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`${styles.loader} ${exiting ? styles.exiting : ''}`}>
            <div className={styles.content}>
                <span className={styles.name}>SAMUEL VIAÑA</span>
                <div className={styles.progress}>
                    <div className={styles.progressBar} />
                </div>
                <span className={styles.label}>LOADING EXPERIENCE</span>
            </div>
        </div>
    );
}
