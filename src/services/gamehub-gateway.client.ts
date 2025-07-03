import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { 
  GameServiceClient,
  GAME_SERVICE_NAME,
  ListGamesRequest,
  ListGamesResult,
  FindPresetRequest,
  PresetResult,
  CreateSessionRequest,
  SessionResult,
  CreateFreeSpinRequest,
  FreeSpinResult,
  CancelFreeSpinRequest,
} from '../types/gateway.service';

/**
 * GameHub Gateway Client
 * 
 * Provides a clean, Promise-based API for interacting with GameHub Gateway service.
 * Automatically handles authentication and metadata - no need to pass auth manually.
 * 
 * @example
 * ```typescript
 * constructor(private client: GamehubGatewayClient) {}
 * 
 * async getGames() {
 *   const games = await this.client.listGamesAll({ 
 *     providerId: 'evolution' 
 *   });
 *   return games;
 * }
 * ```
 */
@Injectable()
export class GamehubGatewayClient implements OnModuleInit {
  private gameService!: GameServiceClient;

  constructor(
    @Inject('GAMEHUB_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gameService = this.grpcClient.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }

  /**
   * List all games with optional filtering
   * 
   * @param request - Request parameters for listing games
   * @returns Promise containing the list of games, categories, and providers
   */
  async listGamesAll(request: ListGamesRequest): Promise<ListGamesResult> {
    return firstValueFrom(this.gameService.listGamesAll(request, new Metadata()));
  }

  /**
   * Find a preset configuration for a game
   * 
   * @param request - Request parameters for finding preset
   * @returns Promise containing the preset configuration
   */
  async findPreset(request: FindPresetRequest): Promise<PresetResult> {
    return firstValueFrom(this.gameService.findPreset(request, new Metadata()));
  }

  /**
   * Create a new game session
   * 
   * @param request - Request parameters for creating session
   * @returns Promise containing the session details
   */
  async createSession(request: CreateSessionRequest): Promise<SessionResult> {
    return firstValueFrom(this.gameService.createSession(request, new Metadata()));
  }

  /**
   * Create a free spin for a player
   * 
   * @param request - Request parameters for creating free spin
   * @returns Promise containing the free spin result
   */
  async createFreeSpin(request: CreateFreeSpinRequest): Promise<FreeSpinResult> {
    return firstValueFrom(this.gameService.createFreeSpin(request, new Metadata()));
  }

  /**
   * Cancel an existing free spin
   * 
   * @param request - Request parameters for canceling free spin
   * @returns Promise containing the cancellation result
   */
  async cancelFreeSpin(request: CancelFreeSpinRequest): Promise<FreeSpinResult> {
    return firstValueFrom(this.gameService.cancelFreeSpin(request, new Metadata()));
  }
} 