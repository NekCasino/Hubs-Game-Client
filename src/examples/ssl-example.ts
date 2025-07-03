import { Module } from '@nestjs/common';
import { GatewayClientModule } from '../gateway-client.module';

/**
 * Example module with SSL configuration for GameHub production
 */
@Module({
  imports: [
    GatewayClientModule.register({
      url: 'gateway.gamehub.prematch.dev:443',
      ssl: {
        enabled: true,
        targetNameOverride: 'gateway.gamehub.prematch.dev',
        defaultAuthority: 'gateway.gamehub.prematch.dev',
      }
    }),
  ],
})
export class GameHubSSLExampleModule {}

/**
 * Example usage in your application
 * 
 * ```typescript
 * import { Module } from '@nestjs/common';
 * import { GatewayClientModule } from '@platform/gamehub-grpc-client';
 * 
 * @Module({
 *   imports: [
 *     GatewayClientModule.register({
 *       url: 'gateway.gamehub.prematch.dev:443',
 *       ssl: {
 *         enabled: true,
 *         targetNameOverride: 'gateway.gamehub.prematch.dev',
 *         defaultAuthority: 'gateway.gamehub.prematch.dev',
 *       }
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 * 
 * Then in your service:
 * 
 * ```typescript
 * import { Injectable, OnModuleInit } from '@nestjs/common';
 * import { ClientGrpc } from '@nestjs/microservices';
 * import { GameServiceClient, GAME_SERVICE_NAME } from '@platform/gamehub-grpc-client';
 * import { Metadata } from '@grpc/grpc-js';
 * 
 * @Injectable()
 * export class GameService implements OnModuleInit {
 *   private gameService: GameServiceClient;
 * 
 *   constructor(
 *     @Inject('GATEWAY_CLIENT') private readonly client: ClientGrpc,
 *   ) {}
 * 
 *   onModuleInit() {
 *     this.gameService = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
 *   }
 * 
 *   async listGames() {
 *     const metadata = new Metadata();
 *     metadata.add('identity', 'test');
 *     metadata.add('secret', 'secret');
 *     
 *     const request = { $type: 'gamehub.proto.client.service.ListGamesRequest' };
 *     return firstValueFrom(this.gameService.listGamesAll(request, metadata));
 *   }
 * }
 * ```
 */ 