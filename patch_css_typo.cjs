const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

// Replace the Google Fonts import
code = code.replace(
  /@import url\('https:\/\/fonts.googleapis.com\/css2\?family=[^']+'\);/,
  "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');"
);

// Update theme font families
code = code.replace(
  /--font-sans: [^;]+;/,
  '--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;'
);
code = code.replace(
  /--font-serif: [^;]+;/,
  '--font-serif: "Playfair Display", ui-serif, Georgia, serif;'
);

fs.writeFileSync('src/index.css', code);
console.log("CSS updated");
