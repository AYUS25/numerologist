import { playTactileClick, playHoverTick } from '../audio';
import React from 'react';
import { Sun, Sparkles } from 'lucide-react';

const AFFIRMATIONS: Record<number, string> = {
  1: "Today, I embrace new beginnings with courage and lead with my authentic vision.",
  2: "I cultivate peace and harmony, trusting that patience brings my desires to fruition.",
  3: "I express my joy creatively and communicate my inner truth with radiant enthusiasm.",
  4: "I build my foundation with discipline and focus, honoring the process of steady growth.",
  5: "I welcome change and adventure, adapting easily to the cosmic flow of new experiences.",
  6: "I nurture myself and others with love, taking responsibility for the harmony in my life.",
  7: "I seek inner wisdom and trust my intuition, finding answers in quiet contemplation.",
  8: "I step into my personal power, manifesting abundance through confident action.",
  9: "I release what no longer serves me, embracing completion and universal compassion.",
  11: "I channel higher inspiration, trusting my intuition to illuminate the path for others.",
  22: "I ground my grand visions into reality, building lasting structures for the greater good.",
  33: "I radiate healing energy, serving humanity through unconditional love and compassion."
};

export default function DailyAffirmation({ personalYear, personalDay }: { personalYear: number, personalDay: number }) {
  // Use a combination to select one or just use personalDay
  const affirmation = AFFIRMATIONS[personalDay] || AFFIRMATIONS[personalYear] || "I am aligned with the cosmic energy of the universe.";

  return (
    <div className="bg-gradient-to-br from-gold-accent/10 to-transparent border-l-4 border-gold-accent p-6 rounded-sm relative overflow-hidden mb-8 print:hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-12 h-12 bg-gold-dark/20 rounded-full flex items-center justify-center shrink-0 border border-gold-accent/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Sun className="w-6 h-6 text-gold-accent" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-[10px] uppercase font-bold text-gold-accent tracking-[0.2em] font-display flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-gold-accent" />
            Daily Numerological Affirmation
          </h3>
          <p className="text-sm md:text-base font-serif text-slate-200 italic leading-relaxed">
            "{affirmation}"
          </p>
          <div className="mt-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            Aligned with your Personal Day Vibration ({personalDay})
          </div>
        </div>
      </div>
    </div>
  );
}
