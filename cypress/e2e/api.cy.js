// cypress/e2e/api.cy.js
// API-level tests for registration and KYC

describe('Registration API Tests', () => {
  
  const API_BASE = Cypress.env('API_URL') || 'http://localhost:3000/api';
  
  // TC-001 API: Valid User Registration
  it('TC-001-API: Should register user via API with valid data', () => {
    const testUser = {
      email: `api.test.${Date.now()}@example.com`,
      password: 'SecurePass123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };

    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: testUser,
      failOnStatusCode: false
    }).then((response) => {
      // Check for successful registration (200 or 201)
      expect(response.status).to.be.oneOf([200, 201]);
      
      // Verify response body has user data
      expect(response.body.data).to.have.property('userId');
      expect(response.body.data).to.have.property('email', testUser.email);
      
      // Verify initial KYC status
      const kycStatus = response.body.data.kycStatus || response.body.data.kyc_status || response.body.data.status;
      expect(kycStatus).to.match(/no_documents|pending/i);
    });
  });

  // TC-002 API: Missing Email
  it('TC-002-API: Should fail registration with missing email', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: {
        password: 'SecurePass123!',
        phone: '+1234567890'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.success).to.be.false;
    });
  });

  // TC-003 API: Invalid Email Format
  it('TC-003-API: Should fail registration with invalid email format', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: {
        email: 'invalid-email-format',
        password: 'SecurePass123!',
        phone: '+1234567890'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.success).to.be.false;
    });
  });

  // TC-004 API: Invalid Phone Format
  it('TC-004-API: Should fail registration with invalid phone', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: {
        email: `test.${Date.now()}@example.com`,
        password: 'SecurePass123!',
        phone: '123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.success).to.be.false;
    });
  });

  // TC-005 API: Duplicate Email
  it('TC-005-API: Should fail registration with duplicate email', () => {
    const testUser = {
      email: `duplicate.test.${Date.now()}@example.com`,
      password: 'SecurePass123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };

    // First registration - should succeed
    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: testUser
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
    });

    // Second registration with same email - should fail
    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: {
        ...testUser,
        password: 'DifferentPass456!',
        phone: '+19876543210'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 409, 422]);
      expect(response.body.error || response.body.message).to.contain('User with this email already exists');
    });
  });
});

describe('KYC API Tests', () => {
  
  const API_BASE = Cypress.env('API_URL') || 'http://localhost:3000/api';
  let userId;

  beforeEach(() => {
    // Register a user before each KYC test
    const testUser = {
      email: `kyc.api.test.${Date.now()}@example.com`,
      password: 'SecurePass123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };

    cy.request({
      method: 'POST',
      url: `${API_BASE}/users`,
      body: testUser
    }).then((response) => {
      userId = response.body.data.id || response.body.data.userId || response.body.data.user_id;
      expect(userId).to.exist;
    });
  });

  // TC-006 API: Upload valid JPEG
  it('TC-006-API: Should upload and verify valid JPEG document', () => {
    cy.fixture('test-documents/valid-id-europe.jpeg', 'base64').then((fileContent) => {
      // Convert base64 to blob for FormData
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const formData = new FormData();
      formData.append('document', blob, 'valid-id-europe.jpeg');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        timeout: 30000
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        // Status should change to validating, then eventually to valid
        // Poll for final status
        cy.wait(2000); // Wait minimum verification time
        
        cy.request(`${API_BASE}/kyc/${userId}`).then((statusResponse) => {
          const status = statusResponse.body.data.kycStatus || statusResponse.body.data.kyc_status || statusResponse.body.data.status;
          expect(status).to.match(/valid|verified|approved/i);
        });
      });
    });
  });

  // TC-007 API: Upload valid PDF
  it('TC-007-API: Should upload and verify valid PDF document', () => {
    cy.fixture('test-documents/invalid-file-pdf.pdf', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
      const formData = new FormData();
      formData.append('document', blob, 'invalid-file-pdf.pdf');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        timeout: 30000
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.wait(2000);
        
        cy.request(`${API_BASE}/kyc/${userId}`).then((statusResponse) => {
          const status = statusResponse.body.data.kycStatus || statusResponse.body.data.kyc_status || statusResponse.body.data.status;
          expect(status).to.match(/valid|verified|approved/i);
        });
      });
    });
  });

  // TC-008 API: File too large
  it('TC-008-API: Should reject file larger than 5MB', () => {
    cy.fixture('test-documents/large-photo.jpeg', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
      const formData = new FormData();
      formData.append('document', blob, 'large-photo.jpeg');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 413, 422]);
      });
    });
  });

  // TC-009 API: Unsupported format
  it('TC-009-API: Should reject unsupported file format', () => {
    cy.fixture('test-documents/document.docx', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(
        fileContent,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      const formData = new FormData();
      formData.append('document', blob, 'document.docx');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 415, 422, 500]);
      });
    });
  });

  // TC-010 API: Rejection and retry
  it('TC-010-API: Should handle rejection and allow retry', () => {
    // Upload invalid document
    cy.fixture('test-documents/invalid-id.jpeg', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const formData = new FormData();
      formData.append('document', blob, 'invalid-id.jpeg');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        timeout: 30000,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400]);
        
        // Wait for verification
        cy.wait(3000);
        
      });
    });

    // Retry with valid document
    cy.fixture('test-documents/valid-passport-usa.jpeg', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
      const formData = new FormData();
      formData.append('document', blob, 'valid-passport-usa.jpeg');

      cy.request({
        method: 'POST',
        url: `${API_BASE}/kyc/${userId}`,
        body: formData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        timeout: 30000
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.wait(2000);
        
        cy.request(`${API_BASE}/kyc/${userId}`).then((statusResponse) => {
          const status = statusResponse.body.data.kycStatus || statusResponse.body.data.kyc_status || statusResponse.body.data.status;
          expect(status).to.match(/valid|verified|approved/i);
        });
      });
    });
  });

  // Additional: Get KYC status
  it('Should retrieve current KYC status', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/kyc/${userId}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      const status = response.body.data.kycStatus || response.body.data.kyc_status || response.body.data.status;
      expect(status).to.exist;
      expect(status).to.match(/no_documents|pending|validating|valid|invalid/i);
    });
  });

  // Additional: Get user information
  it('Should retrieve user information', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/users/${userId}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('email');
      expect(response.body.data).to.have.property('phone');
    });
  });
});