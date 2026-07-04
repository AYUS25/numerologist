const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "body: JSON.stringify({\n          language: lang, report })",
  "body: JSON.stringify({ report })"
);

code = code.replace(
  "body: JSON.stringify({\n          report: report,\n          messages: chatHistory,\n          userMessage: text,\n        }),",
  "body: JSON.stringify({\n          language: lang,\n          report: report,\n          messages: chatHistory,\n          userMessage: text,\n        }),"
);

fs.writeFileSync('src/App.tsx', code);
