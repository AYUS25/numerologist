const fs = require('fs');
let code = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');

code = code.replace(/const \[phoneNumber, setPhoneNumber\] = useState\(initialValues\?\.phoneNumber \|\| ''\);\n/, '');

// Also remove it from the submission
code = code.replace(/phoneNumber\n/, '');

fs.writeFileSync('src/components/IntakeForm.tsx', code);
