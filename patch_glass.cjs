const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  /\.glass-panel \{[\s\S]*?\}/,
  `.glass-panel {
    @apply bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-500 hover:bg-white/[0.02] hover:shadow-[inset_0_0_10px_rgba(59,130,246,0.05),0_8px_32px_rgba(0,0,0,0.6)];
  }`
);

code = code.replace(
  /\.glass-button \{[\s\S]*?\}/,
  `.glass-button {
    @apply bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/[0.05] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)];
  }`
);

fs.writeFileSync('src/index.css', code);
