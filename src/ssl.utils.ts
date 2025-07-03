import * as grpc from '@grpc/grpc-js';
import { SslConfig } from './common.types';

/**
 * SSL credentials result
 */
export interface SslCredentialsResult {
  credentials: grpc.ChannelCredentials;
  channelOptions: Record<string, any>;
}

/**
 * Prepare SSL credentials and channel options based on configuration
 * @param ssl SSL configuration
 * @returns SSL credentials and channel options
 */
export function prepareSslCredentials(ssl?: SslConfig): SslCredentialsResult {
  let credentials: grpc.ChannelCredentials;
  let channelOptions: Record<string, any> = {};
  
  if (ssl?.enabled) {
    // Use SSL credentials
    credentials = grpc.credentials.createSsl();
    
    // Add SSL channel options if provided
    if (ssl.targetNameOverride) {
      channelOptions['grpc.ssl_target_name_override'] = ssl.targetNameOverride;
    }
    if (ssl.defaultAuthority) {
      channelOptions['grpc.default_authority'] = ssl.defaultAuthority;
    }
  } else {
    // Use insecure credentials
    credentials = grpc.credentials.createInsecure();
  }
  
  return { credentials, channelOptions };
} 