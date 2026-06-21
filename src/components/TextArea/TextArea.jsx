import { useState } from 'react';
import styles from './TextArea.module.css';

export default function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength = 5000,
  helperText,
  error,
  required = false,
}) {
  const [focused, setFocused] = useState(false);
  const charCount = value.length;
  const charPercent = maxLength ? (charCount / maxLength) * 100 : 0;

  const charCountClass = charPercent > 95
    ? styles.charCountError
    : charPercent > 80
      ? styles.charCountWarn
      : styles.charCount;

  return (
    <div className={`${styles.textareaGroup} ${error ? styles.error : ''}`}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        {maxLength && (
          <span className={charCountClass} aria-live="polite">
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        )}
      </div>

      <div className={`${styles.textareaWrapper} ${focused ? styles.focused : ''}`}>
        <textarea
          id={id}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${id}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}
