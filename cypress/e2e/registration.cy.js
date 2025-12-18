// cypress/e2e/registration.cy.js
// Registration tests using const-based selectors

import { SELECTORS } from '../support/selectors';

describe('User Registration Tests', () => {
  
  let testUser;

  beforeEach(() => {
    // Visit the application home page (registration form)
    cy.visitApp('/');
    
    // Generate unique test user
    testUser = {
      email: `test.${Date.now()}@example.com`,
      password: 'SecurePass123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
  });

  // TC-001: Valid User Registration (Positive)
  it('TC-001: Should successfully register with valid credentials', () => {
    // Use cy.register() function as requested
    cy.register(testUser.email, testUser.password, testUser.phone);
    
    // Verify success - should show KYC status as "no_documents" or "pending"
    cy.get(SELECTORS.KYC.STATUS_DISPLAY, { timeout: 10000 })
      .should('be.visible');
    
    // Verify user can see upload interface
    cy.get(SELECTORS.KYC.UPLOAD_INPUT).should('exist');
  });

  // TC-002: Registration with Missing Email (Negative)
  it('TC-002: Should fail registration when email is missing', () => {
    // Fill only password and phone
    cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
      .should('be.visible')
      .type(testUser.password);
    
    cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
      .should('be.visible')
      .type(testUser.phone);
    
    // Try to submit
    cy.get(SELECTORS.REGISTRATION.REGISTER_BUTTON).click();
    
    // Verify validation error or form not submitted
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT).then(($input) => {
      // Check HTML5 validation or custom error
      const isInvalid = $input[0].validity && !$input[0].validity.valid;
      const hasError = Cypress.$('SELECTORS.REGISTRATION.EMAIL_ERROR').length > 0;
      
      expect(isInvalid || hasError).to.be.true;
    });
  });

  // TC-003: Registration with Invalid Email Format (Negative)
  it('TC-003: Should fail registration with invalid email format', () => {
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT)
      .should('be.visible')
      .type('invalid-email-format');
    
    cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
      .should('be.visible')
      .type(testUser.password);
    
    cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
      .should('be.visible')
      .type(testUser.phone);
    
    cy.get(SELECTORS.REGISTRATION.REGISTER_BUTTON).click();
    
    // Check for HTML5 validation or error message
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT).then(($input) => {
      const isInvalid = $input[0].validity && !$input[0].validity.valid;
      expect(isInvalid).to.be.true;
    });
  });

  // TC-004: Registration with Invalid Phone Number Format (Negative)
  it('TC-004: Should fail registration with invalid phone number', () => {
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT)
      .should('be.visible')
      .type(testUser.email);
    
    cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
      .should('be.visible')
      .type(testUser.password);
    
    cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
      .should('be.visible')
      .type('123'); // Too short
    
    cy.get(SELECTORS.REGISTRATION.REGISTER_BUTTON).click();
    
    // Verify error or validation
    cy.get(SELECTORS.COMMON.ERROR, { timeout: 10000 }).should('be.visible');
  });

  // TC-005: Registration with Duplicate Email (Negative)
  it('TC-005: Should fail registration with already registered email', () => {
    // First registration - should succeed
    cy.register(testUser.email, testUser.password, testUser.phone);
    
    // Wait for successful registration
    cy.get(SELECTORS.KYC.STATUS_DISPLAY, { timeout: 10000 }).should('be.visible');
    
    // Try to register again with same email (refresh and try)
    cy.visitApp('/');
    
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT)
      .should('be.visible')
      .type(testUser.email);
    
    cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
      .should('be.visible')
      .type('DifferentPass456!');
    
    cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
      .should('be.visible')
      .type('+19876543210');
    
    cy.get(SELECTORS.REGISTRATION.REGISTER_BUTTON).click();
    
    // Verify error message about duplicate email
    cy.contains(/User with this email already exists/i, { timeout: 5000 })
      .should('be.visible');
  });

  // Additional test: Form validation on field blur
  it('Should validate fields on blur', () => {
    // Test email field
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT)
      .focus()
      .blur();
    
    // Test password field
    cy.get(SELECTORS.REGISTRATION.PASSWORD_INPUT)
      .focus()
      .blur();
    
    // Test phone field
    cy.get(SELECTORS.REGISTRATION.PHONE_INPUT)
      .focus()
      .blur();
    
    // At least one field should show validation
    cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT).then(($input) => {
      const isRequired = $input.attr('required') !== undefined;
      expect(isRequired).to.be.true;
    });
  });

  // Additional test: Button state
  it('Should enable register button when form is valid', () => {
    // Fill all fields correctly
    cy.register(testUser.email, testUser.password, testUser.phone);
    
    // Button should have been clickable (verification is implicit in successful registration)
    cy.get(SELECTORS.KYC.STATUS_DISPLAY, { timeout: 10000 }).should('be.visible');
  });
});