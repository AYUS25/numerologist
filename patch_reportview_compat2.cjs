const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const regex = /\{\/\* Compatibility Results \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/motion\.div>)/;

const match = regex.exec(code);
if (match) {
  const replacement = `{/* Compatibility Results */}
                <div className="lg:col-span-7">
                  {!compatResult ? (
                    <div className="bg-white/[0.03] backdrop-blur-md border border-dashed border-[#404040] rounded-xl p-8 text-center flex flex-col items-center justify-center h-[320px]">
                      <Heart className="w-8 h-8 text-zinc-400 mb-2 animate-pulse" />
                      <p className="text-zinc-400 text-xs font-sans font-medium uppercase tracking-wider">
                        Awaiting Partner Credentials
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xs mt-1">
                        Enter your romantic, family, or business partner's birth coordinates on the left to activate the synergy engine.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {compatResult.warnings && compatResult.warnings.length > 0 && (
                         <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                           <div className="flex items-center gap-2 text-rose-400 text-xs uppercase font-bold tracking-wider font-serif">
                             <AlertTriangle className="w-4 h-4" />
                             <span>Karmic Warnings Detected</span>
                           </div>
                           <ul className="list-disc pl-5 space-y-1">
                             {compatResult.warnings.map((w: string, i: number) => (
                               <li key={i} className="text-xs text-rose-200/80 leading-relaxed font-sans">{w}</li>
                             ))}
                           </ul>
                         </div>
                      )}

                      {/* Score circle */}
                      <div className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0 relative">
                          {/* SVG Gauge */}
                          <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                            <circle cx="50%" cy="50%" r="40%" stroke="#2a2a2a" strokeWidth="8%" fill="none" />
                            <circle 
                              cx="50%" cy="50%" r="40%" 
                              stroke={compatResult.score >= 70 ? "#10b981" : compatResult.score >= 50 ? "#f59e0b" : "#ef4444"} 
                              strokeWidth="8%" 
                              fill="none"
                              strokeDasharray={\`\${2 * Math.PI * 40}%\`}
                              strokeDashoffset={\`\${(2 * Math.PI * 40) - (compatResult.score / 100) * (2 * Math.PI * 40)}%\`}
                              className="transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className={\`font-serif text-3xl font-bold relative z-10 \${compatResult.score >= 70 ? 'text-emerald-400' : compatResult.score >= 50 ? 'text-amber-400' : 'text-rose-400'}\`}>
                            {compatResult.score}%
                          </span>
                          <span className="text-[8px] font-sans font-medium text-zinc-400 uppercase absolute -bottom-2 bg-white/[0.03] backdrop-blur-md px-1 z-10 rounded">
                            SYNERGY
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase font-bold tracking-wider text-blue-500 font-serif block">
                            Cosmic Match Result
                          </span>
                          <p className="text-xs text-zinc-400 mt-1 font-sans font-medium uppercase">
                            Target: {compatResult.partnerName}
                          </p>
                          <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-sans">
                            {compatResult.overallSynergy}
                          </p>
                        </div>
                      </div>

                      {/* Category Recommendations */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { key: 'romance', label: 'Romance & Marriage', icon: <Heart className="w-4 h-4" /> },
                          { key: 'friendship', label: 'Friendship & Social', icon: <Users className="w-4 h-4" /> },
                          { key: 'business', label: 'Business & Enterprise', icon: <Briefcase className="w-4 h-4" /> }
                        ].map((cat) => {
                          const data = compatResult.recommendations[cat.key as keyof typeof compatResult.recommendations];
                          let colorClass = "text-emerald-400";
                          let bgClass = "bg-emerald-500/10 border-emerald-500/20";
                          if (data.score < 50) {
                            colorClass = "text-rose-400";
                            bgClass = "bg-rose-500/10 border-rose-500/20";
                          } else if (data.score < 70) {
                            colorClass = "text-amber-400";
                            bgClass = "bg-amber-500/10 border-amber-500/20";
                          }
                          
                          return (
                            <div key={cat.key} className={\`p-4 rounded-xl border \${bgClass} flex flex-col items-center text-center\`}>
                              <div className={\`\${colorClass} mb-2\`}>{cat.icon}</div>
                              <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider block">{cat.label}</span>
                              <span className={\`text-lg font-serif font-bold \${colorClass} my-1\`}>{data.score}%</span>
                              <span className={\`text-[9px] uppercase font-bold tracking-wider \${colorClass}\`}>{data.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detail points */}
                      <div className="space-y-4">
                        {[
                          { title: 'Life Path Integration (Sovereign Paths)', desc: compatResult.matchDetails.lifePath },
                          { title: 'Soul Urge Connection (Inner Hearts)', desc: compatResult.matchDetails.soulUrge },
                          { title: 'Expression Alignment (Active Cooperation)', desc: compatResult.matchDetails.expression },
                          { title: 'Destiny Trajectory (Long-Term Goals)', desc: compatResult.matchDetails.destiny },
                          { title: 'Karmic Friction (Lessons & Debts)', desc: compatResult.matchDetails.karmic }
                        ].map((detail, idx) => (
                          <div key={idx} className="glass-panel p-4 rounded-xl text-left relative overflow-hidden">
                            <span className="text-xs uppercase font-bold text-blue-500 font-sans block mb-1">
                              {detail.title}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{detail.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
`;
  code = code.substring(0, match.index) + replacement + code.substring(match.index + match[0].length);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log('Successfully patched ReportView!');
} else {
  console.log('Regex did not match');
}
