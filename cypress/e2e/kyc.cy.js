// cypress/e2e/kyc.cy.js
// KYC document upload tests using const-based selectors

import { SELECTORS } from '../support/selectors';

describe('KYC Document Upload Tests', () => {
  
  let testUser;

  beforeEach(() => {
    // Generate unique test user
    testUser = {
      email: `test.kyc.${Date.now()}@example.com`,
      password: 'SecurePass123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };

    // Register user using cy.register() as requested
    cy.register(testUser.email, testUser.password, testUser.phone);
    
    // Wait for registration to complete
    cy.get(SELECTORS.KYC.STATUS_DISPLAY, { timeout: 10000 }).should('be.visible');
  });

  // TC-006: Valid JPEG Document Upload (Positive)
  it('TC-006: Should successfully upload and verify valid JPEG document', () => {
    // Upload valid JPEG file (filename with "valid" will be approved by mock API)
    cy.uploadDocument('valid-id-europe.jpeg');
        
    // Verify status changes to "validating"
    cy.waitForKYCStatus('validating', 25000);
    
    // Wait for verification to complete (2-20 seconds)
    cy.waitForKYCStatus('valid', 25000);
    
    // Verify user has access to features
    cy.waitUntil(() => cy.contains(/Status: valid/i, { timeout: 25000 }).and('not.contain', 'Status: validating'));
  });

  // TC-007: Valid PDF Document Upload (Positive)
  it('TC-007: Should successfully upload and verify valid PDF document', () => {
    // Upload valid PDF file
    cy.uploadDocument('invalid-file-pdf.pdf');
        
    // Verify validating status
    cy.waitForKYCStatus('validating', 25000);
    
    // Wait for verification success
    cy.waitForKYCStatus('valid', 25000);
    
    // Verify success state
    cy.waitUntil(() => cy.contains(/Status: valid/i, { timeout: 25000 }).and('not.contain', 'Status: validating'));
  });

  // TC-008: Document Upload Exceeding Size Limit (Negative)
  it('TC-008: Should reject document larger than 5MB', () => {
    // Try to upload large file
    cy.uploadDocument('large-photo.jpeg');
        
    // Verify error message about file size
    cy.contains(/too large|exceeds/i, { timeout: 25000 })
      .should('be.visible');
  });

//   // TC-009: Document Upload with Unsupported Format (Negative)
//   it('TC-009: Should reject unsupported file format', () => {
//     // Try to upload unsupported format
//     cy.uploadDocument('document.docx');
    
//     // Verify error about unsupported format
//     cy.contains(/JPEG|PNG|PDF|format|supported/i, { timeout: 25000 })
//       .should('be.visible');
    
//     // Status should not change to validating
//     cy.get(SELECTORS.KYC.STATUS_DISPLAY)
//       .should('not.contain', 'validating')
//       .and('not.contain', 'valid');
//   });

//   // Empty files are not accepted using the current cypress setup
//   // TC-010: Invalid Document Rejection and Retry Flow (Mixed)
//   it('TC-010: Should handle document rejection and allow retry with valid document', () => {
//     // Upload invalid document (filename without "valid" will be rejected)
//     cy.uploadDocument('empty-file-pdf.pdf');

//     // Wait for validation to start
//     cy.waitForKYCStatus('validating', 25000);
    
//     // Wait for rejection (2-20 seconds)
//     cy.get('body', { timeout: 25000 })
//     cy.waitUntil(() => cy.contains(/Status: invalid/i, { timeout: 25000 }));

//     // Verify upload interface is still available for retry
//     cy.get(SELECTORS.KYC.UPLOAD_INPUT).should('exist');
    
//     // Retry with valid document
//     cy.uploadDocument('valid-passport-usa.jpeg');

//     // Wait for second verification
//     cy.waitForKYCStatus('validating', 25000);
    
//     // Verify second attempt succeeds
//     cy.waitForKYCStatus('valid', 25000);
    
//     // Verify final success state
//     cy.waitUntil(() => cy.contains(/Status: valid/i, { timeout: 25000 }).and('not.contain', 'Status: validating'));
//   });

  // Additional test: PNG format upload
  it('Should successfully upload and verify valid PNG document', () => {
    cy.uploadDocument('valid-id-africa.png');

    cy.waitForKYCStatus('validating', 25000);
    cy.waitForKYCStatus('valid', 25000);
    
    cy.waitUntil(() => cy.contains(/Status: valid/i, { timeout: 25000 }));
  });

  // Additional test: Status polling
  it('Should poll and update KYC status automatically', () => {
    cy.uploadDocument('valid-passport-usa.jpeg');

    // Initial status should be validating
    cy.waitForKYCStatus('validating', 25000);
    
    // Status should update to valid within timeout
    // This tests the polling mechanism (every 3 seconds according to README)
    cy.waitForKYCStatus('valid', 25000);
  });
});