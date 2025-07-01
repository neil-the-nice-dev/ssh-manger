import React from 'react';
import { Server } from '../types/server';
import { 
  Server as ServerIcon, 
  Play, 
  Square, 
  Settings, 
  Trash2,
  Clock,
  Tag
} from 'lucide-react';

interface ServerCardProps {
  server: Server;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConfigure: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onConnect,
  onDisconnect,
  onConfigure,
  onDelete
}) => {
  const getStatusColor = () => {
    switch (server.connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (server.connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700 rounded-lg">
            <ServerIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{server.name}</h3>
            <p className="text-sm text-gray-400">{server.username}@{server.host}:{server.port}</p>
          </div>
        </div>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {server.description && (
        <p className="text-gray-300 text-sm mb-4">{server.description}</p>
      )}

      <div className="flex items-center space-x-2 mb-4">
        {server.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      {server.lastConnected && (
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <Clock className="w-3 h-3 mr-1" />
          Last connected: {new Date(server.lastConnected).toLocaleString()}
        </div>
      )}

      <div className="flex items-center space-x-2">
        {server.connectionStatus === 'connected' ? (
          <button
            onClick={() => onDisconnect(server.id)}
            className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Square className="w-4 h-4 mr-2" />
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => onConnect(server.id)}
            disabled={server.connectionStatus === 'connecting'}
            className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            {server.connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
          </button>
        )}
        
        <button
          onClick={() => onConfigure(server.id)}
          className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </button>
        
        <button
          onClick={() => onDelete(server.id)}
          className="flex items-center px-3 py-2 bg-gray-600 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};