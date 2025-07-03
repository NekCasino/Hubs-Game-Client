/**
 * Jest setup file for gRPC client tests
 */

// Extend Jest timeout for gRPC operations
jest.setTimeout(30000);

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log in tests unless running in verbose mode
  log: process.env.NODE_ENV === 'test' && !process.env.VERBOSE 
    ? jest.fn() 
    : console.log,
};

// Mock for global process
if (!global.process) {
  global.process = process;
} 