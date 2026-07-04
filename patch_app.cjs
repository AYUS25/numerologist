const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { NumerologyInput, NumerologyReport, ChatMessage } from './types';",
  "import { NumerologyInput, NumerologyReport, ChatMessage } from './types';\nimport { Download, Upload, Printer } from 'lucide-react';"
);

// 2. Add functions
const functionsToAdd = `
  const handleExportJSON = () => {
    if (!report) return;
    const data = {
      input: report.input,
      chatHistory,
      chatSessions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`numerology_profile_\${report.input.fullName.replace(/\\s+/g, '_')}.json\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.input && data.input.fullName && data.input.dateOfBirth) {
           const rep = generateNumerologyReport(data.input.fullName, data.input.dateOfBirth, data.input.timeOfBirth, data.input.placeOfBirth);
           setReport(rep);
           localStorage.setItem('numerology_input', JSON.stringify(data.input));
           if (data.chatHistory) {
             setChatHistory(data.chatHistory);
             localStorage.setItem('numerology_chat', JSON.stringify(data.chatHistory));
           }
           if (data.chatSessions) {
             setChatSessions(data.chatSessions);
             localStorage.setItem('numerology_sessions', JSON.stringify(data.chatSessions));
           }
        } else {
          setSystemError('Invalid profile JSON format.');
        }
      } catch (err) {
        setSystemError('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // reset input
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const [dailyTransit, setDailyTransit] = useState('');
  const [isTransitLoading, setIsTransitLoading] = useState(false);

  useEffect(() => {
    if (report && !dailyTransit && !isTransitLoading) {
      setIsTransitLoading(true);
      fetch('/api/numerology/daily-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      }).then(res => res.json()).then(data => {
        if (data.forecast) setDailyTransit(data.forecast);
      }).catch(console.error)
      .finally(() => setIsTransitLoading(false));
    }
  }, [report, dailyTransit, isTransitLoading]);
`;

code = code.replace("  // 1. Load cached numerology profiles on startup", functionsToAdd + "\n  // 1. Load cached numerology profiles on startup");

// 3. Add to Header
const headerReplacement = `
          <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-tighter text-slate-400">
            {report && (
              <>
                <button onClick={handlePrintPDF} className="hover:text-gold-accent transition-colors flex items-center gap-1" title="Print to PDF">
                  <Printer className="w-3 h-3" /> <span className="hidden sm:inline">Print Report</span>
                </button>
                <button onClick={handleExportJSON} className="hover:text-gold-accent transition-colors flex items-center gap-1" title="Export Profile">
                  <Download className="w-3 h-3" /> <span className="hidden sm:inline">Export JSON</span>
                </button>
              </>
            )}
            <label className="cursor-pointer hover:text-gold-accent transition-colors flex items-center gap-1" title="Import Profile">
              <Upload className="w-3 h-3" /> <span className="hidden sm:inline">Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
            <div className="flex items-center gap-1 ml-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="hidden sm:inline">Core-9 Engine Active</span>
            </div>
          </div>
`;

code = code.replace(
  /<div className="flex items-center gap-3">[\s\S]*?<span className="text-\[10px\] uppercase font-mono tracking-tighter text-slate-400">Core-9 Engine Active<\/span>\s*<\/div>/,
  headerReplacement
);

// 4. Add transit to dashboard
const transitBlock = `
              {/* Daily Celestial Transit */}
              {report && (
                <div className="col-span-1 lg:col-span-12 print:hidden mb-0">
                  <div className="bg-indigo-950/20 border border-indigo-900/50 p-6 rounded-sm relative overflow-hidden text-left flex flex-col md:flex-row gap-6 items-center">
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
              )}
`;

code = code.replace(
  /{ \/\* Left Side: Detailed report components \(8 columns\) \*\/ }/g,
  transitBlock + "\n              {/* Left Side: Detailed report components (8 columns) */}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
