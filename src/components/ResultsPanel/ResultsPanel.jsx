import { useState, useEffect } from 'react';
import Button from '../Button/Button.jsx';
import { copyToClipboard, downloadAsText } from '../../utils/export.js';
import styles from './ResultsPanel.module.css';

export default function ResultsPanel({ data }) {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const { rewrittenBullets, atsScore, keywords, missingSkills, suggestions } = data;

  const scoreClass = atsScore >= 75 ? 'High' : atsScore >= 50 ? 'Mid' : 'Low';

  const handleCopy = async () => {
    const text = rewrittenBullets.map((b) => `• ${b}`).join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setShowCopyFeedback(true);
    }
  };

  const handleDownload = () => {
    const text = rewrittenBullets.map((b) => `• ${b}`).join('\n');
    downloadAsText(text, 'resume-bullets.txt');
  };

  useEffect(() => {
    if (showCopyFeedback) {
      const timer = setTimeout(() => setShowCopyFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopyFeedback]);

  const getScoreHint = () => {
    if (atsScore >= 80) return 'Excellent match. Your resume aligns strongly with this role.';
    if (atsScore >= 60) return 'Good match. Consider adding missing keywords for better alignment.';
    if (atsScore >= 40) return 'Moderate match. Review missing skills to improve compatibility.';
    return 'Low match. Significant gaps exist between your resume and this role.';
  };

  return (
    <section className={styles.resultsPanel} id="results" aria-label="Results">
      {/* Score & Keywords Row */}
      <div className={styles.scoreSection}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreMain}>
            <div className={styles.scoreHeader}>
              <span className={styles.scoreLabel}>ATS Match Score</span>
            </div>
            <span className={`${styles.scoreValue} ${styles[`score${scoreClass}`]}`}>
              {atsScore}
            </span>
            <div className={styles.scoreBar}>
              <div
                className={`${styles.scoreBarFill} ${styles[`scoreBar${scoreClass}`]}`}
                style={{ width: `${atsScore}%` }}
              />
            </div>
            <p className={styles.scoreHint}>{getScoreHint()}</p>
          </div>
        </div>

        <div className={styles.keywordsCard}>
          <h3 className={styles.cardTitle}>Extracted Keywords</h3>
          <ul className={styles.tagList} aria-label="Keywords">
            {keywords.map((kw, i) => (
              <li key={i} className={styles.tag}>{kw}</li>
            ))}
          </ul>

          {missingSkills.length > 0 && (
            <>
              <h3 className={styles.cardTitle} style={{ marginTop: 'var(--space-5)' }}>
                Missing Skills
              </h3>
              <ul className={styles.tagList} aria-label="Missing skills">
                {missingSkills.map((skill, i) => (
                  <li key={i} className={`${styles.tag} ${styles.tagMissing}`}>{skill}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Rewritten Bullets */}
      <div className={styles.bulletsSection}>
        <div className={styles.bulletsHeader}>
          <h3 className={styles.bulletsTitle}>
            Rewritten Bullet Points ({rewrittenBullets.length})
          </h3>
          <div className={styles.bulletsActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              }
            >
              Copy All
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            >
              Download
            </Button>
          </div>
        </div>

        <ul className={styles.bulletList}>
          {rewrittenBullets.map((bullet, i) => (
            <li
              key={i}
              className={styles.bulletItem}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className={styles.bulletDot} aria-hidden="true" />
              <span className={styles.bulletText}>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className={styles.suggestionsSection}>
          <h3 className={styles.cardTitle}>Improvement Suggestions</h3>
          <ul className={styles.suggestionList}>
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                className={styles.suggestionItem}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className={styles.suggestionIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy Feedback Toast */}
      {showCopyFeedback && (
        <div className={styles.copyFeedback} role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied to clipboard
        </div>
      )}
    </section>
  );
}
