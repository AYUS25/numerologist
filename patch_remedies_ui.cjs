const fs = require('fs');
let content = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const targetStr = "{/* Crystal Resonance Matrix */}";
const newContent = `
                {/* Current Phase Prescriptions */}
                {safeReport.remedies && safeReport.remedies.length > 0 && (
                  <div className="mt-10 mb-10">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2 font-serif flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      Active Life Phase Remedial Prescriptions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeReport.remedies.map((remedy: any, idx: number) => (
                        <div key={idx} className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl">
                          <h5 className="font-serif text-[11px] uppercase tracking-wider text-emerald-400 mb-2">{remedy.category}</h5>
                          <p className="text-zinc-300 text-xs leading-relaxed font-sans">{remedy.advice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crystal Resonance Matrix */}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newContent);
    fs.writeFileSync('src/components/ReportView.tsx', content, 'utf8');
    console.log("Added Phase Prescriptions to UI");
} else {
    console.log("Could not find target string");
}
