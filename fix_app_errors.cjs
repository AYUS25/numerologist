const fs = require('fs');

// 1. Fix apiClient.ts return type for unsubscribe
let apiClientCode = fs.readFileSync('src/apiClient.ts', 'utf8');
apiClientCode = apiClientCode.replace(/return \(\) => listeners\.delete\(listener\);/, `return () => { listeners.delete(listener); };`);
fs.writeFileSync('src/apiClient.ts', apiClientCode);

// 2. Fix App.tsx missing import 'Activity'
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/import \{ Sparkles, Compass, Moon, Sun, AlertCircle, HelpCircle, LogIn, LogOut, User as UserIcon, Save, Trash2, Database, History, Info, Volume2, VolumeX, Music \} from 'lucide-react';/,
`import { Sparkles, Compass, Moon, Sun, AlertCircle, HelpCircle, LogIn, LogOut, User as UserIcon, Save, Trash2, Database, History, Info, Volume2, VolumeX, Music, Activity } from 'lucide-react';`);
fs.writeFileSync('src/App.tsx', appCode);

// 3. Fix ReportView.tsx duplicate data / res undefined
let reportCode = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
// The issue is:
// const data = await fetchWithRetry(...)
// const data = await res.json();
// But I ran a replace that might have failed or missed something. Let's just fix it properly.
// In ReportView, there is a `fetch('/api/numerology/daily-forecast' ...)` which was replaced with `fetchWithRetry`.

reportCode = reportCode.replace(/const data = await fetchWithRetry\('\/api\/numerology\/daily-forecast', \{\n\s*method: 'POST',\n\s*headers: \{ 'Content-Type': 'application\/json' \},\n\s*body: JSON\.stringify\(\{ report \}\)\n\s*\}\);\n\s*const data = await res\.json\(\);/g,
`const data = await fetchWithRetry('/api/numerology/daily-forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
          });`);

// If it's still redeclared, maybe there is another "data"?
// Let's replace the whole block inside fetchHoroscope:
// fetchHoroscope was:
// const fetchHoroscope = async () => { ... const data = await fetchWithRetry ... if (data.forecast) ...

reportCode = reportCode.replace(/const res = await fetch\('\/api\/numerology\/daily-forecast', \{[\s\S]*?const data = await res\.json\(\);/g, 
`const data = await fetchWithRetry('/api/numerology/daily-forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
          });`);

// And I also used a patch that replaced `const res = await fetch` with `const data = await fetchWithRetry` but left `const data = await res.json()`.
// I will just use regex to clean up any remaining `const data = await res.json();`
reportCode = reportCode.replace(/const data = await res\.json\(\);/g, '');

fs.writeFileSync('src/components/ReportView.tsx', reportCode);
