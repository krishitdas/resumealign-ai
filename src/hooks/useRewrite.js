import { useState, useCallback, useRef } from 'react';
import { rewriteBullets } from '../services/api.js';
import { validateInputs } from '../utils/validation.js';

/**
 * Custom hook managing the full rewrite workflow:
 * form state, validation, API call, and results.
 *
 * Includes a deduplication guard via `inflight` ref so that
 * React StrictMode or rapid clicks can never produce concurrent requests.
 */
export function useRewrite() {
  const [jobDescription, setJobDescription] = useState('');
  const [bulletPoints, setBulletPoints] = useState('');
  const [style, setStyle] = useState('professional');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Guard against concurrent / duplicate requests
  const inflight = useRef(false);

  const handleRewrite = useCallback(async () => {
    // Prevent duplicate in-flight requests
    if (inflight.current) {
      console.warn('[useRewrite] Request already in flight — ignoring duplicate call');
      return;
    }

    setError(null);
    setFieldErrors({});

    const { valid, errors } = validateInputs({ jobDescription, bulletPoints });
    if (!valid) {
      setFieldErrors(errors);
      return;
    }

    inflight.current = true;
    setLoading(true);
    setResults(null);

    console.log('[useRewrite] Sending rewrite request…');

    try {
      const data = await rewriteBullets({
        jobDescription: jobDescription.trim(),
        bulletPoints: bulletPoints.trim(),
        style,
      });

      console.log('[useRewrite] Received response:', {
        bulletCount: data.rewrittenBullets?.length,
        atsScore: data.atsScore,
        model: data._meta?.model,
      });

      setResults(data);
    } catch (err) {
      console.error('[useRewrite] Request failed:', err.message);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      inflight.current = false;
      setLoading(false);
    }
  }, [jobDescription, bulletPoints, style]);

  const handleReset = useCallback(() => {
    setJobDescription('');
    setBulletPoints('');
    setStyle('professional');
    setResults(null);
    setError(null);
    setFieldErrors({});
  }, []);

  const handleRewriteAgain = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    // Form state
    jobDescription,
    setJobDescription,
    bulletPoints,
    setBulletPoints,
    style,
    setStyle,

    // Results & status
    results,
    loading,
    error,
    fieldErrors,

    // Actions
    handleRewrite,
    handleReset,
    handleRewriteAgain,
  };
}
