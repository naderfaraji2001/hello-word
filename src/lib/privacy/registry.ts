export const CONSENT_STORAGE_KEY = 'utopia-cookie-consent-v1';
export const CONSENT_VERSION = 1;
export const CONSENT_VALID_DAYS = 180;

export type ConsentCategory = 'essential' | 'analytics' | 'functional' | 'marketing';

export const consentCategories = {
  essential: {
    label: 'Essential technologies',
    description: 'Required for consent preferences, form continuity, security, and request confirmation.',
    required: true,
    active: true,
  },
  analytics: {label: 'Analytics', description: 'Audience measurement and website usage analysis.', required: false, active: false},
  functional: {label: 'Functional', description: 'Optional enhancements supplied by third parties.', required: false, active: false},
  marketing: {label: 'Marketing', description: 'Advertising and cross-site tracking.', required: false, active: false},
} as const;

export const activeOptionalCategories = (Object.keys(consentCategories) as ConsentCategory[]).filter(
  category => !consentCategories[category].required && consentCategories[category].active,
);

export const storageRegistry = [
  {name: CONSENT_STORAGE_KEY, provider: 'Utopia Tech Solutions', purpose: 'Local storage record of the consent version, selected categories, and decision time.', category: 'Essential', duration: `${CONSENT_VALID_DAYS} days`},
  {name: 'utopia-receipt', provider: 'Utopia Tech Solutions', purpose: 'HTTP-only cookie used to confirm a completed assessment request on the thank-you page.', category: 'Essential', duration: '1 hour'},
  {name: 'utopia-intro', provider: 'Utopia Tech Solutions', purpose: 'Session storage flag that prevents the introductory transition from repeating in the same browser tab.', category: 'Essential', duration: 'Browser tab session'},
  {name: 'utopia-assessment-v1', provider: 'Utopia Tech Solutions', purpose: 'Session storage draft of an unfinished assessment so it can be restored in the same browser tab.', category: 'Essential', duration: 'Browser tab session or until cleared/submitted'},
  {name: 'utopia-assessment-attempt-v1 / utopia-contact-attempt-v1', provider: 'Utopia Tech Solutions', purpose: 'Session storage identifiers used to avoid duplicating a form submission after a retry.', category: 'Essential', duration: 'Browser tab session or until submission completes'},
  {name: 'utopia-assessment-checking-v1 / utopia-contact-checking-v1', provider: 'Utopia Tech Solutions', purpose: 'Session storage status tokens used to check an uncertain form submission without resending it.', category: 'Essential', duration: 'Browser tab session or until submission completes'},
] as const;

export const serviceRegistry = [
  {name: 'Google Sheets API', provider: 'Google', purpose: 'Receives contact and assessment submissions only when the production Google Sheets storage mode is configured.', status: 'Conditional integration present in the codebase'},
  {name: 'Redis-compatible REST storage', provider: 'Provider not identified in the repository', purpose: 'Supports submission state and rate limiting when Google Sheets storage is configured.', status: 'Conditional integration present in the codebase'},
] as const;
