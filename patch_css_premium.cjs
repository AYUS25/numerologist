const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@import url[^;]+;/, `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`);

css = css.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "-apple-system", "BlinkMacSystemFont", "Inter", "San Francisco", "Helvetica Neue", "sans-serif";
  --font-serif: "Playfair Display", "Georgia", serif;
  --font-mono: "JetBrains Mono", "SF Mono", ui-monospace, monospace;
  --color-dark-bg: #030305;
  --color-dark-panel: rgba(20, 15, 30, 0.4);
  --color-dark-border: rgba(255, 255, 255, 0.06);
  --color-accent-violet: #8b5cf6;
  --color-accent-purple: #a855f7;
  --color-accent-blue: #3b82f6;
}`);

css = css.replace(/body \{[\s\S]*?\}/, `body { 
  background-color: #030305; 
  color: #f5f5f7; 
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.04) 0%, transparent 40%),
    radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 50%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

/* Custom scrollbar for apple-like feel */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
`);

// Add premium glass utilities
css = css.replace(/@layer utilities \{[\s\S]*?\}/, `@layer utilities {
  .glass-panel {
    @apply bg-white/[0.015] backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[inset_0_0_20px_rgba(139,92,246,0.05),0_8px_32px_rgba(0,0,0,0.4)];
  }
  .glass-button {
    @apply bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.2)];
  }
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400;
  }
}`);

fs.writeFileSync('src/index.css', css);
console.log("Updated index.css for premium theme");
