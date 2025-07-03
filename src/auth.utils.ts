import * as grpc from '@grpc/grpc-js';
import { AuthConfig } from './common.types';

/**
 * Prepare authentication credentials for gRPC client
 * Creates CallCredentials that automatically add identity and secret metadata to all requests
 * 
 * @param auth Authentication configuration
 * @returns CallCredentials or null if auth is not provided
 */
export function prepareAuthCredentials(auth?: AuthConfig): grpc.CallCredentials | null {
  if (!auth?.identity || !auth?.secret) {
    return null;
  }

  const metaCallback = (
    _params: any, 
    callback: (error: Error | null, metadata?: grpc.Metadata) => void
  ) => {
    const metadata = new grpc.Metadata();
    metadata.add('identity', auth.identity);
    metadata.add('secret', auth.secret);
    callback(null, metadata);
  };

  return grpc.credentials.createFromMetadataGenerator(metaCallback);
}

/**
 * Combine SSL and authentication credentials
 * 
 * @param sslResult SSL credentials result with channel options
 * @param authCredentials Authentication call credentials
 * @returns Combined channel credentials
 */
export function combineCredentials(
  sslResult: { credentials: grpc.ChannelCredentials; channelOptions: Record<string, any> } | undefined,
  authCredentials?: grpc.CallCredentials | null
): grpc.ChannelCredentials {
  const channelCredentials = sslResult?.credentials || grpc.credentials.createInsecure();
  
  if (!authCredentials) {
    return channelCredentials;
  }

  return grpc.credentials.combineChannelCredentials(channelCredentials, authCredentials);
} 