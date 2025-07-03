/**
 * SSL configuration interface for gRPC clients
 */
export interface SslConfig {
  enabled: boolean;
  targetNameOverride?: string;
  defaultAuthority?: string;
}

/**
 * Authentication configuration interface for gRPC clients
 * Automatically adds identity and secret metadata to all requests
 */
export interface AuthConfig {
  identity: string;
  secret: string;
}

/**
 * Base client module options
 */
export interface BaseClientOptions {
  url: string;
  ssl?: SslConfig;
  auth?: AuthConfig;
}

/**
 * Gateway client module options
 */
export interface GatewayClientOptions extends BaseClientOptions {}

/**
 * Session client module options
 */
export interface SessionClientOptions extends BaseClientOptions {}

/**
 * Transaction client module options
 */
export interface TransactionClientOptions extends BaseClientOptions {} 