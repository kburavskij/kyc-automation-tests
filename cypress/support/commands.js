// cypress/support/commands.js
// Custom Commands with const-based selectors

import { SELECTORS } from './selectors';

/**
 * Dynamic environment configuration
 */
const getEnvironmentConfig = () => {
  const environment = Cypress.env('TEST_ENV') || 'local';
  
  const configs = {
    local: {
      baseUrl: 'http://localhost:3001',
      apiUrl: 'http://localhost:3000/api'
    },
    sandbox: {
      baseUrl: 'https://sandbox.vialet.io',
      apiUrl: 'https://api-sandbox.vialet.io'
    },
    production: {
      baseUrl: 'https://app.vialet.io',
      apiUrl: 'https://api.vialet.io'
    }
  };

  return configs[environment] || configs.local;
};

/**
 * Dynamic visit command based on environment
 * Usage: cy.visitApp('/path')
 */
Cypress.Commands.add('visitApp', (path = '') => {
  const config = getEnvironmentConfig();
  cy.visit(`${config.baseUrl}${path}`);
});

/**
 * Complete registration flow - enters email, password, and phone
 * This is the cy.register() function you requested
 * Usage: cy.register(email, password, phone)
 */
Cypress.Commands.add('register', (email, password, phone) => {
  // Visit registration page
  cy.visitApp('/');
  
  // Wait for form to be ready
  cy.get(SELECTORS.REGISTRATION.FORM_CONTAINER, { timeout: 10000 }).should('be.visible');
  
  // Fill in registration form
  cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT)
    .should('be.visible')
    .clear()
    .type(email);
  
  cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
    .should('be.visible')
    .clear()
    .type(password);
  
  cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
    .should('be.visible')
    .clear()
    .type(phone);
  
  // Submit registration
  cy.get(SELECTORS.REGISTRATION.REGISTER_BUTTON).click();
});

/**
 * Login command (for future use if app adds login)
 * Usage: cy.login(email, password)
 */
Cypress.Commands.add('login', (email, password) => {
  const config = getEnvironmentConfig();
  
  cy.visitApp('/login');
  
  cy.get('input[type="email"], input[name="email"]')
    .should('be.visible')
    .clear()
    .type(email);
  
  cy.get('input[type="password"], input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password);
  
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect
  cy.url().should('not.include', '/login');
});

/**
 * Generate unique test user data
 * Usage: const user = cy.generateTestUser()
 */
Cypress.Commands.add('generateTestUser', () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  
  return {
    email: `test.user.${timestamp}.${randomNum}@example.com`,
    password: 'SecurePass123!',
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  };
});

/**
 * Upload file with proper handling
 * Usage: cy.uploadDocument('valid_id.jpeg')
 */
Cypress.Commands.add('uploadDocument', (fileName) => {
  cy.get(SELECTORS.KYC.UPLOAD_INPUT).attachFile({
    filePath: `test-documents/${fileName}`,
    encoding: 'base64'
  });
});

/**
 * Wait for KYC status to reach expected state
 * Usage: cy.waitForKYCStatus('valid', 25000)
 */
Cypress.Commands.add('waitForKYCStatus', (expectedStatus, timeout = 25000) => {
  const statusMap = {
    'pending': SELECTORS.KYC.STATUS_PENDING,
    'validating': SELECTORS.KYC.STATUS_VALIDATING,
    'valid': SELECTORS.KYC.STATUS_VALID,
    'invalid': SELECTORS.KYC.STATUS_INVALID
  };
  
  const selector = statusMap[expectedStatus.toLowerCase()] || SELECTORS.KYC.STATUS_DISPLAY;
  
  cy.get(selector, { timeout })
    .should('be.visible');
});

/**
 * Register and login a user (complete flow)
 * Returns userId for API calls
 */
Cypress.Commands.add('registerAndLogin', () => {
  const testUser = {
    email: `test.${Date.now()}@example.com`,
    password: 'SecurePass123!',
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  };
  
  cy.register(testUser.email, testUser.password, testUser.phone);
  
  // Store user info for later use
  cy.wrap(testUser).as('currentUser');
  
  return cy.wrap(testUser);
});

/**
 * API request with dynamic environment URL
 * Usage: cy.apiRequest('POST', '/users', body)
 */
Cypress.Commands.add('apiRequest', (method, endpoint, body = null, headers = {}) => {
  const config = getEnvironmentConfig();
  
  return cy.request({
    method,
    url: `${config.apiUrl}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    failOnStatusCode: false
  });
});

/**
 * Wait for page to fully load
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().its('document.readyState').should('equal', 'complete');
});

/**
 * Check if element contains text (case-insensitive)
 */
Cypress.Commands.add('containsText', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should(($el) => {
    const elementText = $el.text().toLowerCase();
    const searchText = text.toLowerCase();
    expect(elementText).to.include(searchText);
  });
});

/**
 * Retry action with exponential backoff
 */
Cypress.Commands.add('retryAction', (action, maxAttempts = 3) => {
  const attempt = (attemptNum) => {
    if (attemptNum >= maxAttempts) {
      throw new Error(`Action failed after ${maxAttempts} attempts`);
    }
    
    try {
      action();
    } catch (error) {
      cy.wait(1000 * attemptNum);
      attempt(attemptNum + 1);
    }
  };
  
  attempt(0);
});
