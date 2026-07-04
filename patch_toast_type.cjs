const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /setToast\('Cosmic interference detected: Unable to fetch daily transit\.'\)/g,
  "setToast({ message: 'Cosmic interference detected: Unable to fetch daily transit.', type: 'error' })"
);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed toast type');
