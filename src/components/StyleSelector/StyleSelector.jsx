import styles from './StyleSelector.module.css';

const STYLES = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Clear and polished',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
      </svg>
    ),
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Data and metrics driven',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Strategy and impact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'impact',
    label: 'Impact Focused',
    description: 'Results and outcomes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
];

export default function StyleSelector({ selected, onSelect }) {
  return (
    <fieldset className={styles.selectorGroup}>
      <legend className={styles.label}>Rewrite Style</legend>
      <div className={styles.options} role="radiogroup" aria-label="Select rewrite style">
        {STYLES.map((style) => (
          <label
            key={style.id}
            className={`${styles.option} ${selected === style.id ? styles.selected : ''}`}
            htmlFor={`style-${style.id}`}
          >
            <input
              type="radio"
              id={`style-${style.id}`}
              name="rewriteStyle"
              value={style.id}
              checked={selected === style.id}
              onChange={() => onSelect(style.id)}
              className={styles.hiddenInput}
            />
            <span className={styles.optionIcon} aria-hidden="true">
              {style.icon}
            </span>
            <span className={styles.optionLabel}>{style.label}</span>
            <span className={styles.optionDesc}>{style.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
