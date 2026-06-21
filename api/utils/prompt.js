/**
 * Builds the Gemini prompt for resume bullet point rewriting.
 * @param {string} jobDescription
 * @param {string} bulletPoints
 * @param {string} style
 * @returns {string} The constructed prompt
 */
export function buildPrompt(jobDescription, bulletPoints, style) {
  const styleInstructions = {
    professional: `
      - Use formal, polished language appropriate for corporate environments.
      - Emphasize clarity, precision, and professionalism.
      - Use industry-standard terminology.`,
    technical: `
      - Emphasize technical skills, tools, frameworks, and quantifiable metrics.
      - Include specific technologies, programming languages, and methodologies.
      - Lead with technical accomplishments and data-driven results.`,
    leadership: `
      - Highlight leadership, mentorship, strategy, and team management.
      - Emphasize cross-functional collaboration and stakeholder management.
      - Focus on organizational impact and people development.`,
    impact: `
      - Lead every bullet with measurable outcomes and results.
      - Quantify improvements with percentages, dollar amounts, or scale.
      - Emphasize business value, revenue impact, and efficiency gains.`,
  };

  return `You are an experienced technical recruiter and ATS (Applicant Tracking System) expert with 15+ years of experience reviewing resumes for top technology companies.

Your task is to analyze a job description and rewrite existing resume bullet points to be highly optimized for ATS compatibility while maintaining complete truthfulness.

=== JOB DESCRIPTION ===
${jobDescription}

=== EXISTING RESUME BULLET POINTS ===
${bulletPoints}

=== REWRITE STYLE ===
${style.charAt(0).toUpperCase() + style.slice(1)}
${styleInstructions[style] || styleInstructions.professional}

=== INSTRUCTIONS ===

1. REWRITE each bullet point following these rules:
   - NEVER invent or fabricate experience, skills, or accomplishments.
   - PRESERVE the original meaning and truthfulness of each bullet.
   - START each bullet with a strong action verb (e.g., Developed, Implemented, Led, Optimized, Architected, Reduced, Increased).
   - INCORPORATE relevant keywords from the job description where they naturally fit.
   - KEEP bullets concise — ideally 1-2 lines each.
   - IMPROVE readability and professionalism.
   - USE quantifiable metrics if they exist in the original (do not invent metrics).
   - REMOVE filler words and vague language.

2. EXTRACT important keywords and phrases from the job description that ATS systems would scan for.

3. IDENTIFY skills, technologies, or qualifications mentioned in the job description that are MISSING from the resume bullets.

4. CALCULATE an ATS match score from 0 to 100 based on:
   - Keyword overlap between resume and job description
   - Use of action verbs
   - Relevance of experience to role requirements
   - Overall alignment with the position

5. PROVIDE 2-4 concise improvement suggestions.

=== RESPONSE FORMAT ===

You MUST respond with valid JSON only. No markdown, no explanation, no code fences. Just the raw JSON object:

{
  "rewrittenBullets": ["bullet 1", "bullet 2", "..."],
  "keywords": ["keyword1", "keyword2", "..."],
  "missingSkills": ["skill1", "skill2", "..."],
  "atsScore": 75,
  "suggestions": ["suggestion 1", "suggestion 2", "..."]
}

Respond ONLY with the JSON object. Nothing else.`;
}
