const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Add to nav items
code = code.replace(
  "{ id: 'forecast', label: 'Daily Forecast', icon: TrendingUp },",
  "{ id: 'forecast', label: 'Daily Forecast', icon: TrendingUp },\n    { id: 'sectors', label: 'Life Sectors & Cautions', icon: Compass },"
);

// Add Sectors Tab state
const stateCode = `
  const [sectorsData, setSectorsData] = useState<any>(null);
  const [isLoadingSectors, setIsLoadingSectors] = useState(false);

  useEffect(() => {
    if (activeTab === 'sectors' && !sectorsData && !isLoadingSectors) {
      const fetchSectors = async () => {
        setIsLoadingSectors(true);
        try {
          const res = await fetch('/api/numerology/life-sectors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
          });
          const data = await res.json();
          if (data.sectors) {
            setSectorsData(data.sectors);
          }
        } catch (e) {
          console.error(e);
        }
        setIsLoadingSectors(false);
      };
      fetchSectors();
    }
  }, [activeTab, sectorsData, isLoadingSectors, report]);
`;

code = code.replace(
  "// Chart data for Timeline tab",
  stateCode + "\n  // Chart data for Timeline tab"
);

// Add tab content
const sectorsTabCode = `
          {/* Tab 7: Life Sectors */}
          {activeTab === 'sectors' && (
            <motion.div
              key="tab-sectors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="p-4 bg-indigo-600/5 border-l-4 border-indigo-600 text-slate-700 rounded-sm">
                <h4 className="text-xs uppercase font-bold text-indigo-600 tracking-widest font-display mb-1">
                  100% Real-World Analysis & Cautions
                </h4>
                <p className="text-xs text-slate-500">
                  Direct, blunt readings of your numerological potentials and setbacks across all major life categories.
                </p>
              </div>

              {isLoadingSectors ? (
                 <div className="flex items-center gap-3 text-slate-500 font-mono text-xs animate-pulse py-8">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    Calculating deep sectoral alignment and generating uncensored reality checks...
                  </div>
              ) : sectorsData ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sectorsData.scores.map((score: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-full -z-10"></div>
                        <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3 flex justify-between items-center">
                          {score.category}
                          <span className="text-indigo-600 font-serif text-sm">{score.value}/100</span>
                        </h4>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                          <div className="bg-indigo-600 h-full" style={{ width: \`\${score.value}%\` }}></div>
                        </div>
                        <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                          {score.analysis}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm shadow-sm">
                    <h3 className="font-serif text-lg text-slate-900 font-light uppercase tracking-wider mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                      Critical Cautions & Avoidances
                    </h3>
                    <div className="space-y-4">
                      {sectorsData.cautions.map((caution: any, idx: number) => (
                        <div key={idx} className="border-l-2 border-rose-400 pl-4">
                          <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest font-mono mb-1">{caution.title}</h4>
                          <p className="text-[11px] text-slate-700 font-sans">{caution.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono">Unable to retrieve sectoral reading.</p>
              )}
            </motion.div>
          )}
`;

// Insert the sectors tab code right before Lexicon Drawer
code = code.replace(
  "{/* Lexicon Drawer */}",
  sectorsTabCode + "\n      {/* Lexicon Drawer */}"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Sectors Tab");
