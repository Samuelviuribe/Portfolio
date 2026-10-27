import styles from './Navbar.module.css';

const links = [
    {label: 'Work', href:"#Work"},
    {label: 'About', href:"#About"},
    {label: 'Contact', href:"#Contact"}
]

export default function Navbar(){
    return(
       <nav className={styles.navbar} aria-label="Main navigation">
            <a href="#home" className={styles.brand}>
                Samuel Viaña Uribe
            </a>

            <div className={styles.links}>
                {links.map((link) => (
                    <a key={link.href} href={link.href}>
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}