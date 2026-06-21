const API_BASE = '/api';

/**
 * User-friendly error messages for common failure scenarios.
 */
const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection and try again.',
  TIMEOUT: 'The request took too long. The AI model might be under heavy load — please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  SERVER: 'A server error occurred. Please try again later.',
  API_KEY: 'The Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.',
  PARSE: 'Failed to process the AI response. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};

/**
 * Send resume data for AI rewriting.
 * @param {Object} params
 * @param {string} params.jobDescription
 * @param {string} params.bulletPoints
 * @param {string} params.style
 * @returns {Promise<Object>} Rewrite results
 */
export async function rewriteBullets({ jobDescription, bulletPoints, style }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s – allows model fallback

  try {
    const response = await fetch(`${API_BASE}/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, bulletPoints, style }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Build a detailed error message that surfaces Gemini's actual error
      let detail = errorData.error || ERROR_MESSAGES.SERVER;

      if (errorData.modelsAttempted) {
        detail += `\n\nModels attempted: ${errorData.modelsAttempted.join(', ')}`;
      }

      if (errorData.geminiErrors && Array.isArray(errorData.geminiErrors)) {
        const summaries = errorData.geminiErrors.map((e) => {
          const msg =
            typeof e.detail === 'object'
              ? e.detail?.error?.message || JSON.stringify(e.detail)
              : e.detail;
          return `• ${e.model} (${e.status}): ${msg}`;
        });
        detail += '\n\n' + summaries.join('\n');
      }

      if (response.status === 429) {
        throw new Error(detail || ERROR_MESSAGES.RATE_LIMIT);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error(detail || ERROR_MESSAGES.API_KEY);
      }

      throw new Error(detail);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES.TIMEOUT);
    }
    if (error.message === 'Failed to fetch' || error.message === 'Load failed') {
      throw new Error(ERROR_MESSAGES.NETWORK);
    }

    throw error;
  }
}
