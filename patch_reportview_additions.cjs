const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// 1. Rename Tabs & Sections
code = code.replace(/Life Sectors & Cautions/g, 'Life Alignment Sectors');
code = code.replace(/Vibrational Life Domains/g, 'Life Alignment Sectors');
code = code.replace(/Vibrational Domains Intensity Scaling/g, 'Life Alignment Sectors Intensity Scaling');
code = code.replace(/Tab 7: Vibrational Domains/g, 'Tab 7: Life Alignment Sectors');
code = code.replace(/Tab 7: Life Sectors/g, 'Tab 7: Life Alignment Sectors');

// 2. Insert Peace & Prosperity widget into Profile Tab Header 
// Look for `{/* 1. Profile Header block */}` and insert before it
const peaceWidget = `
      {/* Peace & Prosperity Dashboard */}
      {report.metrics.peaceIndex && report.metrics.prosperityPotential && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-serif mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Emotional Peace Index
            </h4>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * report.metrics.peaceIndex) / 100} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-serif text-white">{report.metrics.peaceIndex}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">/100</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-4 text-center">Based on Life Path & Personal Year alignment.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-serif mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Prosperity Potential
            </h4>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * report.metrics.prosperityPotential) / 100} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-serif text-white">{report.metrics.prosperityPotential}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">/100</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-4 text-center">Current material manifestation capacity.</p>
          </div>
        </div>
      )}
`;

code = code.replace(
  "{/* 1. Profile Header block */}",
  peaceWidget + "\n      {/* 1. Profile Header block */}"
);

// 3. Insert Lifecycle Phases into Timeline Tab
// We'll replace the existing basic pinnacle display or prepend this to the timeline tab
const lifecycleWidget = `
              {/* Lifecycle Phases section */}
              {report.lifecyclePhases && (
                <div className="glass-panel p-8 rounded-2xl mb-8">
                  <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider font-serif mb-6 flex items-center gap-2">
                    <Grid className="w-4 h-4 text-blue-500" />
                    Stages of Development (Lifecycle Phases)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {report.lifecyclePhases.map((phase, idx) => (
                      <div key={idx} className="bg-black/20 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                          <span className="text-6xl font-serif font-bold">{idx + 1}</span>
                        </div>
                        <h5 className="text-lg font-serif text-white mb-1">{phase.stage}</h5>
                        <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-4">{phase.ageRange}</p>
                        <p className="text-sm text-zinc-300 font-sans mb-3">{phase.theme}</p>
                        <div className="flex justify-between items-center text-xs text-zinc-500 pt-3 border-t border-white/5">
                          <span>Pinnacle: <strong className="text-white">{phase.pinnacle}</strong></span>
                          <span>Challenge: <strong className="text-white">{phase.challenge}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

code = code.replace(
  "{/* Timeline visualization using Recharts */}",
  lifecycleWidget + "\n              {/* Timeline visualization using Recharts */}"
);

// 4. Update Typography (Replace font-sans on headers to font-serif)
code = code.replace(/font-sans font-medium tracking-tight/g, 'font-serif');
code = code.replace(/font-sans tracking-tight/g, 'font-serif');

// 5. Inject Phone Analysis Tab
const analysisTabDef = "{ id: 'analysis', label: 'Name & Phone Analysis', icon: User },\n";
code = code.replace(
  "{ id: 'sectors', label: 'Life Alignment Sectors', icon: Compass },",
  "{ id: 'sectors', label: 'Life Alignment Sectors', icon: Compass },\n    " + analysisTabDef
);

const analysisTabContent = `
          {/* Tab: Name & Phone Analysis */}
          {activeTab === 'analysis' && (
            <motion.div
              key="tab-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {report.nameAnalysis && (
                <div className="glass-panel p-8 rounded-2xl">
                  <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider font-serif mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Name Resonance Analysis
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                      <span className="text-4xl font-serif text-blue-400">{report.nameAnalysis.currentExpression}</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed mb-4">{report.nameAnalysis.insight}</p>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2 font-bold">Optimization Suggestion</span>
                        <p className="text-sm text-slate-400 font-serif italic">{report.nameAnalysis.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {report.phoneAnalysis ? (
                <div className="glass-panel p-8 rounded-2xl">
                  <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider font-serif mb-6 flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-500" />
                    Phone Number Vibration
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <span className="text-4xl font-serif text-emerald-400">{report.phoneAnalysis.vibration}</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed mb-4">{report.phoneAnalysis.insight}</p>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2 font-bold">Frequency Adjustment</span>
                        <p className="text-sm text-slate-400 font-serif italic">{report.phoneAnalysis.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl text-center">
                  <p className="text-zinc-500 font-serif">No phone number provided for analysis.</p>
                </div>
              )}
            </motion.div>
          )}
`;

code = code.replace(
  "{/* Tab 7: Life Alignment Sectors",
  analysisTabContent + "\n          {/* Tab 7: Life Alignment Sectors"
);


fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("ReportView additions applied");
