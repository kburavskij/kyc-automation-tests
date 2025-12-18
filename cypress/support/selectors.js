// cypress/support/selectors.js
// Centralized selector constants for maintainability

export const SELECTORS = {
  // Registration Form Selectors
  REGISTRATION: {
    EMAIL_INPUT: 'input[type="email"], input[name="email"], input[placeholder*="email" i]',
    PASSWORD_INPUT: 'input[type="password"], input[name="password"], input[placeholder*="password" i]',
    PHONE_INPUT: 'input[type="tel"], input[name="phone"], input[placeholder*="phone" i]',
    REGISTER_BUTTON: 'button[type="submit"], button:contains("Register"), button:contains("Sign Up")',
    EMAIL_ERROR: '.error:contains("email"), .error-message:contains("email"), [class*="error"][class*="email"]',
    PASSWORD_ERROR: '.error:contains("password"), .error-message:contains("password"), [class*="error"][class*="password"]',
    PHONE_ERROR: '.error:contains("phone"), .error-message:contains("phone"), [class*="error"][class*="phone"]',
    SUCCESS_MESSAGE: '.success, .success-message, [class*="success"]',
    FORM_CONTAINER: 'form, .registration-form, [class*="registration"]'
  },

  // KYC Document Upload Selectors
  KYC: {
    UPLOAD_INPUT: 'input[type="file"]',
    UPLOAD_BUTTON: 'button:contains("Upload"), button:contains("Submit"), button[type="submit"]',
    UPLOAD_AREA: '[class*="drop"], [class*="upload"], .upload-zone',
    STATUS_DISPLAY: '[class*="status"], .kyc-status, .verification-status',
    STATUS_PENDING: ':contains("no_documents"), :contains("pending"), :contains("Pending")',
    STATUS_VALIDATING: ':contains("validating"), :contains("Validating"), :contains("processing")',
    STATUS_VALID: ':contains("valid"), :contains("Verified"), :contains("approved")',
    STATUS_INVALID: ':contains("invalid"), :contains("rejected"), :contains("failed")',
    ERROR_MESSAGE: '.error, .error-message, [class*="error"]',
    SUCCESS_MESSAGE: '.success, .success-message, [class*="success"]',
    LOADING_INDICATOR: '[class*="loading"], [class*="spinner"], .loading',
    RETRY_BUTTON: 'button:contains("Retry"), button:contains("Try Again"), button:contains("Upload")'
  },

  // Dashboard/Feature Access Selectors
  DASHBOARD: {
    SEND_PAYMENT_BUTTON: 'button:contains("Send"), button:contains("Payment"), button:contains("Transfer")',
    WALLET_BALANCE: '[class*="balance"], .balance, .wallet-balance',
    USER_INFO: '[class*="user"], .user-info, .profile',
    FEATURE_LOCKED: '[class*="locked"], [class*="disabled"], .locked-feature',
    FEATURE_ENABLED: '[class*="enabled"], [class*="active"], .enabled-feature'
  },

  // Common Selectors
  COMMON: {
    SUBMIT_BUTTON: 'button[type="submit"]',
    LOADING: '[class*="loading"], .loading, .spinner',
    ERROR: '.alert, .alert-error, .error, .error-message, [class*="error"]',
    SUCCESS: '.success, .success-message, [class*="success"]',
    MODAL: '.modal, [class*="modal"], [role="dialog"]',
    CLOSE_BUTTON: 'button:contains("Close"), button:contains("×"), .close',
    CONTAINER: '.container, [class*="container"], main'
  }
};

// Helper function to get selector
export const getSelector = (category, key) => {
  return SELECTORS[category]?.[key] || null;
};