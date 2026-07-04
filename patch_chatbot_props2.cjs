const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(
  /sessions: \{id: string, date: string, messages: ChatMessage\[\]\}\[\];\n\s*onSendMessage: \(text: string, lang: string\) => void;\n\s*onClearChat: \(\) => void;\n\s*onSaveSession: \(\) => void;\n\s*onRestoreSession: \(id: string\) => void;/,
  `onSendMessage: (text: string, lang: string) => void;\n  onClearChat: () => void;`
);

code = code.replace(
  /export default function ChatBot\(\{ report, messages, sessions, onSendMessage, onClearChat, onSaveSession, onRestoreSession, isLoading \}: ChatBotProps\) \{/,
  `export default function ChatBot({ report, messages, onSendMessage, onClearChat, isLoading }: ChatBotProps) {`
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
