const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
if (!code.includes("import { AlertCircle")) {
  code = code.replace("import { \n  Sparkles,", "import { \n  AlertCircle,\n  RefreshCw,\n  Sparkles,");
} else {
  code = code.replace("import { AlertCircle,", "import { AlertCircle, RefreshCw,");
}
fs.writeFileSync('src/components/ReportView.tsx', code);
