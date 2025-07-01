import React, { useState } from 'react';
import { useServers } from './hooks/useServers';
import { ServerCard } from './components/ServerCard';
import { AddServerForm } from './components/AddServerForm';
import { Terminal } from './components/Terminal';
import { ServerConfig } from './components/ServerConfig';
import { 
  Plus, 
  Monitor, 
  Activity, 
  Server as ServerIcon,
  Terminal as TerminalIcon,
  Settings
} from 'lucide-react';

function App() {
  const {
    servers,
    sessions,
    activeServerId,
    addServer,
    connectToServer,
    disconnectFromServer,
    saveSessions
  } = useServers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [configServerId, setConfigServerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'terminal'>('dashboard');

  const activeServer = servers.find(s => s.id === activeServerId);
  const activeSession = sessions.find(s => s.serverId === activeServerId && s.isActive);
  const connectedServers = servers.filter(s => s.isConnected);

  const updateSession = (updatedSession: any) => {
    const updatedSessions = sessions.map(s => 
      s.id === updatedSession.id ? updatedSession : s
    );
    saveSessions(updatedSessions);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-600 rounded-lg">
                  <ServerIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SSH Manager</h1>
                  <p className="text-sm text-gray-400">Manage your servers with ease</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Activity className="w-4 h-4" />
                <span>{connectedServers.length} connected</span>
              </div>
              
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'dashboard' 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('terminal')}
                  disabled={!activeSession}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'terminal' 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <TerminalIcon className="w-4 h-4 inline mr-2" />
                  Terminal
                </button>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <ServerIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Servers</p>
                    <p className="text-2xl font-bold text-white">{servers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Connected</p>
                    <p className="text-2xl font-bold text-white">{connectedServers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <TerminalIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Active Sessions</p>
                    <p className="text-2xl font-bold text-white">{sessions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Offline</p>
                    <p className="text-2xl font-bold text-white">
                      {servers.filter(s => !s.isConnected).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Servers Grid */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Your Servers</h2>
              {servers.length === 0 ? (
                <div className="text-center py-12">
                  <ServerIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No servers configured yet</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add your first server
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servers.map((server) => (
                    <ServerCard
                      key={server.id}
                      server={server}
                      onConnect={connectToServer}
                      onDisconnect={disconnectFromServer}
                      onConfigure={(id) => setConfigServerId(id)}
                      onDelete={(id) => {
                        // Add confirmation dialog here
                        if (confirm('Are you sure you want to delete this server?')) {
                          // deleteServer(id);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'terminal' && activeSession && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Terminal - {activeServer?.name}
              </h2>
              <div className="text-sm text-gray-400">
                Connected as {activeServer?.username}@{activeServer?.host}
              </div>
            </div>
            
            <Terminal
              session={activeSession}
              onUpdateSession={updateSession}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddForm && (
        <AddServerForm
          onClose={() => setShowAddForm(false)}
          onAddServer={addServer}
        />
      )}

      {configServerId && (
        <ServerConfig
          server={servers.find(s => s.id === configServerId)!}
          onClose={() => setConfigServerId(null)}
        />
      )}
    </div>
  );
}

export default App;