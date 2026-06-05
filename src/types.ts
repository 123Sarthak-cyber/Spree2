export interface ServerConfig {
  hasGeminiKey: boolean;
  appUrl: string;
  nodeVersion: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  environment: string;
  config: ServerConfig;
  message: string;
}

export interface Message {
  id: string;
  sender: "user" | "server";
  text: string;
  timestamp: string;
}

export interface ChatResponse {
  text: string;
  model: string;
}
