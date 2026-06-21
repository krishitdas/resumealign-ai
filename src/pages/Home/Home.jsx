import { useRewrite } from '../../hooks/useRewrite.js';
import TextArea from '../../components/TextArea/TextArea.jsx';
import StyleSelector from '../../components/StyleSelector/StyleSelector.jsx';
import Button from '../../components/Button/Button.jsx';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import styles from './Home.module.css';

export default function Home() {
  const {
    jobDescription,
    setJobDescription,
    bulletPoints,
    setBulletPoints,
    style,
    setStyle,
    results,
    loading,
    error,
    fieldErrors,
    handleRewrite,
    handleReset,
    handleRewriteAgain,
  } = useRewrite();

  const hasInput = jobDescription.trim() || bulletPoints.trim();

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          AI-Powered Resume Optimization
        </div>
        <h1 className={styles.heroTitle}>
          Tailor your resume to{' '}
          <span className={styles.heroAccent}>any job description</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Paste a job description and your resume bullets. Get ATS-optimized rewrites,
          keyword analysis, and a match score — in seconds.
        </p>
      </section>

      {/* Input Section */}
      <div className={styles.mainContent} id="input">
        <section className={styles.inputSection} aria-label="Input">
          <div className={styles.inputGrid}>
            <TextArea
              id="job-description"
              label="Job Description"
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the full job description here. Include the role title, responsibilities, and requirements for best results."
              maxLength={5000}
              helperText="The more detail you provide, the better the keyword matching."
              error={fieldErrors.jobDescription}
              required
            />
            <TextArea
              id="bullet-points"
              label="Resume Bullet Points"
              value={bulletPoints}
              onChange={setBulletPoints}
              placeholder="Paste your existing resume bullet points, one per line. For example:&#10;&#10;- Developed web applications using React and Node.js&#10;- Managed a team of 5 engineers&#10;- Increased deployment frequency by 40%"
              maxLength={3000}
              helperText="Include 3-8 bullet points for optimal results."
              error={fieldErrors.bulletPoints}
              required
            />
          </div>

          <StyleSelector selected={style} onSelect={setStyle} />

          <div className={styles.actionBar}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleRewrite}
              loading={loading}
              disabled={loading}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              }
            >
              Rewrite Bullets
            </Button>

            <div className={styles.actionGroup}>
              {results && (
                <Button variant="secondary" onClick={handleRewriteAgain}>
                  Rewrite Again
                </Button>
              )}
              {hasInput && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  disabled={loading}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                  }
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className={styles.resultsSection} aria-label="Results">
          {(loading || results || error) && (
            <div className={styles.resultsDivider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerLabel}>Results</span>
              <div className={styles.dividerLine} />
            </div>
          )}

          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <ErrorMessage
              title="Rewrite Failed"
              message={error}
              onRetry={handleRewrite}
            />
          )}

          {results && !loading && <ResultsPanel data={results} />}

          {!loading && !results && !error && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className={styles.emptyText}>
                Your rewritten bullet points, ATS score, and keyword analysis will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
