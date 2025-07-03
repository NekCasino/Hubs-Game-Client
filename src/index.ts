// Main module with clean architecture 
export * from './gamehub-grpc.module';
export * from './gamehub-grpc.module-definition';

// New clean client service
export * from './services/gamehub-gateway.client';

// Legacy modules (deprecated - use GamehubGrpcModule instead)
export * from './gateway-client.module';

// Common types for SSL configuration
export * from './common.types';

// SSL utilities
export * from './ssl.utils';

// Authentication utilities
export * from './auth.utils';

// Service definitions from gateway.service.proto
export {
  GameServiceClient,
  GameServiceController,
  GAME_SERVICE_NAME,
  ListGamesRequest,
  ListGamesResult,
  FindPresetRequest,
  PresetResult,
  CreateSessionRequest,
  SessionResult,
  CreateFreeSpinRequest,
  CancelFreeSpinRequest,
  FreeSpinResult,
} from './types/gateway.service';

// Service definitions from session.service.proto
export {
  SessionServiceClient,
  SessionServiceController,
  SESSION_SERVICE_NAME,
  AuthenticateRequest,
  AuthenticateResult,
  BalanceRequest,
  BalanceResult,
} from './types/session.service';

// Service definitions from transaction.service.proto
export {
  TransactionServiceClient,
  TransactionServiceController,
  TRANSACTION_SERVICE_NAME,
  WithdrawRequest,
  WithdrawResult,
  DepositRequest,
  DepositResult,
  RollbackRequest,
  RollbackResult,
} from './types/transaction.service';

// Generated client services with Promise-based API
// These services can be used instead of direct gRPC clients for easier integration
export * from './services';

/**
 * GameHub gRPC Client Package
 * 
 * This package provides a clean, Promise-based API for communicating with GameHub gRPC services.
 * Built with modern NestJS patterns using ConfigurableModuleBuilder.
 * 
 * Features:
 * - Clean Promise-based API (no observables, no metadata)
 * - Type definitions for gRPC services 
 * - Configurable NestJS module using ConfigurableModuleBuilder
 * - SSL support with self-signed certificate handling
 * - Automatic authentication with identity/secret metadata
 * - No need to manually handle gRPC metadata or observables
 * 
 * Recommended Usage:
 * 
 * ```typescript
 * // Module registration 
 * GamehubGrpcModule.forRoot({
 *   url: 'gateway.gamehub.prematch.dev:443',
 *   ssl: { 
 *     enabled: true, 
 *     targetNameOverride: 'gateway.gamehub.prematch.dev' 
 *   },
 *   auth: { 
 *     identity: process.env.GAMEHUB_CUSTOMER_IDENTITY, 
 *     secret: process.env.GAMEHUB_GRPC_SECRET 
 *   }
 * })
 * 
 * // In your service
 * constructor(private client: GamehubGatewayClient) {}
 * 
 * async getGames() {
 *   // Clean Promise API - no metadata, no observables!
 *   const result = await this.client.listGamesAll({ 
 *     providerId: 'evolution' 
 *   });
 *   return result.games;
 * }
 * 
 * async createSession(playerId: string, gameId: string) {
 *   const session = await this.client.createSession({
 *     playerId,
 *     gameId,
 *     providerId: 'evolution',
 *     currency: 'USD'
 *   });
 *   return session.launchUrl;
 * }
 * ```
 * 
 * Async Configuration:
 * ```typescript
 * GamehubGrpcModule.forRootAsync({
 *   useFactory: (configService: ConfigService) => ({
 *     url: configService.get('GAMEHUB_GRPC_URL'),
 *     ssl: { enabled: true },
 *     auth: {
 *       identity: configService.get('GAMEHUB_CUSTOMER_IDENTITY'),
 *       secret: configService.get('GAMEHUB_GRPC_SECRET'),
 *     },
 *   }),
 *   inject: [ConfigService],
 * })
 * ```
 */ 