import { Test, TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { of, throwError } from 'rxjs';
import { GameServiceClientService } from '../../../src/services/gateway.service';
import { 
  GameServiceClient, 
  ListGamesRequest, 
  ListGamesResult,
  FindPresetRequest,
  PresetResult,
  CreateSessionRequest,
  SessionResult,
  GAME_SERVICE_NAME
} from '../../../src/types/gateway.types';
import { MOCK_LIST_GAMES_RESPONSE, MOCK_PRESET_RESPONSE, MOCK_SESSION_RESPONSE } from '../../fixtures/mock-responses';

describe('GameServiceClientService', () => {
  let service: GameServiceClientService;
  let mockGrpcClient: jest.Mocked<ClientGrpc>;
  let mockGameService: jest.Mocked<GameServiceClient>;

  beforeEach(async () => {
    // Create mock GameService
    mockGameService = {
      listGamesAll: jest.fn(),
      findPreset: jest.fn(),
      createSession: jest.fn(),
      createFreeSpin: jest.fn(),
      cancelFreeSpin: jest.fn(),
    } as any;

    // Create mock ClientGrpc
    mockGrpcClient = {
      getService: jest.fn().mockReturnValue(mockGameService),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameServiceClientService,
        {
          provide: 'GATEWAY_CLIENT',
          useValue: mockGrpcClient,
        },
      ],
    }).compile();

    service = module.get<GameServiceClientService>(GameServiceClientService);
    service.onModuleInit();
  });

  describe('onModuleInit', () => {
    it('should initialize the gRPC service', () => {
      expect(mockGrpcClient.getService).toHaveBeenCalledWith(GAME_SERVICE_NAME);
    });
  });

  describe('listGamesAll', () => {
    it('should call grpc service and return games list', async () => {
      // Arrange
      const request: ListGamesRequest = { 
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      
      mockGameService.listGamesAll.mockReturnValue(of(MOCK_LIST_GAMES_RESPONSE));

      // Act
      const result = await service.listGamesAll(request);

      // Assert
      expect(mockGameService.listGamesAll).toHaveBeenCalledWith(
        request, 
        expect.any(Metadata)
      );
      expect(result).toEqual(MOCK_LIST_GAMES_RESPONSE);
      expect(result.games).toHaveLength(1);
      expect(result.games![0].identity).toBe('pragmaticplay-sugar-rush-1000');
      expect(result.providers).toHaveLength(1);
      expect(result.providers![0].identity).toBe('pragmaticplay');
    });

    it('should handle grpc errors', async () => {
      // Arrange
      const request: ListGamesRequest = { 
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      const error = new Error('gRPC connection failed');
      mockGameService.listGamesAll.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.listGamesAll(request)).rejects.toThrow('gRPC connection failed');
    });

    it('should handle authentication errors', async () => {
      // Arrange
      const request: ListGamesRequest = { 
        $type: 'gamehub.proto.client.service.ListGamesRequest'
      };
      const authError = { code: 16, message: 'Invalid credentials' };
      mockGameService.listGamesAll.mockReturnValue(throwError(() => authError));

      // Act & Assert
      await expect(service.listGamesAll(request)).rejects.toEqual(authError);
    });
  });

  describe('findPreset', () => {
    it('should call grpc service and return preset data', async () => {
      // Arrange
      const request: FindPresetRequest = {
        $type: 'gamehub.proto.client.service.FindPresetRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        currency: 'USD',
      };
      
      mockGameService.findPreset.mockReturnValue(of(MOCK_PRESET_RESPONSE));

      // Act
      const result = await service.findPreset(request);

      // Assert
      expect(mockGameService.findPreset).toHaveBeenCalledWith(
        request,
        expect.any(Metadata)
      );
      expect(result).toEqual(MOCK_PRESET_RESPONSE);
      expect(result.id).toBe('preset-001');
      expect(result.fields).toHaveLength(2);
    });

    it('should handle preset not found error', async () => {
      // Arrange
      const request: FindPresetRequest = {
        $type: 'gamehub.proto.client.service.FindPresetRequest',
        gameIdentity: 'invalid-game',
        currency: 'USD',
      };
      const error = { code: 5, message: 'Preset not found' };
      mockGameService.findPreset.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.findPreset(request)).rejects.toEqual(error);
    });
  });

  describe('createSession', () => {
    it('should call grpc service and return session URL', async () => {
      // Arrange
      const request: CreateSessionRequest = {
        $type: 'gamehub.proto.client.service.CreateSessionRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        token: 'test-token',
        currency: 'USD',
        playerId: 'player-123',
        lobbyUrl: 'https://example.com/lobby',
        locale: 'en',
        platform: 'desktop',
        demo: false,
      };
      
      mockGameService.createSession.mockReturnValue(of(MOCK_SESSION_RESPONSE));

      // Act
      const result = await service.createSession(request);

      // Assert
      expect(mockGameService.createSession).toHaveBeenCalledWith(
        request,
        expect.any(Metadata)
      );
      expect(result).toEqual(MOCK_SESSION_RESPONSE);
      expect(result.gameLaunchUrl).toContain('pragmaticplay-sugar-rush-1000');
    });

    it('should create demo session when playerId is not provided', async () => {
      // Arrange
      const request: CreateSessionRequest = {
        $type: 'gamehub.proto.client.service.CreateSessionRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        token: 'test-token',
        currency: 'USD',
        lobbyUrl: 'https://example.com/lobby',
        locale: 'en',
        platform: 'desktop',
        demo: false,
      };
      
      mockGameService.createSession.mockReturnValue(of(MOCK_SESSION_RESPONSE));

      // Act
      await service.createSession(request);

      // Assert
      expect(mockGameService.createSession).toHaveBeenCalledWith(
        request,
        expect.any(Metadata)
      );
    });

    it('should handle session creation errors', async () => {
      // Arrange
      const request: CreateSessionRequest = {
        $type: 'gamehub.proto.client.service.CreateSessionRequest',
        gameIdentity: 'pragmaticplay-sugar-rush-1000',
        token: 'test-token',
        currency: 'USD',
        playerId: 'player-123',
        lobbyUrl: 'https://example.com/lobby',
        locale: 'en',
        platform: 'desktop',
        demo: false,
      };
      
      const error = { code: 13, message: 'Session creation failed' };
      mockGameService.createSession.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.createSession(request)).rejects.toEqual(error);
    });
  });
}); 