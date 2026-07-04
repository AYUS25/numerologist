const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change solid panels to glass panels
  const replacements = [
    { from: /bg-dark-panel/g, to: 'bg-white/5 backdrop-blur-md' },
    { from: /border-white\/10/g, to: 'border-white/10' },
    { from: /bg-black/g, to: 'bg-black/40 backdrop-blur-sm' },
    { from: /bg-\[\#121212\]/g, to: 'bg-white/5 backdrop-blur-md' },
    { from: /bg-dark-bg/g, to: 'bg-transparent' }, // remove solid backgrounds from internal elements if possible
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

processFile('src/components/ReportView.tsx');

console.log("Glassmorphism applied");
