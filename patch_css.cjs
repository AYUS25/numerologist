const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  /@apply bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400;/,
  `@apply bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-slate-200;`
);

code = code.replace(
  /--color-accent-violet: #8b5cf6;\n  --color-accent-purple: #a855f7;/,
  `--color-accent-violet: #3b82f6;\n  --color-accent-purple: #2563eb;`
);

fs.writeFileSync('src/index.css', code);
