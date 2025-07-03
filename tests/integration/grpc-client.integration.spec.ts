import { Test, TestingModule } from '@nestjs/testing';
import { Metadata } from '@grpc/grpc-js';
import { GatewayClientModule } from '../../src/gateway-client.module';
import { GameServiceClientService } from '../../src/services/gateway.service';
import { TestMockGrpcServer } from '../helpers/mock-grpc-server';
import { MOCK_AUTH_METADATA } from '../fixtures/mock-responses';
import { 
  ListGamesRequest,
  FindPresetRequest,
  CreateSessionRequest
} from '../../src/types/gateway.types';

describe('gRPC Client Integration Tests', () => {
  let app: TestingModule;
  let gameService: GameServiceClientService;
  let mockServer: TestMockGrpcServer;
  let serverPort: number;

  beforeAll(async () => {
    // Start mock gRPC server
    console.log('Starting mock gRPC server...');
    mockServer = new TestMockGrpcServer();
    serverPort = await mockServer.start();
    console.log(`Mock server started on port: ${serverPort}`);
  });

  afterAll(async () => {
    // Stop mock server
    if (mockServer) {
      mockServer.stop();
    }
    
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // Create test module with real gRPC client pointing to mock server
    console.log(`Creating test module with server URL: localhost:${serverPort}`);
    app = await Test.createTestingModule({
      imports: [
        GatewayClientModule.register({
          url: `localhost:${serverPort}`,
        }),
      ],
      providers: [GameServiceClientService],
    }).compile();

    gameService = app.get<GameServiceClientService>(GameServiceClientService);
    
    // Initialize the gRPC service
    console.log('Initializing gRPC service...');
    gameService.onModuleInit();
    console.log('gRPC service initialized');
  });

  describe('listGamesAll with authentication', () => {
    it('should successfully call listGamesAll with valid credentials', async () => {
      // Arrange
      const request: ListGamesRequest = {
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      
      const metadata = new Metadata();
      metadata.set('identity', MOCK_AUTH_METADATA.identity);
      metadata.set('secret', MOCK_AUTH_METADATA.secret);

      // Act
      console.log('Calling listGamesAll...');
      const result = await gameService.listGamesAll(request, metadata);
      console.log('Result received:', result);

      // Assert
      expect(result).toBeDefined();
      expect(result.$type).toBe('gamehub.proto.client.service.ListGamesResult');
      expect(result.games).toHaveLength(1);
      expect(result.games![0].identity).toBe('pragmaticplay-sugar-rush-1000');
      expect(result.games![0].name).toBe('Sugar Rush 1000');
      expect(result.games![0].provider).toBe('pragmaticplay');
      expect(result.games![0].supportedLang).toContain('en');
      expect(result.games![0].supportedLang).toContain('ru');
      expect(result.games![0].platforms).toContain('mobile');
      expect(result.games![0].platforms).toContain('web');
      expect(result.games![0].bonusBet).toBe(true);
      expect(result.games![0].freespinEnable).toBe(true);
      
      expect(result.providers).toHaveLength(1);
      expect(result.providers![0].identity).toBe('pragmaticplay');
      expect(result.providers![0].name).toBe('Pragmatic Play');
      
      expect(result.categories).toEqual([]);
    });

    it('should fail with invalid credentials', async () => {
      // Arrange
      const request: ListGamesRequest = {
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      
      const metadata = new Metadata();
      metadata.set('identity', 'invalid');
      metadata.set('secret', 'invalid');

      // Act & Assert
      await expect(gameService.listGamesAll(request, metadata)).rejects.toMatchObject({
        code: 16,
        message: 'Invalid credentials'
      });
    });

    it('should fail without authentication metadata', async () => {
      // Arrange
      const request: ListGamesRequest = {
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      
      const metadata = new Metadata(); // Empty metadata

      // Act & Assert
      await expect(gameService.listGamesAll(request, metadata)).rejects.toMatchObject({
        code: 16,
        message: 'Invalid credentials'
      });
    });
  });

  describe('findPreset with authentication', () => {
    it('should successfully find preset with valid credentials', async () => {
      // Arrange
      const request: FindPresetRequest = {
        $type: 'gamehub.proto.client.service.FindPresetRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        currency: 'USD'
      };
      
      const metadata = new Metadata();
      metadata.set('identity', MOCK_AUTH_METADATA.identity);
      metadata.set('secret', MOCK_AUTH_METADATA.secret);

      // Act
      const result = await gameService.findPreset(request, metadata);

      // Assert
      expect(result).toBeDefined();
      expect(result.$type).toBe('gamehub.proto.client.service.PresetResult');
      expect(result.name).toBe('pragmaticplay-sugar-rush-1000 Preset');
      expect(result.currency).toBe('USD');
      expect(result.fields).toHaveLength(2);
      
      const betField = result.fields!.find(f => f.name === 'bet_amount');
      expect(betField).toBeDefined();
      expect(betField!.value).toBe(100);
      expect(betField!.defaultValue).toBe(100);
      expect(betField!.minValue).toBe(10);
      expect(betField!.maxValue).toBe(1000);
      expect(betField!.required).toBe(true);
    });

    it('should fail with invalid credentials', async () => {
      // Arrange
      const request: FindPresetRequest = {
        $type: 'gamehub.proto.client.service.FindPresetRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        currency: 'USD'
      };
      
      const metadata = new Metadata();
      metadata.set('identity', 'invalid');
      metadata.set('secret', 'invalid');

      // Act & Assert
      await expect(gameService.findPreset(request, metadata)).rejects.toMatchObject({
        code: 16,
        message: 'Invalid credentials'
      });
    });
  });

  describe('createSession with authentication', () => {
    it('should successfully create session with valid credentials', async () => {
      // Arrange
      const request: CreateSessionRequest = {
        $type: 'gamehub.proto.client.service.CreateSessionRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        token: 'test-token-123',
        currency: 'USD',
        playerId: 'player-456',
        lobbyUrl: 'https://example.com/lobby',
        locale: 'en',
        platform: 'desktop',
        demo: false
      };
      
      const metadata = new Metadata();
      metadata.set('identity', MOCK_AUTH_METADATA.identity);
      metadata.set('secret', MOCK_AUTH_METADATA.secret);

      // Act
      const result = await gameService.createSession(request, metadata);

      // Assert
      expect(result).toBeDefined();
      expect(result.$type).toBe('gamehub.proto.client.service.SessionResult');
      expect(result.gameLaunchUrl).toContain('pragmaticplay-sugar-rush-1000');
      expect(result.gameLaunchUrl).toContain('player-456');
      expect(result.gameLaunchUrl).toContain('mock-session-token-123');
    });

    it('should fail with invalid credentials', async () => {
      // Arrange
      const request: CreateSessionRequest = {
        $type: 'gamehub.proto.client.service.CreateSessionRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        token: 'test-token-123',
        currency: 'USD',
        lobbyUrl: 'https://example.com/lobby',
        locale: 'en',
        platform: 'desktop',
        demo: false
      };
      
      const metadata = new Metadata();
      metadata.set('identity', 'invalid');
      metadata.set('secret', 'invalid');

      // Act & Assert
      await expect(gameService.createSession(request, metadata)).rejects.toMatchObject({
        code: 16,
        message: 'Invalid credentials'
      });
    });
  });
}); 