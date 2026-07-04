const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import DailyAffirmation")) {
  code = code.replace(
    "import ChatBot from './components/ChatBot';",
    "import ChatBot from './components/ChatBot';\nimport DailyAffirmation from './components/DailyAffirmation';"
  );
}

const transitAndAffirmation = `
              {/* Daily Affirmation & Celestial Transit */}
              <div className="lg:col-span-12 space-y-6">
                <DailyAffirmation 
                  personalYear={report.metrics.personalYear.number} 
                  personalDay={report.metrics.personalDay.number} 
                />
                
                <div className="bg-indigo-950/20 border border-indigo-900/50 p-6 rounded-sm relative overflow-hidden text-left flex flex-col md:flex-row gap-6 items-center print:hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex-1">
                     <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-display mb-2 flex items-center gap-2">
                       <Moon className="w-4 h-4 text-indigo-400" />
                       Daily Celestial Transit
                     </h3>
                     {isTransitLoading ? (
                       <div className="text-sm text-indigo-300/60 font-sans animate-pulse">Consulting the oracles for today's planetary and numerological alignment...</div>
                     ) : (
                       <p className="text-sm text-indigo-200/90 font-sans leading-relaxed">
                         {dailyTransit || "The cosmos are quietly integrating your energies today."}
                       </p>
                     )}
                  </div>
                </div>
              </div>
`;

// Insert it right after <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="dashboard-root">
code = code.replace(
  'id="dashboard-root"\n            >',
  'id="dashboard-root"\n            >' + transitAndAffirmation
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with Transit & Affirmation");
