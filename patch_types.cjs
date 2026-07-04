const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Set
code = code.replace(/const metricsListeners = new Set\(\);/g, "const metricsListeners = new Set<any>();");

// 2. Fix useApiMetrics return
code = code.replace(/return subscribeToApiMetrics\(setMetrics\);/g, "const unsub = subscribeToApiMetrics(setMetrics); return () => { unsub(); };");

// 3. Fix fetchWithRetry return type usage
code = code.replace(/const response = await fetchWithRetry/g, "const response: any = await fetchWithRetry");

// 4. Fix apiQueue type
code = code.replace(/let apiQueue = \[\];/g, "let apiQueue: any[] = [];");

fs.writeFileSync('src/App.tsx', code);
console.log('Types patched');
