import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { 
  SessionServiceClient,
  SESSION_SERVICE_NAME,
  AuthenticateRequest,
  AuthenticateResult,
  BalanceRequest,
  BalanceResult,
  ActiveBalanceRequest,
  ActiveBalanceResult,
  SessionServiceController,
  SessionServiceService,
  SessionServiceServer,
  MessageFns
} from '../types/session.service';

/**
 * Сгенерированный сервис-клиент для SessionService
 */
@Injectable()
export class SessionServiceClientService implements OnModuleInit {
  private service!: SessionServiceClient;

  constructor(
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<SessionServiceClient>(SESSION_SERVICE_NAME);
  }

  /**
   * authenticate - метод для вызова gRPC authenticate
   * @param request - параметры запроса типа AuthenticateRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа AuthenticateResult
   */
  async authenticate(request: AuthenticateRequest, metadata?: Metadata): Promise<AuthenticateResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.authenticate(request, grpcMetadata));
  }

  /**
   * balance - метод для вызова gRPC balance
   * @param request - параметры запроса типа BalanceRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа BalanceResult
   */
  async balance(request: BalanceRequest, metadata?: Metadata): Promise<BalanceResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.balance(request, grpcMetadata));
  }

  /**
   * activeBalance - метод для вызова gRPC activeBalance
   * @param request - параметры запроса типа ActiveBalanceRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа ActiveBalanceResult
   */
  async activeBalance(request: ActiveBalanceRequest, metadata?: Metadata): Promise<ActiveBalanceResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.activeBalance(request, grpcMetadata));
  }
}
