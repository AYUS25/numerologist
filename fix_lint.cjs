const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Ensure Compass is imported
if (!code.includes("Compass,")) {
  code = code.replace("Sparkles,", "Sparkles, Compass,");
}

let lines = code.split('\n');
let seenRefreshCw = false;
for (let i = 0; i < 30; i++) {
  if (lines[i].includes('RefreshCw')) {
    if (seenRefreshCw) {
      lines[i] = lines[i].replace('RefreshCw,', '');
    }
    seenRefreshCw = true;
  }
}
code = lines.join('\n');

fs.writeFileSync('src/components/ReportView.tsx', code);
