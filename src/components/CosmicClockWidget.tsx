import React, { useState, useEffect } from 'react';
import { Moon, Clock, Sparkles } from 'lucide-react';
import { calculateLunarPhase, calculatePlanetaryHour } from '../numerologyEngine';

export default function CosmicClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const lunarPhase = calculateLunarPhase(now);
  const planetaryHour = calculatePlanetaryHour(now);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Lunar Phase */}
      <div className="flex-1 glass-panel p-4 rounded-xl flex items-center gap-4 bg-blue-950/20 border-blue-500/20">
        <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Moon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">Lunar Phase</span>
            <span className="text-[10px] text-zinc-500 font-mono">{lunarPhase.illumination}% ILLUMINATED</span>
          </div>
          <h4 className="text-sm font-serif text-[#f5f5f7] leading-tight mt-0.5">{lunarPhase.phase}</h4>
          <p className="text-[10px] text-blue-200 mt-1 font-sans italic opacity-80 leading-snug">
            {lunarPhase.insight}
          </p>
        </div>
      </div>

      {/* Planetary Hour */}
      <div className="flex-1 glass-panel p-4 rounded-xl flex items-center gap-4 bg-amber-950/20 border-amber-500/20">
        <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Planetary Hour</span>
            <span className="text-[10px] text-zinc-500 font-mono animate-pulse">LIVE</span>
          </div>
          <h4 className="text-sm font-serif text-[#f5f5f7] leading-tight mt-0.5 flex items-center gap-2">
            {planetaryHour.planet} Hour
          </h4>
          <p className="text-[10px] text-amber-200 mt-1 font-sans italic opacity-80 leading-snug">
            {planetaryHour.energy}
          </p>
        </div>
      </div>
    </div>
  );
}
