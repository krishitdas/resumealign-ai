import { buildPrompt } from './utils/prompt.js';

/**
 * Ordered list of Gemini models to try. If one fails with a quota/availability
 * error we fall through to the next.
 */
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

/** Build the full Gemini REST URL for a given model name. */
function geminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

/** Global request counter for logging. */
let requestCounter = 0;

/**
 * Vercel Serverless Function: POST /api/rewrite
 *
 * Accepts job description, bullet points, and style.
 * Calls Google Gemini API (with model fallback) and returns structured resume analysis.
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Gemini API key is not configured. Set the GEMINI_API_KEY environment variable.',
    });
  }

  // Parse and validate request body
  const { jobDescription, bulletPoints, style } = req.body || {};

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 30) {
    return res.status(400).json({
      error: 'Please provide a job description with at least 30 characters.',
    });
  }

  if (!bulletPoints || typeof bulletPoints !== 'string' || bulletPoints.trim().length < 20) {
    return res.status(400).json({
      error: 'Please provide resume bullet points with at least 20 characters.',
    });
  }

  const validStyles = ['professional', 'technical', 'leadership', 'impact'];
  const selectedStyle = validStyles.includes(style) ? style : 'professional';

  // Build the prompt once – reused across model attempts.
  const prompt = buildPrompt(jobDescription.trim(), bulletPoints.trim(), selectedStyle);

  requestCounter++;
  const reqId = requestCounter;

  console.log(`[Gemini #${reqId}] New request | prompt length: ${prompt.length} chars`);

  // ---------- Try each model in the fallback chain ----------
  const modelErrors = [];

  for (const model of GEMINI_MODELS) {
    console.log(`[Gemini #${reqId}] Trying model: ${model}`);

    try {
      const geminiResponse = await fetch(`${geminiUrl(model)}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      });

      console.log(`[Gemini #${reqId}] ${model} responded with status ${geminiResponse.status}`);

      if (!geminiResponse.ok) {
        const errBody = await geminiResponse.text();
        console.error(`[Gemini #${reqId}] ${model} error body:`, errBody);

        const errInfo = { model, status: geminiResponse.status, body: errBody };
        modelErrors.push(errInfo);

        // If quota / rate-limit / not-found – try next model
        if (
          geminiResponse.status === 429 ||
          geminiResponse.status === 404 ||
          geminiResponse.status === 503
        ) {
          console.log(`[Gemini #${reqId}] ${model} unavailable (${geminiResponse.status}), trying next model…`);
          continue;
        }

        // Auth errors – no point trying other models with the same key
        if (geminiResponse.status === 401 || geminiResponse.status === 403) {
          return res.status(401).json({
            error: 'Invalid or unauthorised Gemini API key. Please check your GEMINI_API_KEY.',
            geminiStatus: geminiResponse.status,
            geminiError: safeParseJson(errBody),
          });
        }

        // Other server error – try next model
        continue;
      }

      // ---------- Success path ----------
      const geminiData = await geminiResponse.json();
      const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        console.error(`[Gemini #${reqId}] ${model} returned empty content:`, JSON.stringify(geminiData));
        modelErrors.push({ model, status: 200, body: 'Empty response from model' });
        continue;
      }

      console.log(`[Gemini #${reqId}] ${model} returned ${textContent.length} chars of content`);

      // Parse JSON response
      let parsed;
      try {
        const cleaned = textContent
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error(`[Gemini #${reqId}] ${model} JSON parse failed:`, textContent);
        modelErrors.push({ model, status: 200, body: `JSON parse error: ${parseErr.message}` });
        continue;
      }

      // Validate response shape
      const result = {
        rewrittenBullets: Array.isArray(parsed.rewrittenBullets) ? parsed.rewrittenBullets : [],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
        atsScore: typeof parsed.atsScore === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsed.atsScore)))
          : 50,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      };

      if (result.rewrittenBullets.length === 0) {
        console.error(`[Gemini #${reqId}] ${model} returned no bullets`);
        modelErrors.push({ model, status: 200, body: 'No rewritten bullets in response' });
        continue;
      }

      console.log(`[Gemini #${reqId}] ✅ Success with model ${model} | ${result.rewrittenBullets.length} bullets, ATS score ${result.atsScore}`);

      return res.status(200).json({
        ...result,
        _meta: { model, requestId: reqId },
      });
    } catch (fetchError) {
      console.error(`[Gemini #${reqId}] ${model} fetch error:`, fetchError.message);
      modelErrors.push({ model, status: 0, body: fetchError.message });
      continue;
    }
  }

  // ---------- All models failed ----------
  console.error(`[Gemini #${reqId}] All models exhausted. Errors:`, JSON.stringify(modelErrors));

  const lastError = modelErrors[modelErrors.length - 1];
  const isQuotaIssue = modelErrors.some((e) => e.status === 429);

  return res.status(isQuotaIssue ? 429 : 502).json({
    error: isQuotaIssue
      ? 'All available Gemini models have exceeded their quota. Please wait a few minutes and try again, or check your Google Cloud billing.'
      : 'Failed to get a response from any available AI model. Please try again.',
    modelsAttempted: modelErrors.map((e) => `${e.model} (${e.status})`),
    geminiErrors: modelErrors.map((e) => ({
      model: e.model,
      status: e.status,
      detail: safeParseJson(e.body),
    })),
  });
}

/**
 * Safely parse a string as JSON, falling back to the raw string.
 */
function safeParseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
