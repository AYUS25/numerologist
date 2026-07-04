const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

// The history block starts with {showHistory && (
code = code.replace(/\{showHistory && \([\s\S]*?\)\}/, '');
fs.writeFileSync('src/components/ChatBot.tsx', code);
