import { Module } from '@nestjs/common';
import { GatewayClientModule } from '../gateway-client.module';

@Module({
  imports: [
    // Базовая конфигурация с аутентификацией
    GatewayClientModule.register({
      url: 'gateway.gamehub.prematch.dev:443',
      ssl: {
        enabled: true,
        targetNameOverride: 'gateway.gamehub.prematch.dev',
        defaultAuthority: 'gateway.gamehub.prematch.dev',
      },
      auth: {
        identity: 'your-customer-identity',
        secret: 'your-secret-key',
      },
    }),
  ],
})
export class AppModule {}

/**
 * Альтернативный вариант с переменными окружения:
 * 
 * GatewayClientModule.register({
 *   url: process.env.GAMEHUB_GRPC_URL || 'gateway.gamehub.prematch.dev:443',
 *   ssl: {
 *     enabled: true,
 *     targetNameOverride: 'gateway.gamehub.prematch.dev',
 *     defaultAuthority: 'gateway.gamehub.prematch.dev',
 *   },
 *   auth: {
 *     identity: process.env.GAMEHUB_CUSTOMER_IDENTITY || 'test',
 *     secret: process.env.GAMEHUB_GRPC_SECRET || 'secret',
 *   },
 * })
 * 
 * После такой настройки все gRPC запросы автоматически будут содержать
 * метаданные аутентификации (identity и secret в заголовках).
 * 
 * Больше не нужно:
 * - Создавать createMetadata() методы в каждом сервисе
 * - Передавать metadata параметр в каждый gRPC вызов
 * - Дублировать код создания метаданных
 * 
 * Достаточно один раз настроить модуль с auth параметрами!
 */ 