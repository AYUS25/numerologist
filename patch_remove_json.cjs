const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove Export JSON function
code = code.replace(
  /const handleExportJSON = \(\) => \{[\s\S]*?document\.body\.removeChild\(a\);\n  \};/,
  ""
);

// Remove Import JSON function
code = code.replace(
  /const handleImportJSON = \(event: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?event\.target\.value = ''; \/\/ reset input\n  \};/,
  ""
);

// Remove buttons
code = code.replace(
  /<button onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} onClick=\{handleExportJSON\} className="hover:text-gold-accent transition-colors flex items-center gap-1" title="Export Profile">[\s\S]*?<\/button>/,
  ""
);

code = code.replace(
  /<label className="cursor-pointer hover:text-gold-accent transition-colors flex items-center gap-1" title="Import Profile">[\s\S]*?<\/label>/,
  ""
);

fs.writeFileSync('src/App.tsx', code);
console.log("Removed JSON import/export");
