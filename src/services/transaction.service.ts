import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { 
  TransactionServiceClient,
  TRANSACTION_SERVICE_NAME,
  WithdrawRequest,
  WithdrawResult,
  DepositRequest,
  DepositResult,
  RollbackRequest,
  RollbackResult,
  TransactionServiceController,
  TransactionServiceService,
  TransactionServiceServer,
  MessageFns
} from '../types/transaction.service';

/**
 * Сгенерированный сервис-клиент для TransactionService
 */
@Injectable()
export class TransactionServiceClientService implements OnModuleInit {
  private service!: TransactionServiceClient;

  constructor(
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<TransactionServiceClient>(TRANSACTION_SERVICE_NAME);
  }

  /**
   * withdraw - метод для вызова gRPC withdraw
   * @param request - параметры запроса типа WithdrawRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа WithdrawResult
   */
  async withdraw(request: WithdrawRequest, metadata?: Metadata): Promise<WithdrawResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.withdraw(request, grpcMetadata));
  }

  /**
   * deposit - метод для вызова gRPC deposit
   * @param request - параметры запроса типа DepositRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа DepositResult
   */
  async deposit(request: DepositRequest, metadata?: Metadata): Promise<DepositResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.deposit(request, grpcMetadata));
  }

  /**
   * rollback - метод для вызова gRPC rollback
   * @param request - параметры запроса типа RollbackRequest
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа RollbackResult
   */
  async rollback(request: RollbackRequest, metadata?: Metadata): Promise<RollbackResult> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.rollback(request, grpcMetadata));
  }
}
