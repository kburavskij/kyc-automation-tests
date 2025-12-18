import './commands.js'
import './selectors.js'
import 'cypress-file-upload'
import 'cypress-wait-until';

// ignore all console errors in app
// eslint-disable-next-line no-unused-vars
Cypress.on('uncaught:exception', (err, runnable) => false)