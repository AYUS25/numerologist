const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Replace standard fetch with fetchWithRetry
code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { fetchWithRetry } from '../apiClient';");

code = code.replace(/const res = await fetch\('\/api\/numerology\/daily-forecast', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ report \}\)\s*\}\);/,
`const data = await fetchWithRetry('/api/numerology/daily-forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
          });`);

code = code.replace(/if \(!res\.ok\) throw new Error\('Failed to fetch'\);\s*const data = await res\.json\(\);/, "");

fs.writeFileSync('src/components/ReportView.tsx', code);
