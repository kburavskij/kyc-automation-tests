# Digital Wallet - Cypress Test Automation Suite

## 📋 Overview

This repository contains a complete E2E and API test automation suite for the Digital Wallet application's User Registration and KYC (Know Your Customer) features, built with Cypress and following modern testing best practices.

## 🎯 Key Features

- **Const-based Selectors**: Centralized selector management in `cypress/support/selectors.js`
- **Dynamic Environment Selection**: Tests adapt to local/sandbox/production environments
- **Custom cy.register()**: Complete registration flow with email, password, and phone
- **Real CI/CD Pipeline**: GitHub Actions workflow that clones and runs the actual KYC mock app
- **10 Test Cases Automated**: All manual test cases from TestCases.md fully automated
- **API & E2E Coverage**: Both UI and API-level testing

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── cypress-tests.yml        # Real CI/CD pipeline
├── cypress/
│   ├── e2e/
│   │   ├── registration.cy.js       # TC-001 to TC-005
│   │   ├── kyc.cy.js                # TC-006 to TC-010
│   │   └── api.cy.js                # API-level tests
│   ├── fixtures/
│   │   └── test-documents/          # Test files (see below)
│   ├── support/
│   │   ├── commands.js              # Custom commands with cy.register()
│   │   ├── selectors.js             # Const-based selector definitions
│   │   └── e2e.js                   # Global configuration
│   ├── screenshots/                 # Auto-captured on failures
│   └── videos/                      # Test execution recordings
├── cypress.config.js                # Cypress configuration
├── package.json                     # Dependencies and scripts
├── TestStrategy.md                  # Part 1: Test strategy
├── TestCases.md                     # Part 2: Manual test cases
├── TestCases.csv                    # Excel-ready format
├── .env.example                     # Environment configuration template
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v20+ and npm v8+
- Git

### Installation

```bash
# 1. Clone this repository
git clone https://github.com/kburavskij/kyc-automation-tests.git
cd kyc-automation-tests

# 2. Install dependencies
npm install

### Running Tests Locally

#### Option 1: With Manual Application Setup

```bash
# Terminal 1: Clone and start KYC mock app
git clone https://github.com/vialeteu/kyc-mock-app.git
cd kyc-mock-app/server
npm install && npm start

# Terminal 2: Start client
cd kyc-mock-app/client
npm install && npm start

# Terminal 3: Run tests
cd kyc-automation-tests
npm test
```

#### Option 2: Using Cypress Interactive Mode

```bash
# Start the KYC mock app first (see Option 1)
# Then open Cypress Test Runner
npm run cy:open
```

## 🎬 Usage

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:registration    # TC-001 to TC-005
npm run test:kyc             # TC-006 to TC-010
npm run test:api             # API tests
```

### Run by Browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Interactive Mode
```bash
npm run cy:open
```

## 🏗️ Architecture

### Const-Based Selectors

All selectors are centralized in `cypress/support/selectors.js`:

```javascript
import { SELECTORS } from '../support/selectors';

// Usage in tests:
cy.get(SELECTORS.REGISTRATION.EMAIL_INPUT).type('email@test.com');
cy.get(SELECTORS.KYC.UPLOAD_BUTTON).click();
```

### Dynamic Environment Configuration

Tests automatically adapt to the configured environment:

```javascript
// In cypress.config.js or via environment variable:
env: {
  TEST_ENV: 'local' // or 'sandbox', 'production'
}

// Commands automatically use correct URLs:
cy.visitApp('/');  // Uses http://localhost:3001 in local
                   // Uses https://sandbox.vialet.io in sandbox
```

## 🤖 CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/cypress-tests.yml` file provides:

1. **Automatic Application Setup**: Clones and starts the KYC mock app
2. **Matrix Testing**: Runs tests across Chrome, Firefox, and Edge
3. **Artifact Collection**: Captures screenshots, videos, and reports
4. **Scheduled Runs**: Daily execution at 2 AM UTC
5. **Manual Triggers**: Run via workflow_dispatch

### How CI Works

```yaml
# The workflow automatically:
1. Checks out your test repository
2. Clones vialeteu/kyc-mock-app
3. Installs all dependencies
4. Starts server on port 3000
5. Starts client on port 3001
6. Waits for services to be ready
7. Runs all Cypress tests
8. Uploads results and artifacts
9. Cleans up processes
```

### Viewing Results

After CI runs:
1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. View test results in the summary
4. Download artifacts (screenshots, videos) if tests failed

## 📊 Test Coverage

### Registration Tests (registration.cy.js)
- ✅ TC-001: Valid user registration
- ✅ TC-002: Missing email validation
- ✅ TC-003: Invalid email format
- ✅ TC-004: Invalid phone number
- ✅ TC-005: Duplicate email handling

### KYC Tests (kyc.cy.js)
- ✅ TC-006: Valid JPEG upload and verification
- ✅ TC-007: Valid PDF upload and verification
- ✅ TC-008: File size limit (>5MB rejection)
- ✅ TC-009: Unsupported format rejection
- ✅ TC-010: Document rejection and retry flow

### API Tests (api.cy.js)
- ✅ API versions of all above test cases
- ✅ Direct backend validation

## 🌍 Environment Configuration

### Local Development
```bash
# Default settings
BASE_URL: http://localhost:3001
API_URL: http://localhost:3000/api
TEST_ENV: local
```

### Sandbox Testing
```bash
# Set environment
CYPRESS_TEST_ENV=sandbox npm test

# Or update cypress.config.js:
env: {
  TEST_ENV: 'sandbox'
}
```

### Production (Read-only smoke tests)
```bash
CYPRESS_TEST_ENV=production npm test
```

## 🧪 Test Strategy Highlights

From `TestStrategy.md`:

- **Microservices Approach**: Contract testing, service isolation
- **External Vendor Management**: Mock services, quota scheduling
- **Test Data Strategy**: Dynamic generation, unique identifiers
- **Quality Metrics**: Coverage targets, pass rates, performance KPIs
- **Risk Mitigation**: Sandbox capacity management, fallback strategies