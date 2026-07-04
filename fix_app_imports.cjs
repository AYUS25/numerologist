const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (code.includes("import { playTactileClick, playHoverTick } from './audio';")) {
  code = code.replace("import { playTactileClick, playHoverTick } from './audio';", "import { initAudio, playTactileClick, playHoverTick } from './audio';");
} else if (!code.includes('initAudio')) {
  code = "import { initAudio, playTactileClick, playHoverTick } from './audio';\n" + code;
}

fs.writeFileSync('src/App.tsx', code);
