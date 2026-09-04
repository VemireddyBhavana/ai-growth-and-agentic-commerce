export interface ServerConfig {
  env: 'development' | 'test' | 'production';
  port: number;
  corsOrigin: string;
  logLevel: string;
}

export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
}

export interface RedisConfig {
  url: string;
  ttlSeconds?: number;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
}
