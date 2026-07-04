const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(/text-gold-accent/g, 'text-blue-500');
code = code.replace(/bg-gold-accent/g, 'bg-blue-500');
code = code.replace(/border-gold-accent/g, 'border-blue-500');
code = code.replace(/bg-gold-dark/g, 'bg-blue-500/20');
code = code.replace(/text-gold-dark/g, 'text-blue-400');

// Also remove duplicate onMouseEnters
code = code.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} /g, "");
code = code.replace(/<button(?![^>]*onMouseEnter)([^>]*)>/g, '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} $1>');

fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log('Patched ChatBot colors');
