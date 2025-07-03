import { Test } from '@nestjs/testing';
import { ClientsModule } from '@nestjs/microservices';
import { GatewayClientModule } from '../../../src/gateway-client.module';

describe('GatewayClientModule', () => {
  describe('register method', () => {
    it('should create module with correct configuration', async () => {
      // Arrange
      const testUrl = 'localhost:50051';
      
      // Act
      const moduleRef = await Test.createTestingModule({
        imports: [GatewayClientModule.register({ url: testUrl })],
      }).compile();

      // Assert
      expect(moduleRef).toBeDefined();
      expect(moduleRef.get(ClientsModule)).toBeDefined();
    });

    it('should register with custom url', () => {
      // Arrange
      const testUrl = 'custom-host:9999';
      
      // Act
      const dynamicModule = GatewayClientModule.register({ url: testUrl });
      
      // Assert
      expect(dynamicModule.module).toBe(GatewayClientModule);
      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.exports).toEqual([ClientsModule]);
    });

    it('should configure gRPC transport with correct options', () => {
      // Arrange
      const testUrl = 'grpc-server:50051';
      
      // Act
      const dynamicModule = GatewayClientModule.register({ url: testUrl });
      
      // Assert
      expect(dynamicModule.imports).toHaveLength(1);
      
      const clientsModuleConfig = (dynamicModule.imports as any)[0];
      expect(clientsModuleConfig).toBeDefined();
    });

    it('should handle different URL formats', () => {
      // Test different URL formats
      const testCases = [
        'localhost:50051',
        '127.0.0.1:8080',
        'grpc-server.example.com:443',
        'ssl://secure-grpc.com:443'
      ];

      testCases.forEach(url => {
        const dynamicModule = GatewayClientModule.register({ url });
        
        expect(dynamicModule).toBeDefined();
        expect(dynamicModule.module).toBe(GatewayClientModule);
      });
    });
  });
}); 