const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /generateNumerologyReport\(parsed\.fullName, parsed\.dateOfBirth, parsed\.timeOfBirth, parsed\.placeOfBirth\);/g,
  "generateNumerologyReport(parsed.fullName, parsed.dateOfBirth, parsed.timeOfBirth, parsed.placeOfBirth, parsed.phoneNumber);"
);

app = app.replace(
  /generateNumerologyReport\(input\.fullName, input\.dateOfBirth, input\.timeOfBirth, input\.placeOfBirth\);/g,
  "generateNumerologyReport(input.fullName, input.dateOfBirth, input.timeOfBirth, input.placeOfBirth, input.phoneNumber);"
);

fs.writeFileSync('src/App.tsx', app);
console.log('App patched');
