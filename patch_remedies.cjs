const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Remove the new one we just added at the bottom
const removeRegex = /\{\/\* Tab: Remedies & Guidance \*\/\}[\s\S]*?\{\/\* Tab 7: Life Sectors/;
code = code.replace(removeRegex, '{/* Tab 7: Life Sectors');

// Replace the old Remedies tab
const oldRemediesRegex = /\{\/\* Tab Remedies: Spiritual Remedies \*\/\}[\s\S]*?\{\/\* Tab 5: Signature Optimizer \*\/\}/;

const newRemediesTab = `{/* Tab Remedies: Remedies & Guidance */}
          {activeTab === 'remedies' && (
            <motion.div
              key="tab-remedies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-l-4 border-blue-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-sans tracking-tight text-2xl font-light text-white mb-2 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-blue-500" />
                  Remedies & Real-World Guidance
                </h3>
                <p className="text-zinc-400 text-sm font-sans mb-6">
                  Based on the friction points in your numerological blueprint, these are concrete lifestyle adjustments and energetic remedies designed to mitigate negative karmic loops and align you with your highest potential.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.remedies && report.remedies.map((remedy: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-white/[0.08]"
                  >
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 font-sans">
                      {remedy.category}
                    </h4>
                    <p className="text-[13px] text-zinc-300 font-sans leading-relaxed">
                      {remedy.advice}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="glass-panel p-6 rounded-2xl border border-red-900/30 bg-red-950/10">
                 <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 font-sans flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Periods of Caution (Vulnerable Timelines)
                 </h4>
                 <p className="text-[13px] text-zinc-300 font-sans leading-relaxed">
                    Based on your Pinnacle and Challenge cycles, you must exercise extreme caution during Personal Year {metrics.personalYear.number === 9 ? '9 (Endings & Lethargy)' : metrics.personalYear.number === 4 ? '4 (Friction & Heavy Burdens)' : metrics.personalYear.number === 7 ? '7 (Isolation & Mental Crisis)' : metrics.personalYear.number + ' (Transitional)'}. During these periods, avoid impulsive financial risks, toxic partnerships, and drastic career shifts. Stick to foundational routines and spiritual grounding.
                 </p>
              </div>
            </motion.div>
          )}

          {/* Tab 5: Signature Optimizer */}`;

code = code.replace(oldRemediesRegex, newRemediesTab);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Remedies");
