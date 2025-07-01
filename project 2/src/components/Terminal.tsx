import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, Maximize2 } from 'lucide-react';
import { TerminalSession, TerminalLine } from '../types/server';

interface TerminalProps {
  session: TerminalSession;
  onUpdateSession: (session: TerminalSession) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ session, onUpdateSession }) => {
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [session.history]);

  const handleCommand = (command: string) => {
    const newLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'command',
      content: command,
      timestamp: new Date()
    };

    // Simulate command output
    const outputs = getCommandOutput(command);
    
    const updatedHistory = [
      ...session.history,
      newLine,
      ...outputs.map(output => ({
        id: crypto.randomUUID(),
        type: output.type as 'output' | 'error',
        content: output.content,
        timestamp: new Date()
      }))
    ];

    onUpdateSession({
      ...session,
      history: updatedHistory
    });
  };

  const getCommandOutput = (command: string) => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'ls' || cmd === 'ls -la') {
      return [
        { type: 'output', content: 'drwxr-xr-x  3 root root  4096 Jan 15 10:30 backups' },
        { type: 'output', content: 'drwxr-xr-x  2 root root  4096 Jan 14 09:15 config' },
        { type: 'output', content: '-rw-r--r--  1 root root   853 Jan 12 14:22 server.log' },
        { type: 'output', content: 'drwxr-xr-x  5 root root  4096 Jan 10 11:45 www' }
      ];
    }
    
    if (cmd === 'ps aux' || cmd === 'ps') {
      return [
        { type: 'output', content: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' },
        { type: 'output', content: 'root         1  0.0  0.1  21576  3024 ?        Ss   Jan10   0:02 /sbin/init' },
        { type: 'output', content: 'root       123  0.0  0.2  12345  2048 ?        S    Jan10   0:01 nginx' },
        { type: 'output', content: 'www-data   124  0.1  0.3  45678  3072 ?        S    Jan10   0:15 apache2' }
      ];
    }
    
    if (cmd === 'df -h') {
      return [
        { type: 'output', content: 'Filesystem      Size  Used Avail Use% Mounted on' },
        { type: 'output', content: '/dev/vda1        25G   18G  6.2G  75% /' },
        { type: 'output', content: 'tmpfs           2.0G     0  2.0G   0% /dev/shm' }
      ];
    }
    
    if (cmd === 'free -h') {
      return [
        { type: 'output', content: '              total        used        free      shared  buff/cache   available' },
        { type: 'output', content: 'Mem:           4.0G        1.2G        1.8G         12M        1.0G        2.6G' },
        { type: 'output', content: 'Swap:          2.0G          0B        2.0G' }
      ];
    }
    
    if (cmd.startsWith('cd ')) {
      return [{ type: 'output', content: '' }];
    }
    
    if (cmd === 'pwd') {
      return [{ type: 'output', content: '/home/root' }];
    }
    
    if (cmd === 'whoami') {
      return [{ type: 'output', content: 'root' }];
    }
    
    if (cmd === 'clear') {
      // Clear the terminal
      onUpdateSession({
        ...session,
        history: []
      });
      return [];
    }
    
    if (cmd === 'help') {
      return [
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  ls, ls -la     - List directory contents' },
        { type: 'output', content: '  ps, ps aux     - List running processes' },
        { type: 'output', content: '  df -h          - Display filesystem usage' },
        { type: 'output', content: '  free -h        - Display memory usage' },
        { type: 'output', content: '  pwd            - Print working directory' },
        { type: 'output', content: '  whoami         - Print current user' },
        { type: 'output', content: '  clear          - Clear terminal' },
        { type: 'output', content: '  help           - Show this help message' }
      ];
    }
    
    return [{ type: 'error', content: `bash: ${command}: command not found` }];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  const clearTerminal = () => {
    onUpdateSession({
      ...session,
      history: []
    });
  };

  const copyToClipboard = () => {
    const content = session.history
      .map(line => line.content)
      .join('\n');
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Copy terminal content"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={terminalRef}
        className="p-4 font-mono text-sm text-green-400 bg-black overflow-y-auto"
        style={{ height: isFullscreen ? 'calc(100% - 100px)' : '300px' }}
        onClick={() => inputRef.current?.focus()}
      >
        {session.history.map((line) => (
          <div key={line.id} className="mb-1">
            {line.type === 'command' && (
              <div className="text-cyan-400">
                <span className="text-green-400">root@server:~$</span> {line.content}
              </div>
            )}
            {line.type === 'output' && (
              <div className="text-gray-300 pl-4">{line.content}</div>
            )}
            {line.type === 'error' && (
              <div className="text-red-400 pl-4">{line.content}</div>
            )}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">root@server:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-cyan-400 outline-none"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};