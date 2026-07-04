const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('initAudio()')) {
  // Let's add an effect to init audio on first interaction since browsers block auto-play
  // Actually, we can add a listener to the document
  code = code.replace(
    "export default function App() {",
    `export default function App() {
  useEffect(() => {
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
  
  if (!code.includes('initAudio')) {
     code = code.replace("import { playTactileClick", "import { initAudio, playTactileClick");
  }
  fs.writeFileSync('src/App.tsx', code);
  console.log("Added mount audio effect");
}
