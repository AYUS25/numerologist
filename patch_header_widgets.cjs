const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const planetaryHourCode = `
const getPlanetaryHour = () => {
  const planets = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  const energies: Record<string, string> = {
    'Sun': 'Project confidence and lead with radiant energy.',
    'Venus': 'Focus on aesthetics, relationships, and harmony.',
    'Mercury': 'Ideal for communication, logic, and rapid ideation.',
    'Moon': 'Honor your intuition and emotional nourishment.',
    'Saturn': 'A time for discipline, structure, and deep work.',
    'Jupiter': 'Embrace expansion, learning, and abundance.',
    'Mars': 'Channel dynamic action and decisive movement.'
  };
  const currentHour = new Date().getHours();
  // Simplified Chaldean order mapped roughly to hour blocks for UI demonstration purposes
  const currentPlanet = planets[currentHour % 7];
  return { planet: currentPlanet, energy: energies[currentPlanet] };
};
`;

code = code.replace(
  "const getMoonPhase = (date: Date) => {",
  planetaryHourCode + "\nconst getMoonPhase = (date: Date) => {"
);

// Replace grid-cols-2 with grid-cols-1 md:grid-cols-3
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
  '<div className="grid grid-cols-1 md:grid-cols-3 gap-4">'
);

// Insert the Planetary Hour Widget next to the Lunar Widget
const planetaryWidgetHTML = `
        {/* Planetary Hour Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-400 tracking-wide uppercase font-sans tracking-tight">Planetary Hour: {getPlanetaryHour().planet}</h4>
            <p className="text-xs text-zinc-300 font-sans mt-1">
              {getPlanetaryHour().energy}
            </p>
          </div>
        </div>
`;

code = code.replace(
  '{/* 1. Profile Header block */}',
  planetaryWidgetHTML + '\n      {/* 1. Profile Header block */}'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
