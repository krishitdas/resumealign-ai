import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <p className={styles.footerText}>
        Built with React, Vite, and Google Gemini AI
        <span className={styles.separator}>·</span>
        <a
          href="https://ai.google.dev"
          className={styles.footerLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Gemini
        </a>
      </p>
    </footer>
  );
}
