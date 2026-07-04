const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

// The response is handled inside handleSubmitWithVoice and handleSubmit
code = code.replace(
  'const aiMessage: Message = {',
  'playTactileClick();\n      const aiMessage: Message = {'
);

code = code.replace(
  'const aiMessage: ChatMessage = {',
  'playTactileClick();\n      const aiMessage: ChatMessage = {'
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log("Patched tactile feedback on Oracle messages");
