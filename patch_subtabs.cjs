const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Add state
code = code.replace(
  "const [activeTab, setActiveTab] = useState<ActiveTab>('profile');",
  "const [activeTab, setActiveTab] = useState<ActiveTab>('profile');\n  const [activeSector, setActiveSector] = useState<string>('Career & Ambition');"
);

// Update tab rendering
const oldTabRegex = /\{\/\* Tab 7: Life Sectors \(Deterministic & Instant\) \*\/\}[\s\S]*?\{\/\* Lexicon Drawer \*\/\}/m;

const newTabCode = `{/* Tab 7: Life Sectors (Deterministic & Instant) */}
          {activeTab === 'sectors' && report.lifePredictions && (
            <motion.div
              key="tab-sectors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="p-5 bg-indigo-900/10 border-l-4 border-indigo-500 rounded-sm backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-display mb-1 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Life Predictions & Real-World Realities
                </h4>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-2 max-w-3xl">
                  A deeply analytical breakdown of your potentials and setbacks across major life categories. 
                  Scores are calculated via Pythagorean cross-referencing of your Life Path, Expression, and Soul Urge vibrations. 
                  Warning: These analyses do not sugarcoat your karmic tendencies.
                </p>
              </div>

              {/* Sub-navigation for sectors */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                {report.lifePredictions.map((sector: any) => (
                  <button
                    key={sector.category}
                    onClick={() => setActiveSector(sector.category)}
                    className={\`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors \${
                      activeSector === sector.category 
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                    }\`}
                  >
                    {sector.category}
                  </button>
                ))}
              </div>

              {/* Display active sector */}
              <AnimatePresence mode="wait">
                {report.lifePredictions.filter((s: any) => s.category === activeSector).map((sector: any, idx: number) => (
                  <motion.div 
                    key={sector.category}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-sm relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
                    
                    <h4 className="text-xl font-bold text-slate-200 uppercase tracking-widest mb-6 flex justify-between items-center font-display">
                      {sector.category}
                      <div className="flex flex-col items-end">
                        <span className="text-indigo-400 font-serif text-3xl">{sector.score}<span className="text-[12px] text-slate-400 font-sans ml-1">/100</span></span>
                        <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-1">Alignment Score</span>
                      </div>
                    </h4>
                    
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: \`\${sector.score}%\` }}
                        transition={{ delay: 0.2, duration: 1.5, type: 'spring' }}
                        className="bg-gradient-to-r from-indigo-800 via-indigo-500 to-indigo-400 h-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-black/20 p-6 rounded-sm border border-white/5">
                        <h5 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Native Potentials
                        </h5>
                        <p className="text-[13px] text-slate-300 font-sans leading-relaxed">
                          {sector.potential}
                        </p>
                      </div>
                      
                      <div className="bg-rose-950/10 p-6 rounded-sm border border-rose-900/20">
                        <h5 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Setbacks & Karmic Cautions
                        </h5>
                        <p className="text-[13px] text-slate-300 font-sans leading-relaxed">
                          {sector.setbacks}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
      {/* Lexicon Drawer */}`;

code = code.replace(oldTabRegex, newTabCode);
fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Subtabs for Sectors");
