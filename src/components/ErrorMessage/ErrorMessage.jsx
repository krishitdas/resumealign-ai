import Button from '../Button/Button.jsx';
import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ title, message, onRetry }) {
  return (
    <div className={styles.errorContainer} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </span>
      <div className={styles.errorContent}>
        <p className={styles.errorTitle}>{title || 'Something went wrong'}</p>
        <p className={styles.errorMessage} style={{ whiteSpace: 'pre-wrap' }}>
          {message || 'An unexpected error occurred. Please try again.'}
        </p>
        {onRetry && (
          <div className={styles.retryButton}>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
