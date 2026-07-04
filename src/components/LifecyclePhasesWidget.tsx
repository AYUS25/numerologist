import React from 'react';
import { motion } from 'motion/react';
import { PinnacleCycle, ChallengeCycle } from '../types';

interface Props {
  pinnacles: PinnacleCycle[];
  challenges: ChallengeCycle[];
}

export default function LifecyclePhasesWidget({ pinnacles, challenges }: Props) {
  // We'll map the 4 stages into 3: Youth (Phase 1), Mature (Phase 2 & 3 combined or just 2), Wisdom (Phase 4).
  // Actually, numerology traditionally has 3 major life cycles (Formative, Productive, Harvest) and 4 pinnacles/challenges.
  // The user asked for "Youth", "Mature", "Wisdom".
  
  const phases = [
    {
      title: 'Youth (Formative)',
      ageRange: pinnacles[0]?.ageRange || '0-28',
      pinnacle: pinnacles[0],
      challenge: challenges[0],
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20'
    },
    {
      title: 'Mature (Productive)',
      ageRange: pinnacles[1]?.ageRange || '29-46',
      pinnacle: pinnacles[1], // We'll just use the 2nd pinnacle as representative of mature, or combine 2 and 3
      challenge: challenges[1],
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20'
    },
    {
      title: 'Wisdom (Harvest)',
      ageRange: pinnacles[3]?.ageRange || '56+',
      pinnacle: pinnacles[3], // 4th pinnacle
      challenge: challenges[3],
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden mt-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 z-0" />
      <div className="relative z-10">
        <h3 className="font-serif text-lg text-[#f5f5f7] font-light uppercase tracking-wider flex items-center gap-2 mb-6">
          Lifecycle Phases
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className={`border ${phase.border} ${phase.bg} p-5 rounded-xl flex flex-col`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className={`text-sm uppercase font-bold tracking-wider font-serif ${phase.color}`}>
                  {phase.title}
                </h4>
                <span className="text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded">{phase.ageRange}</span>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Thematic Focus (Pinnacle)</h5>
                  <div className="flex items-start gap-2">
                    <span className={`text-xl font-serif font-bold ${phase.color}`}>{phase.pinnacle?.number}</span>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-1">{phase.pinnacle?.description}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Expected Challenge</h5>
                  <div className="flex items-start gap-2">
                    <span className={`text-xl font-serif font-bold ${phase.color}`}>{phase.challenge?.number}</span>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-1">{phase.challenge?.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
