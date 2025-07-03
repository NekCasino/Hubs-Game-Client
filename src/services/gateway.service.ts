import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { 
  GameServiceClient,
  GAME_SERVICE_NAME,
  ListGamesRequest,
  ListGamesResult,
  ListGamesResult_CategoryResult,
  ListGamesResult_CategoryResult_ImagesEntry,
  ListGamesResult_ProviderResult,
  ListGamesResult_ProviderResult_ImagesEntry,
  ListGamesResult_GameResult,
  ListGamesResult_GameResult_ImagesEntry,
  FindPresetRequest,
  PresetResult,
  PresetResult_Field,
  CreateFreeSpinRequest,
  CreateFreeSpinRequest_Field,
  CreateFreeSpinRequest_FieldsEntry,
  CancelFreeSpinRequest,
  FreeSpinResult,
  CreateSessionRequest,
  SessionResult,
  GameServiceController,
  GameServiceService,
  GameServiceServer,
  MessageFns
} from '../types/gateway.service';

/**
 * Сгенерированный сервис-клиент для GameService
 */
@Injectable()
export class GameServiceClientService implements OnModuleInit {
  private service!: GameServiceClient;

  constructor(
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }

  /**
   * listGamesAll - метод для вызова gRPC listGamesAll
   * @param request - параметры запроса типа ListGamesRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа ListGamesResult
   */
  async listGamesAll(request: ListGamesRequest, metadata?: Metadata): Promise<ListGamesResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.listGamesAll(request, grpcMetadata));
  }

  /**
   * findPreset - метод для вызова gRPC findPreset
   * @param request - параметры запроса типа FindPresetRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа PresetResult
   */
  async findPreset(request: FindPresetRequest, metadata?: Metadata): Promise<PresetResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.findPreset(request, grpcMetadata));
  }

  /**
   * createSession - метод для вызова gRPC createSession
   * @param request - параметры запроса типа CreateSessionRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа SessionResult
   */
  async createSession(request: CreateSessionRequest, metadata?: Metadata): Promise<SessionResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.createSession(request, grpcMetadata));
  }

  /**
   * createFreeSpin - метод для вызова gRPC createFreeSpin
   * @param request - параметры запроса типа CreateFreeSpinRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа FreeSpinResult
   */
  async createFreeSpin(request: CreateFreeSpinRequest, metadata?: Metadata): Promise<FreeSpinResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.createFreeSpin(request, grpcMetadata));
  }

  /**
   * cancelFreeSpin - метод для вызова gRPC cancelFreeSpin
   * @param request - параметры запроса типа CancelFreeSpinRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа FreeSpinResult
   */
  async cancelFreeSpin(request: CancelFreeSpinRequest, metadata?: Metadata): Promise<FreeSpinResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.cancelFreeSpin(request, grpcMetadata));
  }
}
