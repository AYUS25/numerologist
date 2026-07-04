const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// I will just replace the whole section from {/* 0. Daily Widgets */} to the end of Planetary Hour.
const dailyWidgetsRegex = /\{\/\* 0\. Daily Widgets \*\/\}.*?Planetary Hour Widget \*\/\}[\s\S]*?<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/g;

// Actually, I don't know if there's an extra div. Let's find exactly what to replace.
let newSection = `      {/* 0. Daily Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Affirmation Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-500 tracking-wide text-xs uppercase font-serif">Daily Affirmation</h4>
            <p className="text-xs text-zinc-300 font-sans mt-1">
              {![1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].includes(metrics.lifePath.number) && "I embrace my unique vibrational essence."}
              {metrics.lifePath.number === 1 && "I am a bold pioneer."}
              {metrics.lifePath.number === 2 && "I radiate peace and harmony."}
              {metrics.lifePath.number === 3 && "I express my truth with joy."}
              {metrics.lifePath.number === 4 && "I build strong foundations."}
              {metrics.lifePath.number === 5 && "I embrace change and freedom."}
              {metrics.lifePath.number === 6 && "I am a vessel of healing."}
              {metrics.lifePath.number === 7 && "I seek deeper truths."}
              {metrics.lifePath.number === 8 && "I am aligned with abundance."}
              {metrics.lifePath.number === 9 && "I serve humanity."}
              {metrics.lifePath.number === 11 && "I am a conduit for divine inspiration."}
              {metrics.lifePath.number === 22 && "I manifest spiritual truths."}
              {metrics.lifePath.number === 33 && "I am a master teacher."}
            </p>
          </div>
        </div>

        {/* Lunar Influence Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-300 tracking-wide text-xs uppercase font-serif">Lunar: {getMoonPhase(new Date()).phase}</h4>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              {getMoonPhase(new Date()).suggestion}
            </p>
          </div>
        </div>

        {/* Planetary Hour Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-400 tracking-wide uppercase font-serif">Hour of {getPlanetaryHour().planet}</h4>
            <p className="text-xs text-zinc-300 font-sans mt-1">
              {getPlanetaryHour().energy}
            </p>
          </div>
        </div>
      </div>`;

// First find the section boundaries in the original file
let startIndex = code.indexOf('{/* 0. Daily Widgets */}');
let nextSectionIndex = code.indexOf('{/* 1. Header Section */}');

if (startIndex !== -1 && nextSectionIndex !== -1) {
  code = code.substring(0, startIndex) + newSection + "\n\n      " + code.substring(nextSectionIndex);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Replaced daily widgets section successfully.");
} else {
  console.log("Could not find section boundaries");
}
