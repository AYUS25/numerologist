const fs = require('fs');
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Colors mapping
  const replacements = [
    { from: /text-white/g, to: 'text-slate-900' },
    { from: /text-slate-200/g, to: 'text-slate-800' },
    { from: /text-slate-300/g, to: 'text-slate-700' },
    { from: /text-slate-400/g, to: 'text-slate-500' },
    { from: /bg-dark-bg/g, to: 'bg-slate-50' },
    { from: /bg-dark-panel/g, to: 'bg-white' },
    { from: /border-dark-border/g, to: 'border-slate-200' },
    { from: /bg-\[\#121212\]/g, to: 'bg-slate-50' },
    { from: /bg-\[\#171717\]/g, to: 'bg-white' },
    { from: /bg-\[\#0a0a0a\]/g, to: 'bg-slate-100' },
    { from: /bg-black/g, to: 'bg-white' },
    { from: /text-black/g, to: 'text-white' },
    { from: /gold-accent/g, to: 'indigo-600' },
    { from: /gold-dark/g, to: 'indigo-800' },
    { from: /text-\[\#71717a\]/g, to: 'text-slate-500' },
    { from: /text-\[\#525252\]/g, to: 'text-slate-400' },
    { from: /text-\[\#404040\]/g, to: 'text-slate-400' },
    { from: /bg-\[\#171717\]/g, to: 'bg-white' },
    // Some specific ones
    { from: /#D4AF37/g, to: '#4f46e5' }, // AreaChart stroke
    { from: /#121212/g, to: '#ffffff' }, // RechartsTooltip bg
    { from: /#2a2a2a/g, to: '#e2e8f0' }, // CartesianGrid stroke
    { from: /#6b7280/g, to: '#64748b' }, // Axis stroke
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

processFile('src/components/ReportView.tsx');
