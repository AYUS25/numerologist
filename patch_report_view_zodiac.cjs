const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';",
  "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';\nimport ZodiacConstellation from './ZodiacConstellation';\nimport LifecyclePhasesWidget from './LifecyclePhasesWidget';"
);

// Add Zodiac Constellation to Profile Header
const headerStart = '<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header">';
const headerReplacement = headerStart + `
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 hidden sm:block">
            <ZodiacConstellation dateOfBirth={input.dateOfBirth} />
          </div>
`;
code = code.replace(
  headerStart + '\n        <div>',
  headerReplacement + '\n        <div>'
);

// Add Lifecycle Phases near Pinnacles
const cyclesSection = '<div className="glass-panel p-6 rounded-2xl">';
const cyclesReplacement = `<LifecyclePhasesWidget pinnacles={report.pinnacles} challenges={report.challenges} />\n\n          <div className="glass-panel p-6 rounded-2xl mt-8">`;
code = code.replace(
  /<div className="glass-panel p-6 rounded-2xl">\s*<h3 className="font-serif text-lg text-\[\#f5f5f7\] font-light uppercase tracking-wider flex items-center gap-2">\s*<CalendarDays className="w-5 h-5 text-blue-500" \/>\s*Pinnacle Cycles\s*<\/h3>/,
  (match) => match.replace('<div className="glass-panel p-6 rounded-2xl">', cyclesReplacement)
);


fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched ReportView with Zodiac and Lifecycle");
