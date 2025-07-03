import { Module, DynamicModule, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { 
  ConfigurableModuleClass, 
  MODULE_OPTIONS_TOKEN, 
  GamehubGrpcModuleOptions 
} from './gamehub-grpc.module-definition';
import { prepareSslCredentials } from './ssl.utils';
import { prepareAuthCredentials, combineCredentials } from './auth.utils';
import { GamehubGatewayClient } from './services/gamehub-gateway.client';

/**
 * GameHub gRPC Client Module
 * 
 * Provides a clean, Promise-based API for interacting with GameHub gRPC services.
 * Uses ConfigurableModuleBuilder for flexible configuration.
 * 
 * @example
 * ```typescript
 * // Simple usage
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
 *   return await this.client.listGamesAll({ providerId: 'evolution' });
 * }
 * ```
 */
@Global()
@Module({})
export class GamehubGrpcModule extends ConfigurableModuleClass {
  static forRoot(options: GamehubGrpcModuleOptions): DynamicModule {
    // Prepare credentials
    const sslCredentials = options.ssl ? prepareSslCredentials(options.ssl) : undefined;
    const authCredentials = options.auth ? prepareAuthCredentials(options.auth) : undefined;
    const credentials = combineCredentials(sslCredentials, authCredentials);

    return {
      module: GamehubGrpcModule,
      imports: [
        ClientsModule.register([
          {
            name: 'GAMEHUB_GRPC_CLIENT',
            transport: Transport.GRPC,
            options: {
              url: options.url,
              package: 'gateway',
              protoPath: join(__dirname, '../proto/gateway.service.proto'),
              credentials,
            },
          },
        ]),
      ],
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
        GamehubGatewayClient,
      ],
      exports: [GamehubGatewayClient],
    };
  }

  static forRootAsync(options: {
    useFactory?: (...args: any[]) => Promise<GamehubGrpcModuleOptions> | GamehubGrpcModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: GamehubGrpcModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'GAMEHUB_GRPC_CLIENT',
            useFactory: async (...args: any[]) => {
              const config = await options.useFactory?.(...args);
              if (!config) {
                throw new Error('GamehubGrpcModule configuration is required');
              }

              const sslCredentials = config.ssl ? prepareSslCredentials(config.ssl) : undefined;
              const authCredentials = config.auth ? prepareAuthCredentials(config.auth) : undefined;
              const credentials = combineCredentials(sslCredentials, authCredentials);

              return {
                transport: Transport.GRPC,
                options: {
                  url: config.url,
                  package: 'gateway',
                  protoPath: join(__dirname, '../proto/gateway.service.proto'),
                  credentials,
                },
              };
            },
            inject: options.inject || [],
          },
        ]),
      ],
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        GamehubGatewayClient,
      ],
      exports: [GamehubGatewayClient],
    };
  }
} 