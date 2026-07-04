const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(
  /sessions: \{id: string, date: string, messages: ChatMessage\[\]\}\[\];\n\s*onSaveSession: \(\) => void;\n\s*onRestoreSession: \(id: string\) => void;/,
  ''
);

code = code.replace(
  /sessions,[\s\S]*?onSaveSession,[\s\S]*?onRestoreSession,/,
  ''
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
