# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-01-06

### Added
- **SSL Support**: All client modules now support SSL connections with self-signed certificate handling
- **SSL Configuration Interface**: Added `SslConfig` interface for configuring SSL options
- **SSL Utilities**: Added `prepareSslCredentials` utility function for SSL credential preparation
- **Common Types**: Added shared types for client module options
- **SSL Examples**: Added comprehensive examples for SSL usage in README and example files

### Changed
- **Module Options**: Extended all client module options to support SSL configuration
- **Package Description**: Updated to include SSL support
- **README**: Enhanced with SSL configuration examples and metadata usage

### Technical Details
- Added `ssl` option to `GatewayClientModule.register()`, `SessionClientModule.register()`, and `TransactionClientModule.register()`
- SSL options include:
  - `enabled: boolean` - Enable/disable SSL
  - `targetNameOverride?: string` - Override SSL target name for self-signed certificates
  - `defaultAuthority?: string` - Set default authority for SSL connections
- Supports production environments with self-signed certificates like `gateway.gamehub.prematch.dev:443`

### Example Usage
```typescript
GatewayClientModule.register({
  url: 'gateway.gamehub.prematch.dev:443',
  ssl: {
    enabled: true,
    targetNameOverride: 'gateway.gamehub.prematch.dev',
    defaultAuthority: 'gateway.gamehub.prematch.dev',
  }
})
```

## [1.2.3] - Previous Version
- Base functionality with gRPC client modules
- Code generation from proto files
- Promise-based service wrappers 