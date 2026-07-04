const fs = require('fs');

const files = ['src/App.tsx', 'src/components/ReportView.tsx', 'src/components/IntakeForm.tsx', 'src/components/ChatBot.tsx', 'src/components/DailyAffirmation.tsx'];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Switch blues to purples/violets for accent
  const replacements = [
    { from: /blue-500/g, to: 'violet-500' },
    { from: /blue-400/g, to: 'purple-400' },
    { from: /blue-900/g, to: 'violet-900' },
    { from: /blue-300/g, to: 'purple-300' },
    { from: /text-white/g, to: 'text-[#f5f5f7]' }, // softer apple white
    // change font-sans font-light tracking-tight etc to serif where it makes sense
    { from: /font-sans font-light tracking-tight text-([0-9a-z]+)/g, to: 'font-serif text-$1' },
    { from: /font-sans font-medium tracking-tight text-lg font-bold/g, to: 'font-serif text-xl' },
    { from: /font-sans tracking-tight text-2xl font-light/g, to: 'font-serif text-3xl font-normal' },
    { from: /border-l-4 border-violet-500/g, to: 'border-l-[3px] border-violet-500' }, // refined borders
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

files.forEach(processFile);
console.log("Updated components for premium theme");
