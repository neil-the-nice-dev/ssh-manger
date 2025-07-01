import { useState, useEffect } from 'react';
import { Server, ServerConfig, TerminalSession } from '../types/server';

const STORAGE_KEY = 'ssh-manager-servers';
const CONFIG_STORAGE_KEY = 'ssh-manager-configs';
const SESSIONS_STORAGE_KEY = 'ssh-manager-sessions';

export const useServers = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [configs, setConfigs] = useState<ServerConfig[]>([]);
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);

  useEffect(() => {
    const savedServers = localStorage.getItem(STORAGE_KEY);
    const savedConfigs = localStorage.getItem(CONFIG_STORAGE_KEY);
    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const saveServers = (newServers: Server[]) => {
    setServers(newServers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newServers));
  };

  const saveConfigs = (newConfigs: ServerConfig[]) => {
    setConfigs(newConfigs);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfigs));
  };

  const saveSessions = (newSessions: TerminalSession[]) => {
    setSessions(newSessions);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
  };

  const addServer = (server: Omit<Server, 'id' | 'isConnected' | 'connectionStatus'>) => {
    const newServer: Server = {
      ...server,
      id: crypto.randomUUID(),
      isConnected: false,
      connectionStatus: 'disconnected'
    };
    saveServers([...servers, newServer]);
  };

  const updateServer = (id: string, updates: Partial<Server>) => {
    const updatedServers = servers.map(server =>
      server.id === id ? { ...server, ...updates } : server
    );
    saveServers(updatedServers);
  };

  const deleteServer = (id: string) => {
    const filteredServers = servers.filter(server => server.id !== id);
    saveServers(filteredServers);
    
    // Clean up related configs and sessions
    const filteredConfigs = configs.filter(config => config.serverId !== id);
    const filteredSessions = sessions.filter(session => session.serverId !== id);
    saveConfigs(filteredConfigs);
    saveSessions(filteredSessions);
  };

  const connectToServer = async (id: string) => {
    updateServer(id, { connectionStatus: 'connecting' });
    
    // Simulate connection delay
    setTimeout(() => {
      updateServer(id, { 
        connectionStatus: 'connected', 
        isConnected: true,
        lastConnected: new Date()
      });
      setActiveServerId(id);
      
      // Create or activate terminal session
      const existingSession = sessions.find(s => s.serverId === id);
      if (!existingSession) {
        const newSession: TerminalSession = {
          id: crypto.randomUUID(),
          serverId: id,
          isActive: true,
          history: [{
            id: crypto.randomUUID(),
            type: 'output',
            content: `Connected to ${servers.find(s => s.id === id)?.name}`,
            timestamp: new Date()
          }]
        };
        saveSessions([...sessions, newSession]);
      }
    }, 2000);
  };

  const disconnectFromServer = (id: string) => {
    updateServer(id, { 
      connectionStatus: 'disconnected', 
      isConnected: false 
    });
    if (activeServerId === id) {
      setActiveServerId(null);
    }
  };

  return {
    servers,
    configs,
    sessions,
    activeServerId,
    setActiveServerId,
    addServer,
    updateServer,
    deleteServer,
    connectToServer,
    disconnectFromServer,
    saveConfigs,
    saveSessions
  };
};