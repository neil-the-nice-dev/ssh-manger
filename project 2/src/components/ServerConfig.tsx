import React, { useState } from 'react';
import { Settings, HardDrive, MemoryStick as Memory, Activity, Clock, Globe, Play, Square, RefreshCw } from 'lucide-react';
import { Server, ServerConfig as ServerConfigType, Service } from '../types/server';

interface ServerConfigProps {
  server: Server;
  onClose: () => void;
}

export const ServerConfig: React.FC<ServerConfigProps> = ({ server, onClose }) => {
  const [config] = useState<ServerConfigType>({
    serverId: server.id,
    settings: {
      timezone: 'UTC',
      locale: 'en_US.UTF-8',
      hostname: server.name.toLowerCase().replace(/\s+/g, '-'),
      memory: {
        total: '4.0GB',
        used: '1.2GB',
        free: '2.8GB'
      },
      disk: {
        total: '25GB',
        used: '18GB',
        free: '7GB'
      },
      services: [
        { name: 'nginx', status: 'running', port: 80, description: 'Web server' },
        { name: 'mysql', status: 'running', port: 3306, description: 'Database server' },
        { name: 'redis', status: 'running', port: 6379, description: 'Cache server' },
        { name: 'ssh', status: 'running', port: 22, description: 'SSH server' },
        { name: 'firewall', status: 'running', description: 'UFW firewall' },
        { name: 'cron', status: 'stopped', description: 'Task scheduler' }
      ]
    }
  });

  const getServiceStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-red-400';
      case 'error': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getUsagePercentage = (used: string, total: string) => {
    const usedValue = parseFloat(used);
    const totalValue = parseFloat(total);
    return Math.round((usedValue / totalValue) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Server Configuration</h2>
            <span className="text-gray-400">- {server.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Memory className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Memory</span>
                </div>
                <span className="text-xs text-gray-400">
                  {getUsagePercentage(config.settings.memory.used, config.settings.memory.total)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">
                  Used: {config.settings.memory.used} / {config.settings.memory.total}
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${getUsagePercentage(config.settings.memory.used, config.settings.memory.total)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Disk</span>
                </div>
                <span className="text-xs text-gray-400">
                  {getUsagePercentage(config.settings.disk.used, config.settings.disk.total)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">
                  Used: {config.settings.disk.used} / {config.settings.disk.total}
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${getUsagePercentage(config.settings.disk.used, config.settings.disk.total)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium text-gray-300">System</span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Hostname:</span>
                  <span>{config.settings.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span>{config.settings.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Locale:</span>
                  <span>{config.settings.locale}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                Services
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {config.settings.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'running' ? 'bg-green-400' : 
                      service.status === 'stopped' ? 'bg-red-400' : 'bg-orange-400'
                    }`} />
                    <div>
                      <div className="font-medium text-white">{service.name}</div>
                      <div className="text-sm text-gray-400">{service.description}</div>
                    </div>
                    {service.port && (
                      <div className="text-xs text-gray-500 bg-gray-600 px-2 py-1 rounded">
                        :{service.port}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getServiceStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    {service.status === 'running' ? (
                      <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                        <Square className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-1 text-green-400 hover:text-green-300 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors">
              <RefreshCw className="w-5 h-5 mx-auto mb-2" />
              Restart Services
            </button>
            <button className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
              <Activity className="w-5 h-5 mx-auto mb-2" />
              System Update
            </button>
            <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
              <HardDrive className="w-5 h-5 mx-auto mb-2" />
              Backup Data
            </button>
            <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              <Globe className="w-5 h-5 mx-auto mb-2" />
              Network Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};