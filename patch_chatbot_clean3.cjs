const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(
  /\{\/\* History Sidebar Panel \*\/\}[\s\S]*?<\/AnimatePresence>/,
  ''
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
