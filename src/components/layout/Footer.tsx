import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>
                    © {currentYear} e-Voting Kampus. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
