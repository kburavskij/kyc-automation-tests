const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      
      return config;
    },
    
    // Base URL for the application
    baseUrl: 'http://localhost:3001',
    
    // Spec pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    // Environment-specific configuration
    env: {
      TEST_ENV: 'local', // Options: 'local', 'sandbox', 'production'
      MOCK_KYC: true, // Use mock KYC service
      API_URL: 'http://localhost:3000/api'
    },
    
    // Timeouts
    defaultCommandTimeout: 30000,
    requestTimeout: 15000,
    responseTimeout: 30000, // KYC can take up to 20s + buffer
    pageLoadTimeout: 60000,
    
    // Retry configuration
    retries: {
      runMode: 2, // Retry failed tests twice in CI
      openMode: 0  // No retry in interactive mode
    },
    
    // Video and screenshots
    video: true,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Test isolation
    testIsolation: true,
    
    // Slow down tests for debugging (set to 0 in CI)
    slowTestThreshold: 10000,
    
    // File upload
    fileServerFolder: 'cypress',
    fixturesFolder: 'cypress/fixtures',
    
    // Experimental features
    experimentalStudio: false,
    experimentalWebKitSupport: false,
    
    // Exclude patterns
    excludeSpecPattern: [
      '**/__snapshots__/*',
      '**/__image_snapshots__/*'
    ]
  },
  
  // Component testing (if needed in future)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
  },
  
  // Project settings
  projectId: 'kyc-automation-tests',
  
  // CI specific settings (can be overridden via environment variables)
  watchForFileChanges: true,
  
  // Reporter options
  reporter: 'spec',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true
  }
});