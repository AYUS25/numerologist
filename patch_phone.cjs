const fs = require('fs');
let code = fs.readFileSync('src/components/DynamicPhoneAnalyzer.tsx', 'utf8');

const getStatusHtml = `
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Vibrational Compatibility</span>
                {getCompatibility(vibration, lifePathNumber) >= 80 ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Very Lucky</span>
                ) : getCompatibility(vibration, lifePathNumber) >= 60 ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Neutral / Balanced</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Needs Alignment</span>
                )}
              </div>
`;

code = code.replace(
  /<span className="text-\[10px\] uppercase tracking-widest text-zinc-500 block mb-2 font-bold">Vibrational Compatibility<\/span>/,
  getStatusHtml
);

const suggestionHtml = `              {getCompatibility(vibration, lifePathNumber) < 80 ? (
                <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">Recommended Fixation</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    To make this number <strong>lucky</strong> for you, bridge the energetic gap. 
                    Save a contact in your phone named "Aura Enhancer" with a number that reduces to <strong>{lifePathNumber > (vibration%9||9) ? lifePathNumber - (vibration%9||9) : lifePathNumber + 9 - (vibration%9||9)}</strong>. 
                    Alternatively, use a phone case in {lifePathNumber % 2 === 0 ? 'cool tones (blue, silver, white)' : 'warm tones (red, gold, orange)'} to harmonize the frequency.
                  </p>
                </div>
              ) : (
                <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">Natural Alignment</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    This number is naturally <strong>lucky</strong> for your Life Path. No special fixations are required.
                  </p>
                </div>
              )}`;

code = code.replace(
  /\{getCompatibility\(vibration, lifePathNumber\) < 80 && \([\s\S]*?\}<\/p>\n              \)\}/,
  suggestionHtml
);

fs.writeFileSync('src/components/DynamicPhoneAnalyzer.tsx', code);
