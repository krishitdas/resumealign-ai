import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer} aria-busy="true" aria-label="Loading results">
      <div className={styles.loadingMessage}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>
          Analyzing your resume against the job description...
        </p>
      </div>

      <div className={styles.skeletonRow}>
        {/* Score skeleton */}
        <div className={styles.skeletonCard}>
          <div className={`${styles.skeletonLineShort} ${styles.shimmer}`} />
          <div className={`${styles.skeletonScore} ${styles.shimmer}`} />
          <div className={`${styles.skeletonBar} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLineMedium} ${styles.shimmer}`} />
        </div>

        {/* Keywords skeleton */}
        <div className={styles.skeletonCard}>
          <div className={`${styles.skeletonLineShort} ${styles.shimmer}`} />
          <div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className={`${styles.skeletonTag} ${styles.shimmer}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Bullets skeleton */}
      <div className={styles.skeletonCard} style={{ padding: 0 }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <div className={`${styles.skeletonLineShort} ${styles.shimmer}`} />
        </div>
        <div className={styles.skeletonBulletGroup}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonBullet}>
              <div className={`${styles.skeletonDot} ${styles.shimmer}`} />
              <div className={styles.skeletonBulletLines}>
                <div className={`${styles.skeletonLineWide} ${styles.shimmer}`} />
                <div className={`${styles.skeletonLineMedium} ${styles.shimmer}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
