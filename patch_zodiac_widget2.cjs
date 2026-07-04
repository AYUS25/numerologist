const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const zodiacConstellationsSvg = `
const ZodiacConstellation = ({ sign }: { sign: string }) => {
  const constellations: Record<string, any> = {
    Aries: <path d="M10,90 L30,40 L60,30 L90,80" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Taurus: <path d="M20,20 L40,50 L70,50 L80,30 M40,50 L50,80" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Gemini: <path d="M30,20 L30,80 M70,20 L70,80 M10,10 L90,10 M10,90 L90,90" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Cancer: <path d="M30,30 A20,20 0 1,0 50,50 M70,70 A20,20 0 1,0 50,50" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Leo: <path d="M20,80 L30,30 L60,20 L80,50 L50,70" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Virgo: <path d="M20,20 L40,80 L60,20 L80,80 M60,50 L90,50" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Libra: <path d="M10,80 L90,80 M20,60 L40,20 L60,20 L80,60" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Scorpio: <path d="M20,20 L40,80 L60,20 L80,80 M80,80 L95,60" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Sagittarius: <path d="M20,80 L80,20 M60,20 L80,20 L80,40 M40,60 L60,80" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Capricorn: <path d="M20,20 L50,80 L80,20 M50,50 A15,15 0 1,0 65,65" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Aquarius: <path d="M10,30 L30,10 L50,30 L70,10 L90,30 M10,70 L30,50 L50,70 L70,50 L90,70" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    Pisces: <path d="M20,10 L20,90 M80,10 L80,90 M20,50 L80,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
  };

  const currentPath = constellations[sign] || constellations['Aries'];

  return (
    <div className="relative w-full h-24 mt-2 mb-4 bg-transparent border border-white/[0.04] rounded-xl flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <svg viewBox="0 0 100 100" className="w-full h-full text-violet-400/60 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
        {currentPath}
        <circle cx="30" cy="40" r="2" fill="#fff" className="animate-pulse" />
        <circle cx="60" cy="30" r="1.5" fill="#fff" />
        <circle cx="80" cy="50" r="2.5" fill="#fff" className="animate-pulse" />
        <circle cx="40" cy="80" r="1.5" fill="#fff" />
      </svg>
    </div>
  );
};
`;

code = code.replace(
  'export default function ReportView({ report, onReset }: ReportViewProps) {',
  zodiacConstellationsSvg + '\nexport default function ReportView({ report, onReset }: ReportViewProps) {'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Zodiac/Lunar UI correctly");
