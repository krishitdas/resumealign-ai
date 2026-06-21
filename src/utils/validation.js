/**
 * Validates the rewrite form inputs.
 * @param {Object} params
 * @param {string} params.jobDescription
 * @param {string} params.bulletPoints
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateInputs({ jobDescription, bulletPoints }) {
  const errors = {};

  const trimmedJD = jobDescription.trim();
  const trimmedBP = bulletPoints.trim();

  if (!trimmedJD) {
    errors.jobDescription = 'Job description is required.';
  } else if (trimmedJD.length < 30) {
    errors.jobDescription = 'Job description seems too short. Please provide more detail.';
  }

  if (!trimmedBP) {
    errors.bulletPoints = 'Resume bullet points are required.';
  } else if (trimmedBP.length < 20) {
    errors.bulletPoints = 'Please provide at least one complete bullet point.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
