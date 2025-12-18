# Test Cases - User Registration & KYC

## Test Case Summary
- **Total Test Cases:** 10
- **Positive Scenarios:** 5
- **Negative Scenarios:** 5

---

## User Registration Test Cases

### TC-001: Valid User Registration (Positive)

| Field | Details |
|-------|---------|
| **ID** | TC-001 |
| **Title** | Successful user registration with valid credentials |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | - User is not registered in the system<br>- Registration page is accessible |
| **Test Data** | - Email: test_user_001@example.com<br>- Password: SecurePass123!<br>- Phone: +1234567890 |

**Steps:**
1. Navigate to the registration page
2. Enter valid email address in the email field
3. Enter strong password in the password field
4. Enter valid phone number in the phone field
5. Click "Register" button

**Expected Result:**
- User account is created successfully
- User is redirected to KYC document upload page
- Success message is displayed
- User data is stored in the database
- Email/phone are marked as verified or pending verification

---

### TC-002: Registration with Missing Email (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-002 |
| **Title** | Registration attempt with missing email field |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | - Registration page is accessible |
| **Test Data** | - Email: (empty)<br>- Password: SecurePass123!<br>- Phone: +1234567890 |

**Steps:**
1. Navigate to the registration page
2. Leave email field empty
3. Enter valid password in the password field
4. Enter valid phone number in the phone field
5. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed: "Email is required" or similar
- Form is not submitted
- User remains on registration page
- No user account is created

---

### TC-003: Registration with Invalid Email Format (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-003 |
| **Title** | Registration attempt with malformed email |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | - Registration page is accessible |
| **Test Data** | - Email: invalid-email-format<br>- Password: SecurePass123!<br>- Phone: +1234567890 |

**Steps:**
1. Navigate to the registration page
2. Enter invalid email format (without @ or domain)
3. Enter valid password in the password field
4. Enter valid phone number in the phone field
5. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed: "Please enter a valid email address"
- Form validation prevents submission
- No user account is created

---

### TC-004: Registration with Invalid Phone Number Format (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-004 |
| **Title** | Registration with incorrect phone number format |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | - Registration page is accessible |
| **Test Data** | - Email: test_user_004@example.com<br>- Password: SecurePass123!<br>- Phone: 123 (too short) |

**Steps:**
1. Navigate to the registration page
2. Enter valid email address
3. Enter valid password
4. Enter invalid phone number (too short or wrong format)
5. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed: "Please enter a valid phone number"
- Form validation indicates the phone field error
- No user account is created

---

### TC-005: Registration with Duplicate Email (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-005 |
| **Title** | Attempt to register with already registered email |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | - User with email existing_user@example.com is already registered |
| **Test Data** | - Email: existing_user@example.com<br>- Password: NewPassword456!<br>- Phone: +9876543210 |

**Steps:**
1. Navigate to the registration page
2. Enter email that already exists in the system
3. Enter valid password
4. Enter valid (different) phone number
5. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed: "This email is already registered" or similar
- User is not created
- Optionally, system suggests login or password recovery

---

## KYC Document Upload Test Cases

### TC-006: Valid Document Upload - JPEG Format (Positive)

| Field | Details |
|-------|---------|
| **ID** | TC-006 |
| **Title** | Successful KYC document upload with valid JPEG file |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | - User is registered and logged in<br>- User has not completed KYC<br>- User is on document upload page |
| **Test Data** | - Document: valid_id.jpeg (3MB, valid ID document) |

**Steps:**
1. User navigates to KYC document upload page
2. Click "Upload Document" button
3. Select valid JPEG file (under 5MB)
4. Click "Submit" or "Upload"
5. Wait for verification process (2-20 seconds)

**Expected Result:**
- Document is uploaded successfully
- File is sent to external KYC vendor API
- User sees processing/loading indicator
- After verification, KYC status changes to "Verified"
- User gains access to all wallet functionality (send payments)
- Success message displayed: "Identity verified successfully"
- No further document uploads are accepted

---

### TC-007: Valid Document Upload - PDF Format (Positive)

| Field | Details |
|-------|---------|
| **ID** | TC-007 |
| **Title** | Successful KYC document upload with valid PDF file |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | - User is registered and logged in<br>- User has not completed KYC |
| **Test Data** | - Document: passport.pdf (4.5MB, valid passport scan) |

**Steps:**
1. User navigates to KYC document upload page
2. Click "Upload Document" button
3. Select valid PDF file (under 5MB)
4. Click "Submit"
5. Wait for verification process

**Expected Result:**
- Document is uploaded successfully
- Verification completes within 2-20 seconds
- KYC status changes to "Verified"
- User can access payment functionality
- Upload interface is disabled after successful verification

---

### TC-008: Document Upload Exceeding Size Limit (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-008 |
| **Title** | Attempt to upload document larger than 5MB |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | - User is registered and logged in<br>- User is on document upload page |
| **Test Data** | - Document: large_file.pdf (7MB) |

**Steps:**
1. User navigates to KYC document upload page
2. Click "Upload Document" button
3. Select file larger than 5MB
4. Attempt to upload

**Expected Result:**
- Upload is rejected
- Error message displayed: "File size exceeds 5MB limit"
- Document is not sent to external vendor
- User can attempt to upload a different file
- KYC status remains "Pending"

---

### TC-009: Document Upload with Unsupported Format (Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-009 |
| **Title** | Attempt to upload document in unsupported format |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | - User is registered and logged in<br>- User is on document upload page |
| **Test Data** | - Document: document.docx or image.gif (unsupported format) |

**Steps:**
1. User navigates to KYC document upload page
2. Click "Upload Document" button
3. Select file with unsupported format (.docx, .txt, .gif, etc.)
4. Attempt to upload

**Expected Result:**
- Upload is rejected
- Error message displayed: "Only JPEG, PNG, and PDF formats are supported"
- Document is not sent to external vendor
- User remains on upload page
- KYC status remains "Pending"

---

### TC-010: KYC Status - Invalid Document Rejection & Retry (Positive/Negative)

| Field | Details |
|-------|---------|
| **ID** | TC-010 |
| **Title** | Document rejected by KYC vendor and user retry with valid document |
| **Priority** | High |
| **Type** | Mixed (Negative → Positive) |
| **Preconditions** | - User is registered and logged in<br>- User has uploaded a document that will be rejected |
| **Test Data** | - First document: invalid_id.jpeg (document rejected by vendor)<br>- Second document: valid_passport.pdf (valid document) |

**Steps:**
1. User uploads first document (invalid/expired ID)
2. Wait for verification process (2-20 seconds)
3. System receives rejection from external vendor
4. User is notified of rejection
5. User uploads alternative valid document
6. Wait for second verification

**Expected Result:**
- First upload completes but verification fails
- Error message displayed: "Document verification failed. Please upload a valid ID document"
- KYC status changes to "Rejected" or remains "Pending"
- Upload interface remains available for retry
- User uploads second valid document
- Second verification succeeds
- KYC status changes to "Verified"
- User gains access to all functionality
- No further uploads accepted after successful verification

---

## Test Execution Notes

### Environment
- **Sandbox:** Use for limited critical path tests with real KYC vendor
- **Local/CI:** Use mock KYC service for majority of tests

### Test Data Management
- Generate unique emails and phones for each test run to avoid conflicts
- Clean up test users after execution in shared environments
- Use pre-validated test documents from mock service library

### Automation Priority
1. TC-001, TC-006, TC-007 (Critical happy paths)
2. TC-002, TC-003, TC-008, TC-009 (Input validation)
3. TC-004, TC-005, TC-010 (Edge cases and retries)
