'use client';

import { useEffect, useState } from 'react';

type LogEntry = {
  message: string;
  timestamp: Date;
  level: string;
  details?: string;
};

type DebugFooterPanelProps = {
  logs: LogEntry[];
};

export default function DebugFooterPanel({ logs }: DebugFooterPanelProps) {
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-background shadow-xl border-t border-border text-sm">
      <div className="bg-background rounded-md p-2 space-y-2 max-h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="p-2 rounded-md bg-muted">
            <div className="flex items-center gap-2">
              {getLogIcon(log.level)}
              <span className="font-medium">{log.message}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                <ClientTime timestamp={log.timestamp} />
              </span>
            </div>
            {log.details && (
              <div className="mt-1 text-xs text-muted-foreground">{log.details}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🕓 Hydration-safe client-side time display
const ClientTime = ({ timestamp }: { timestamp: Date }) => {
  const [clientTime, setClientTime] = useState<string | null>(null);

  useEffect(() => {
    const time = new Date(timestamp).toLocaleTimeString();
    setClientTime(time);
  }, [timestamp]);

  return <>{clientTime ?? '—'}</>;
};
