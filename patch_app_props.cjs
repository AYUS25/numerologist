const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /sessions=\{chatSessions\}\s*onSendMessage=\{handleSendMessage\}\s*onClearChat=\{handleClearChat\}\s*onSaveSession=\{handleSaveSession\}\s*onRestoreSession=\{handleRestoreSession\}/,
  `onSendMessage={handleSendMessage}\n                  onClearChat={handleClearChat}`
);

fs.writeFileSync('src/App.tsx', code);
