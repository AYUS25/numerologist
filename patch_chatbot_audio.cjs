const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

if (!code.includes('playMechanicalDial')) {
  code = code.replace(
    /import \{ playTactileClick, playHoverTick \} from '\.\.\/audio';/,
    "import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';"
  );
  
  // When toggling mic, play mechanical dial
  code = code.replace(
    /const toggleListening = \(\) => \{/,
    "const toggleListening = () => {\n    playMechanicalDial();"
  );
  
  fs.writeFileSync('src/components/ChatBot.tsx', code);
  console.log("Patched ChatBot with playMechanicalDial for mic");
}
