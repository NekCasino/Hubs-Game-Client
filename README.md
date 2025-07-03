# GameHub gRPC Client

gRPC клиент для GameHub платформы с поддержкой NestJS.

## Установка

```bash
npm install @platform/gamehub-grpc-client
```

dkvdmk

## Использование

### Подключение модулей

```typescript
import { Module } from '@nestjs/common';
import { GatewayClientModule, SessionClientModule, TransactionClientModule } from '@platform/gamehub-grpc-client';

@Module({
  imports: [
    GatewayClientModule.register({
      url: 'localhost:50051',
    }),
    SessionClientModule.register({
      url: 'localhost:50051', 
    }),
    TransactionClientModule.register({
      url: 'localhost:50051',
    }),
  ],
})
export class AppModule {}
```

### SSL конфигурация (v1.3.0+)

Все клиентские модули поддерживают SSL подключения с настройкой self-signed сертификатов:

```typescript
import { Module } from '@nestjs/common';
import { GatewayClientModule } from '@platform/gamehub-grpc-client';

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
export class AppModule {}
```

#### SSL опции

- `enabled: boolean` - включает/отключает SSL
- `targetNameOverride?: string` - переопределение имени цели для SSL
- `defaultAuthority?: string` - авторитет по умолчанию для SSL

Для production окружения с self-signed сертификатами используйте:

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

### Использование стандартных gRPC клиентов

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { 
  GameServiceClient, 
  ListGamesRequest,
  ListGamesResult,
  GAME_SERVICE_NAME
} from '@platform/gamehub-grpc-client';
import { Observable } from 'rxjs';

@Injectable()
export class GamesService implements OnModuleInit {
  private gameService: GameServiceClient;
  
  @Client({ name: 'GATEWAY_CLIENT' })
  private readonly client: ClientGrpc;
  
  onModuleInit() {
    this.gameService = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }
  
  listGames(): Observable<ListGamesResult> {
    return this.gameService.listGamesAll({});
  }
}
```

### Использование сгенерированных сервисов с Promise API (рекомендуемый способ)

```typescript
import { Injectable } from '@nestjs/common';
import { GameServiceClientService } from '@platform/gamehub-grpc-client';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GamesService {
  constructor(private readonly gameClient: GameServiceClientService) {}
  
  async listGames() {
    // Вместо Observable<> возвращается Promise<>
    return this.gameClient.listGamesAll({});
  }
  
  async listGamesWithAuth(identity: string, secret: string) {
    // Создание metadata для аутентификации
    const metadata = new Metadata();
    metadata.add('identity', identity);
    metadata.add('secret', secret);
    
    return this.gameClient.listGamesAll({}, metadata);
  }
  
  async createSession(gameId: string, token: string, currency: string) {
    return this.gameClient.createSession({
      gameIdentity: gameId,
      token,
      currency,
      lobbyUrl: 'https://example.com',
      platform: 'desktop',
      locale: 'en',
      demo: '0'
    });
  }
}
```

### Регистрация модулей с провайдерами сервисов

Для использования сгенерированных сервисов, необходимо зарегистрировать их как провайдеры в модуле:

```typescript
import { Module } from '@nestjs/common';
import { 
  GatewayClientModule, 
  SessionClientModule, 
  TransactionClientModule,
  GameServiceClientService,
  SessionServiceClientService,
  TransactionServiceClientService
} from '@platform/gamehub-grpc-client';

@Module({
  imports: [
    GatewayClientModule.register({
      url: 'localhost:50051',
    }),
    SessionClientModule.register({
      url: 'localhost:50051', 
    }),
    TransactionClientModule.register({
      url: 'localhost:50051',
    }),
  ],
  providers: [
    GameServiceClientService,
    SessionServiceClientService,
    TransactionServiceClientService
  ],
  exports: [
    GameServiceClientService,
    SessionServiceClientService,
    TransactionServiceClientService
  ]
})
export class GameHubModule {}
```

## API

Пакет предоставляет следующие компоненты:

### gRPC сервисы
- **GameService** - управление играми, сессиями и фриспинами
- **SessionService** - аутентификация и баланс
- **TransactionService** - снятие, пополнение и отмена транзакций

### NestJS модули
- `GatewayClientModule` - модуль для подключения к Game API
- `SessionClientModule` - модуль для подключения к Session API 
- `TransactionClientModule` - модуль для подключения к Transaction API

### Сгенерированные сервисы (с v1.1.0)
- `GameClientService` - типизированный Promise-based клиент для Game API 
- `SessionClientService` - типизированный Promise-based клиент для Session API
- `TransactionClientService` - типизированный Promise-based клиент для Transaction API

## Требования для локальной сборки

Для локальной сборки библиотеки требуется:

1. Установленный Protocol Buffers компилятор (protoc) через системный менеджер пакетов:

```bash
# Ubuntu/Debian
sudo apt install -y protobuf-compiler

# macOS (через Homebrew)
brew install protobuf

# Проверка установки
protoc --version
```

## Генерация кода

Для регенерации кода из .proto файлов используйте:

```bash
# Генерация TypeScript типов и интерфейсов
npm run generate:proto

# Генерация Promise-based сервисов
npm run generate:services
```

### Структура сгенерированных файлов

После генерации кода в проекте создаются следующие файлы:

1. `src/types/`:
   - `*.types.ts` - определения типов и интерфейсов из .proto файлов, используйте их для типизации в своем коде

2. `src/services/`:
   - `*.service.ts` - типизированные Promise-based клиентские сервисы, готовые для использования в NestJS проектах
   - `index.ts` - все экспорты сервисов

При импорте файлов в своем коде, рекомендуется использовать файлы с расширением `.types.ts` для типов и интерфейсов. 