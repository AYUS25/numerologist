const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

code = code.replace(
  "Numerologist AI",
  "The Life Audit Panel"
);

code = code.replace(
  "Master Esoteric Consultant & Oracle",
  "Your Personal Numerology Discussion"
);

code = code.replace(
  "NUMEROLOGIST AI ORACLE IS ONLINE",
  "WELCOME TO YOUR LIFE AUDIT"
);

code = code.replace(
  "Your blueprint is loaded. Ask me about your life path, career alignments, romantic compatibilities, or karmic lessons.",
  "Hello! I am your personal Numerologist. Come on in, let's discuss your life, your goals, or anything you'd like to explore. Your blueprint is ready—what's on your mind today?"
);

// We should update the system prompt in server.ts too.
fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log("Patched ChatBot welcome text");
