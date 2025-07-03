import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SslConfig, AuthConfig } from './common.types';

/**
 * Configuration interface for GameHub gRPC Client module
 */
export interface GamehubGrpcModuleOptions {
  /** gRPC server URL (host:port) */
  url: string;
  /** SSL configuration for secure connections */
  ssl?: SslConfig;
  /** Authentication configuration */
  auth?: AuthConfig;
}

/**
 * Module definition using ConfigurableModuleBuilder
 * This creates a configurable module with forRoot() and forRootAsync() methods
 */
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GamehubGrpcModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createGamehubGrpcModuleOptions')
    .build(); 