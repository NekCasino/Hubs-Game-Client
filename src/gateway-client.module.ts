import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GatewayClientOptions } from './common.types';
import { prepareSslCredentials } from './ssl.utils';
import { prepareAuthCredentials, combineCredentials } from './auth.utils';

@Module({})
export class GatewayClientModule {
  static register(options: GatewayClientOptions): DynamicModule {
    const { url, ssl, auth } = options;
    
    // Prepare SSL credentials and channel options
    const sslResult = prepareSslCredentials(ssl);
    const { credentials: sslCredentials, channelOptions } = sslResult;
    
    // Prepare authentication credentials
    const authCredentials = prepareAuthCredentials(auth);
    
    // Combine SSL and authentication credentials
    const finalCredentials = combineCredentials(sslResult, authCredentials);

    return {
      module: GatewayClientModule,
      imports: [
        ClientsModule.register([
          {
            name: 'GATEWAY_CLIENT',
            transport: Transport.GRPC,
            options: {
              package: 'gamehub.proto.client.service',
              protoPath: join(__dirname, '../proto/gateway.service.proto'),
              url: url,
              credentials: finalCredentials,
              channelOptions: channelOptions,
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}