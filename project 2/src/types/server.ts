export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  keyPath?: string;
  password?: string;
  description?: string;
  tags: string[];
  lastConnected?: Date;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
}

export interface ServerConfig {
  serverId: string;
  settings: {
    timezone: string;
    locale: string;
    hostname: string;
    memory: {
      total: string;
      used: string;
      free: string;
    };
    disk: {
      total: string;
      used: string;
      free: string;
    };
    services: Service[];
  };
}

export interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error';
  port?: number;
  description: string;
}

export interface TerminalSession {
  id: string;
  serverId: string;
  isActive: boolean;
  history: TerminalLine[];
}

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}