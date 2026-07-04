const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    { from: /text-slate-900/g, to: 'text-white' },
    { from: /text-slate-800/g, to: 'text-slate-200' },
    { from: /text-slate-700/g, to: 'text-slate-300' },
    { from: /text-slate-500/g, to: 'text-slate-400' }, // Be careful, some slate-500 might want to remain 400 or 500
    { from: /bg-slate-50/g, to: 'bg-dark-bg' },
    { from: /bg-white/g, to: 'bg-dark-panel' },
    { from: /bg-slate-100/g, to: 'bg-black' },
    { from: /border-slate-200/g, to: 'border-white/10' },
    // Some specific Recharts fixes:
    { from: /#ffffff/g, to: '#121212' }, // RechartsTooltip bg
    { from: /#e2e8f0/g, to: '#2a2a2a' }, // CartesianGrid stroke
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

['src/App.tsx', 'src/components/ReportView.tsx', 'src/components/ChatBot.tsx', 'src/components/IntakeForm.tsx', 'src/components/DailyAffirmation.tsx', 'src/components/InfoTooltip.tsx'].forEach(processFile);

// Revert index.css to Dark Mode
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/--color-dark-bg: #f8fafc;/g, '--color-dark-bg: #030712;');
css = css.replace(/--color-dark-panel: #ffffff;/g, '--color-dark-panel: #0f172a;'); // nice dark slate
css = css.replace(/--color-dark-border: #e2e8f0;/g, '--color-dark-border: #1e293b;');
css = css.replace(/body \{[\s\S]*?\}/, 'body { background-color: #030712; color: #f8fafc; background-image: radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(79, 70, 229, 0.05) 0%, transparent 40%); }');
fs.writeFileSync('src/index.css', css);

console.log("Dark Mode applied");
