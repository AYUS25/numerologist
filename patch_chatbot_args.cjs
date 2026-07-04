const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');
code = code.replace(
  /export default function ChatBot\(\{ report, messages,  isLoading \}: ChatBotProps\) \{/,
  `export default function ChatBot({ report, messages, onSendMessage, onClearChat, isLoading }: ChatBotProps) {`
);
fs.writeFileSync('src/components/ChatBot.tsx', code);
