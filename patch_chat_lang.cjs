const fs = require('fs');

// Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /onSendMessage=\{handleSendMessage\}/,
  "onSendMessage={(text) => handleSendMessage(text, 'en-US')} /* Lang will be passed from ChatBot component */"
);
// Wait, ChatBot currently doesn't pass language to onSendMessage.
// Let's modify ChatBot.tsx to pass language.
let chatCode = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');
chatCode = chatCode.replace(
  /onSendMessage: \(text: string\) => void;/,
  "onSendMessage: (text: string, lang: string) => void;"
);
chatCode = chatCode.replace(
  /onSendMessage\(inputText\.trim\(\)\);/,
  "onSendMessage(inputText.trim(), language);"
);
chatCode = chatCode.replace(
  /onSendMessage\(suggestion\);/,
  "onSendMessage(suggestion, language);"
);
fs.writeFileSync('src/components/ChatBot.tsx', chatCode);

// Fix App.tsx signature
appCode = appCode.replace(
  /const handleSendMessage = async \(text: string\) => \{/,
  "const handleSendMessage = async (text: string, lang: string = 'en-US') => {"
);
appCode = appCode.replace(
  /body: JSON\.stringify\(\{/,
  "body: JSON.stringify({\n          language: lang,"
);
// Now we need to make sure we don't have multiple replacements incorrectly applied. Let's rely on standard search and replace.
fs.writeFileSync('src/App.tsx', appCode);

// Update server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  /const \{ report, messages, userMessage \} = req\.body;/,
  "const { report, messages, userMessage, language } = req.body;"
);
serverCode = serverCode.replace(
  /7\. Address the client by name or warmly and provide personalized advice for their current cycles\.`;/,
  "7. Address the client by name or warmly and provide personalized advice for their current cycles.\n8. LANGUAGE DIRECTIVE: The user's interface language is set to '" + "${language === 'hi-IN' ? 'Hindi' : 'English'}" + "'. You MUST reply entirely in " + "${language === 'hi-IN' ? 'Hindi (Devanagari script)' : 'English'}" + " unless quoting specific terminology.`;"
);
fs.writeFileSync('server.ts', serverCode);

console.log("Patched chat language logic");
