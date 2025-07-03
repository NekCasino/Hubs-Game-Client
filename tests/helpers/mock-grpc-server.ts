import { Server, ServerCredentials } from '@grpc/grpc-js';
import { MOCK_AUTH_METADATA } from '../fixtures/mock-responses';

/**
 * Mock gRPC server for testing client functionality
 */
export class TestMockGrpcServer {
  private server: Server;
  private assignedPort?: number;

  constructor() {
    this.server = new Server();
  }

  /**
   * Start the mock gRPC server on random available port
   */
  async start(): Promise<number> {
    console.log('Setting up mock gRPC server');

    // Simple service definition for testing
    const serviceDefinition = {
      listGamesAll: {
        path: '/gamehub.proto.client.service.GameService/ListGamesAll',
        requestStream: false,
        responseStream: false,
        requestType: Object, // Use simple object types
        responseType: Object,
      },
      findPreset: {
        path: '/gamehub.proto.client.service.GameService/FindPreset',
        requestStream: false,
        responseStream: false,
        requestType: Object,
        responseType: Object,
      },
      createSession: {
        path: '/gamehub.proto.client.service.GameService/CreateSession',
        requestStream: false,
        responseStream: false,
        requestType: Object,
        responseType: Object,
      },
      createFreeSpin: {
        path: '/gamehub.proto.client.service.GameService/CreateFreeSpin',
        requestStream: false,
        responseStream: false,
        requestType: Object,
        responseType: Object,
      },
      cancelFreeSpin: {
        path: '/gamehub.proto.client.service.GameService/CancelFreeSpin',
        requestStream: false,
        responseStream: false,
        requestType: Object,
        responseType: Object,
      },
    };

    // Add service implementation
    this.server.addService(serviceDefinition as any, {
      listGamesAll: this.listGamesAll.bind(this),
      findPreset: this.findPreset.bind(this),
      createSession: this.createSession.bind(this),
      createFreeSpin: this.createFreeSpin.bind(this),
      cancelFreeSpin: this.cancelFreeSpin.bind(this),
    });

    console.log('Service added to server');

    // Bind and start the server on random port
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        '0.0.0.0:0', // 0 means random available port
        ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            console.error('Failed to bind server:', error);
            reject(error);
            return;
          }

          this.server.start();
          this.assignedPort = port;
          console.log(`Mock gRPC server started on port ${port}`);
          resolve(port);
        }
      );
    });
  }

  /**
   * Get the assigned port number
   */
  getPort(): number {
    if (!this.assignedPort) {
      throw new Error('Server not started yet');
    }
    return this.assignedPort;
  }

  /**
   * Stop the server
   */
  stop(): void {
    console.log('Stopping mock gRPC server');
    this.server.forceShutdown();
  }

  /**
   * Validate authentication metadata
   */
  private validateAuth(call: any): boolean {
    const metadata = call.metadata;
    if (!metadata) {
      console.log('No metadata provided');
      return false;
    }
    
    const identityValues = metadata.get('identity');
    const secretValues = metadata.get('secret');
    
    const identity = identityValues && identityValues.length > 0 ? identityValues[0] : null;
    const secret = secretValues && secretValues.length > 0 ? secretValues[0] : null;
    
    console.log('Auth check - identity:', identity, 'secret:', secret);
    console.log('Expected - identity:', MOCK_AUTH_METADATA.identity, 'secret:', MOCK_AUTH_METADATA.secret);
    
    return identity === MOCK_AUTH_METADATA.identity && secret === MOCK_AUTH_METADATA.secret;
  }

  /**
   * Create error response for authentication failures
   */
  private createAuthError() {
    const error = new Error('Invalid credentials');
    (error as any).code = 16; // UNAUTHENTICATED
    (error as any).details = 'Invalid credentials';
    return error;
  }

  /**
   * Mock implementation of listGamesAll
   */
  private listGamesAll(call: any, callback: any): void {
    console.log('=== listGamesAll called ===');
    console.log('Request:', call.request);
    console.log('Metadata map:', call.metadata.getMap());
    
    // Check authentication
    if (!this.validateAuth(call)) {
      console.log('Authentication failed');
      callback(this.createAuthError());
      return;
    }

    // Create a response with proper $type fields
    const response = {
      $type: "gamehub.proto.client.service.ListGamesResult",
      categories: [],
      providers: [{
        $type: "gamehub.proto.client.service.ListGamesResult.ProviderResult",
        identity: "pragmaticplay",
        name: "Pragmatic Play",
        images: {}
      }],
      games: [{
        $type: "gamehub.proto.client.service.ListGamesResult.GameResult",
        identity: "pragmaticplay-sugar-rush-1000",
        name: "Sugar Rush 1000",
        images: {
          "200x300": "/games/pragmaticplay/1746701490540-200x300-pragmaticplay-sugar-rush-1000@1x.webp",
          "200x200": "/games/pragmaticplay/1746701490346-200x200-pragmaticplay-sugar-rush-1000@1x.webp"
        },
        provider: "pragmaticplay",
        categories: [],
        bonusBet: true,
        bonusWagering: true,
        supportedLang: ["en", "ru", "de", "fr"],
        platforms: ["mobile", "web"],
        demoEnable: false,
        freespinEnable: true,
        freechipEnable: false,
        jackpotEnable: false,
        bonusBuyEnable: false
      }]
    };
    
    console.log('Returning listGamesAll response:', JSON.stringify(response, null, 2));
    callback(null, response);
  }

  /**
   * Mock implementation of findPreset
   */
  private findPreset(call: any, callback: any): void {
    console.log('=== findPreset called ===');
    console.log('Request:', call.request);
    console.log('Metadata map:', call.metadata.getMap());
    
    if (!this.validateAuth(call)) {
      console.log('Authentication failed');
      callback(this.createAuthError());
      return;
    }

    const { gameIdentity, currency } = call.request;

    const response = {
      $type: "gamehub.proto.client.service.PresetResult",
      id: 'preset-001',
      name: `${gameIdentity} Preset`,
      currency: currency,
      fields: [
        {
          $type: "gamehub.proto.client.service.PresetResult.Field",
          name: 'bet_amount',
          value: 100,
          defaultValue: 100,
          minValue: 10,
          maxValue: 1000,
          required: true
        },
        {
          $type: "gamehub.proto.client.service.PresetResult.Field",
          name: 'lines',
          value: 20,
          defaultValue: 20,
          minValue: 1,
          maxValue: 25,
          required: false
        }
      ]
    };

    console.log('Returning findPreset response:', JSON.stringify(response, null, 2));
    callback(null, response);
  }

  /**
   * Mock implementation of createSession
   */
  private createSession(call: any, callback: any): void {
    console.log('=== createSession called ===');
    console.log('Request:', call.request);
    console.log('Metadata map:', call.metadata.getMap());
    
    if (!this.validateAuth(call)) {
      console.log('Authentication failed');
      callback(this.createAuthError());
      return;
    }

    const { gameIdentity, playerId } = call.request;

    const response = {
      $type: "gamehub.proto.client.service.SessionResult",
      gameLaunchUrl: `https://mock-game-server.example.com/launch?game=${gameIdentity}&player=${playerId || 'demo'}&token=mock-session-token-123`
    };

    console.log('Returning createSession response:', JSON.stringify(response, null, 2));
    callback(null, response);
  }

  /**
   * Mock implementation of createFreeSpin
   */
  private createFreeSpin(call: any, callback: any): void {
    console.log('=== createFreeSpin called ===');
    
    if (!this.validateAuth(call)) {
      console.log('Authentication failed');
      callback(this.createAuthError());
      return;
    }
    
    const response = {
      $type: "gamehub.proto.client.service.FreeSpinResult",
      referenceId: call.request.referenceId || 'freespin-' + Date.now()
    };

    console.log('Returning createFreeSpin response:', JSON.stringify(response, null, 2));
    callback(null, response);
  }

  /**
   * Mock implementation of cancelFreeSpin
   */
  private cancelFreeSpin(call: any, callback: any): void {
    console.log('=== cancelFreeSpin called ===');
    
    if (!this.validateAuth(call)) {
      console.log('Authentication failed');
      callback(this.createAuthError());
      return;
    }
    
    const response = {
      $type: "gamehub.proto.client.service.FreeSpinResult",
      referenceId: call.request.referenceId
    };

    console.log('Returning cancelFreeSpin response:', JSON.stringify(response, null, 2));
    callback(null, response);
  }
} 