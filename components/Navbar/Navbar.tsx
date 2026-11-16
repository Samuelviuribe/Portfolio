
'use client';

import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const links = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
    const [lightMode, setLightMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isLight = savedTheme === 'light';

        setLightMode(isLight);
        document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    }, []);

    const toggleTheme = () => {
        const newTheme = lightMode ? 'dark' : 'light';

        setLightMode(!lightMode);
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={styles.navbar} aria-label="Main navigation">
            <div className={styles.identity}>
                <img src="/images/pic.jpg" alt="Imagen de perfil" />
                <a href="#home" className={styles.brand}>
                    Samuel Viaña Uribe
                </a>
            </div>

            <div className={styles.navigation}>
                <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                    {links.map((link) => (
                        <a key={link.href} href={link.href} onClick={closeMenu}>
                            {link.label}
                        </a>
                    ))}
                </div>

                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label="Cambiar tema"
                    title="Cambiar tema"
                >
                    {lightMode ? '☀' : '☾'}
                </button>

                <button
                    className={styles.menuToggle}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>
        </nav>
    );
}
