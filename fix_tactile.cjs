const fs = require('fs');

let chatbot = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');
chatbot = chatbot.replace(
  'const aiMessage: Message = {',
  'playTactileClick();\n      const aiMessage: Message = {'
);
chatbot = chatbot.replace(
  'const aiMessage: ChatMessage = {',
  'playTactileClick();\n      const aiMessage: ChatMessage = {'
);
fs.writeFileSync('src/components/ChatBot.tsx', chatbot);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('initAudio()')) {
  appCode = appCode.replace(
    "export default function App() {",
    `export default function App() {
  React.useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);`
  );
  if (!appCode.includes('initAudio')) {
    appCode = appCode.replace("import { playTactileClick", "import { initAudio, playTactileClick");
  }
  fs.writeFileSync('src/App.tsx', appCode);
}
