const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onSendMessage=\{\(text\) => handleSendMessage\(text, 'en-US'\)\} \/\* Lang will be passed from ChatBot component \*\//,
  "onSendMessage={handleSendMessage}"
);

fs.writeFileSync('src/App.tsx', code);
