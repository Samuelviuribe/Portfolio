'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const start = Date.now();

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

            window.setTimeout(() => {
                setVisible(false);
            }, remaining);
        });
    }, []);

    if (!visible) return null;

    return (
        <div className={styles.loader}>
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
