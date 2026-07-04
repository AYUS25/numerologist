const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const newComponents = `
const EnergyMonitor = ({ score }: { score: number }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-2xl group cursor-pointer overflow-hidden min-h-[220px]">
      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mb-2">Cycle Energy Monitor</h4>
      <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors rounded-2xl"></div>
      
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="url(#energyGradient)" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ top: 'calc(50% + 10px)' }}>
        <span className="text-3xl font-serif text-[#f5f5f7]">{score}</span>
        <span className="text-[8px] uppercase tracking-widest text-zinc-400">Intensity</span>
      </div>
      
      <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 w-full px-2">
         <p className="text-[10px] text-violet-300">
           {score > 80 ? 'High energetic potential. Take bold actions.' : score > 50 ? 'Balanced flow. Maintain steady progress.' : 'Low resistance. Focus on inner reflection.'}
         </p>
      </div>
    </div>
  );
};

const AstrologicalAspectMap = ({ metrics }: { metrics: NumerologyMetrics }) => {
  const points = [];
  for (let i = 0; i < 9; i++) {
    const angle = (i * 40 - 90) * (Math.PI / 180);
    points.push({ x: 50 + 35 * Math.cos(angle), y: 50 + 35 * Math.sin(angle), num: i + 1 });
  }

  const getBaseNum = (n: number) => n > 9 && n !== 11 && n !== 22 && n !== 33 ? n % 9 || 9 : (n === 11 ? 2 : (n === 22 ? 4 : (n === 33 ? 6 : n)));
  const coreNums = [getBaseNum(metrics.lifePath.number), getBaseNum(metrics.expression.number), getBaseNum(metrics.soulUrge.number)];
  
  const polyPoints = coreNums.map(n => {
    const p = points[(n > 9 ? n%9||9 : n) - 1] || points[0];
    return \`\${p.x},\${p.y}\`;
  }).join(' ');

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col items-center">
      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mb-3">Vibrational Geometry</h4>
      <svg viewBox="0 0 100 100" className="w-full h-32 max-w-[128px]">
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        {points.map(p => {
           const isActive = coreNums.includes(p.num);
           return (
            <g key={p.num}>
              <circle cx={p.x} cy={p.y} r={isActive ? "3" : "1.5"} fill={isActive ? "#a855f7" : "rgba(255,255,255,0.1)"} />
              <text x={p.x} y={p.y + 0.5} fontSize="3.5" fill={isActive ? "#fff" : "rgba(255,255,255,0.3)"} textAnchor="middle" alignmentBaseline="middle" fontWeight={isActive ? "bold" : "normal"}>
                {p.num}
              </text>
            </g>
           );
        })}
        <polygon points={polyPoints} fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" strokeWidth="0.75" className="animate-pulse" />
      </svg>
      <p className="text-[9px] text-zinc-500 mt-3 text-center leading-tight"> Sacred geometry linking Life Path, Expression, & Soul Urge. </p>
    </div>
  );
};
`;

code = code.replace(
  'export default function ReportView({ report, onReset }: ReportViewProps) {',
  newComponents + '\nexport default function ReportView({ report, onReset }: ReportViewProps) {'
);

// Insert Aspect Map into Astrological Blueprint section
code = code.replace(
  '{report.planetaryHour && (',
  '<AstrologicalAspectMap metrics={metrics} />\n                    {report.planetaryHour && ('
);

// Insert Energy Monitor into Forecast tab
const forecastRegex = /{activeTab === 'forecast' && \([\s\S]*?<div className="space-y-4">/;
// Let's find exactly where to inject the EnergyMonitor in the forecast tab
code = code.replace(
  /<div className="space-y-4">\s*\{!\(report as any\)\.dailyHoroscope \?/,
  '<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><div className="col-span-1 md:col-span-2"><div className="space-y-4">\n                    {!(report as any).dailyHoroscope ?'
);
// And close the grid
code = code.replace(
  /<\/div>\s*<\/div>\s*<\/motion.div>\s*\)\}\s*\{\/\* Tab 7: Life Sectors/,
  '</div></div></div>\n                    <div className="col-span-1"><EnergyMonitor score={Math.floor(Math.random() * 40) + 40 + (metrics.personalYear.number * 2)} /></div>\n                  </div>\n                </div>\n              </motion.div>\n            )}\n          {/* Tab 7: Life Sectors'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched additional components");
