const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// 1. Add Vibrate to Tabs
code = code.replace(
  /onClick=\{\(\) => setActiveTab\(tab.id as ActiveTab\)\}/g,
  "onClick={() => { if (navigator.vibrate) navigator.vibrate(50); setActiveTab(tab.id as ActiveTab); }}"
);

// 2. Add Vibrate to Chat panel toggle
code = code.replace(
  /onClick=\{\(\) => setShowChat\(!showChat\)\}/g,
  "onClick={() => { if (navigator.vibrate) navigator.vibrate(50); setShowChat(!showChat); }}"
);

// 3. New Timeline Component
const newTimelineCode = `
const LifePhaseTimeline = ({ pinnacles, challenges }: { pinnacles: PinnacleCycle[], challenges: ChallengeCycle[] }) => {
  const [activeCycle, setActiveCycle] = useState(0);
  
  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-8 scrollbar-hide snap-x">
        <div className="flex gap-4 w-max px-4">
          {pinnacles.map((p, i) => {
            const c = challenges[i];
            const isActive = activeCycle === i;
            return (
              <div 
                key={i} 
                onClick={() => { if (navigator.vibrate) navigator.vibrate(30); setActiveCycle(i); }}
                className={\`snap-center shrink-0 w-72 glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-500 \${isActive ? 'scale-105 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]' : 'scale-95 opacity-70 hover:opacity-100'}\`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-violet-400 font-bold font-sans">Cycle {i + 1}</span>
                  <span className="text-[10px] text-zinc-400 bg-white/[0.05] px-2 py-1 rounded-full">{p.ageRange}</span>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Pinnacle</div>
                    <div className="text-3xl font-serif text-[#f5f5f7] mb-2">{p.number}</div>
                    <p className="text-[10px] text-zinc-400 line-clamp-3 leading-relaxed">{p.description}</p>
                  </div>
                  
                  <div className="w-px bg-white/[0.08]"></div>
                  
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Challenge</div>
                    <div className="text-3xl font-serif text-rose-300 mb-2">{c.number}</div>
                    <p className="text-[10px] text-zinc-400 line-clamp-3 leading-relaxed">{c.description}</p>
                  </div>
                </div>
                
                {isActive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/[0.08]">
                     <p className="text-[10px] text-violet-300 leading-relaxed italic">
                       "Focus on {p.number} to overcome the shadow of {c.number}."
                     </p>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="text-center mt-4 text-xs text-zinc-500 flex items-center justify-center gap-2">
        <ArrowRight className="w-3 h-3 animate-pulse" /> Swipe to navigate timeline
      </div>
    </div>
  )
};
`;

code = code.replace(
  'export default function ReportView({ report, onReset }: ReportViewProps) {',
  newTimelineCode + '\nexport default function ReportView({ report, onReset }: ReportViewProps) {'
);

const timelineRegex = /\{\/\* Graphical Timeline \*\/\}[\s\S]*?<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;
code = code.replace(timelineRegex, '{/* Graphical Timeline */}\n<LifePhaseTimeline pinnacles={pinnacles} challenges={challenges} />');

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Timeline Component and Vibrate");
