const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import fetchWithRetry, subscribeApiStats
code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { fetchWithRetry, subscribeApiStats, ApiStats } from './apiClient';");

// Replace daily forecast fetch
code = code.replace(/fetch\('\/api\/numerology\/daily-forecast', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ report \}\)\s*\}\)\.then\(res => res\.json\(\)\)/g, 
`fetchWithRetry('/api/numerology/daily-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      })`);

// Replace chat fetch
code = code.replace(/const response = await fetch\('\/api\/numerology\/chat', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ message: text, history: chatHistory, report \}\),\s*\}\);/,
`const data = await fetchWithRetry('/api/numerology/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory, report }),
    });`);

code = code.replace(/if \(!response\.ok\) throw new Error\('Network response was not ok'\);\s*const data = await response\.json\(\);/, "");

// Add API Status Indicator and diagnostic overlay
// Find the header to add the status indicator. The header is <header className="h-16 bg-dark-panel border-b border-dark-border flex items-center justify-between px-6 shrink-0 relative z-20">
code = code.replace(/<header className="h-16 bg-dark-panel border-b border-dark-border flex items-center justify-between px-6 shrink-0 relative z-20">/, 
`
<header className="h-16 bg-dark-panel border-b border-dark-border flex items-center justify-between px-6 shrink-0 relative z-20">
`);

// Add the ApiStats state to App
code = code.replace(/const \[isTransitLoading, setIsTransitLoading\] = useState\(false\);/,
`const [isTransitLoading, setIsTransitLoading] = useState(false);
  const [apiStats, setApiStats] = useState<ApiStats>({ healthy: true, successfulRequests: 0, failedRequests: 0, remainingQuota: 'Unknown' });
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    return subscribeApiStats(setApiStats);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDiagnostics(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
`);

// Insert the Status Indicator next to the header title
code = code.replace(/<div className="flex items-center gap-3">/,
`<div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1 bg-[#1a1a1a] border border-white/5 rounded-full">
            <div className={\`w-2 h-2 rounded-full \${apiStats.healthy ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'}\`} />
            <span className={\`text-[10px] uppercase font-bold tracking-wider \${apiStats.healthy ? 'text-emerald-400' : 'text-amber-400'}\`}>
              {apiStats.healthy ? 'API Healthy' : 'Rate Limited/Offline'}
            </span>
          </div>`);

// Insert the Diagnostics Overlay right before </main>
code = code.replace(/<\/main>/,
`
        <AnimatePresence>
          {showDiagnostics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-6 z-50 bg-black/90 border border-amber-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md w-80 font-mono"
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 className="text-amber-400 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  API Diagnostics
                </h3>
                <button onClick={() => setShowDiagnostics(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2 text-[10px] text-zinc-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={apiStats.healthy ? "text-emerald-400" : "text-amber-400"}>{apiStats.healthy ? "ONLINE" : "DEGRADED (FALLBACK)"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful Requests:</span>
                  <span className="text-blue-400">{apiStats.successfulRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed/Rate-Limited:</span>
                  <span className="text-rose-400">{apiStats.failedRequests}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-zinc-500">
                  <p>Press Ctrl+Shift+D to toggle</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>`);

fs.writeFileSync('src/App.tsx', code);
