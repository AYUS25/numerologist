const fs = require('fs');
let code = fs.readFileSync('src/components/DynamicPhoneAnalyzer.tsx', 'utf8');

code = code.replace(
  /To make this number <strong>lucky<\/strong> for you/,
  `If getting a new phone number, aim for one whose digits reduce to <strong>{lifePathNumber}</strong>. To make your current number <strong>lucky</strong>`
);

fs.writeFileSync('src/components/DynamicPhoneAnalyzer.tsx', code);
