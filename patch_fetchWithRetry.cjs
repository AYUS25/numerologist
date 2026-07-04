const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const fetchWithRetry = \(url, options = \{\}, retries = 3\) => \{/g, "const fetchWithRetry = (url: string, options: any = {}, retries: number = 3): Promise<any> => {");

fs.writeFileSync('src/App.tsx', code);
console.log('fetchWithRetry typed');
