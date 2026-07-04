const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(/<div className="absolute top-16 right-4 z-50 flex flex-col gap-2">[\s\S]*?<\/div>/, '');

code = code.replace(/<button onMouseEnter=\{.*?\} onTouchMove=\{.*?\} \s*onClick=\{.*?setShowHistory\(!showHistory\).*?\}[\s\S]*?<\/button>/, '');

// Also remove the slide-out history panel
code = code.replace(/\{showHistory && \([\s\S]*?Past Consultations[\s\S]*?<\/div>\s*\)\}/, '');

fs.writeFileSync('src/components/ChatBot.tsx', code);
