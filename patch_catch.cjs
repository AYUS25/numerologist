const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /\.catch\(console\.error\)/,
  ".catch((err) => setToast('Cosmic interference detected: Unable to fetch daily transit.'))"
);

fs.writeFileSync('src/App.tsx', app);
console.log('Patched catch block');
