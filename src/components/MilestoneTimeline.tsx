import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Target, Compass, ChevronRight, Map, HelpCircle, BookOpen } from 'lucide-react';
import { playHoverTick, playTactileClick } from '../audio';
import { PinnacleCycle, ChallengeCycle } from '../types';

interface MilestoneTimelineProps {
  pinnacles: PinnacleCycle[];
  challenges: ChallengeCycle[];
  openGlossary: (term: string) => void;
}

export default function MilestoneTimeline({ pinnacles, challenges, openGlossary }: MilestoneTimelineProps) {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the container to show the active milestone card
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`#milestone-card-${activeMilestone}`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeMilestone]);

  const milestones = pinnacles.map((p, idx) => {
    const c = challenges[idx];
    const range = p.ageRange;
    
    // Custom premium titles based on stages
    const stageTitles = [
      "Era of Foundation",
      "Era of Emergence",
      "Era of Transmutation",
      "Era of Harvest & Mastery"
    ];

    const themes = [
      "Establishing identity, overcoming environmental limits, and building the spiritual launchpad.",
      "Developing professional alignment, testing your personal freedom, and cultivating relational depth.",
      "Stepping into authoritative leadership, expressing authentic creativity, and healing past lineages.",
      "Achieving self-actualization, sharing accumulated wisdom, and transcending earthly attachment."
    ];

    return {
      stage: p.stage,
      ageRange: range,
      title: stageTitles[idx] || `Cycle Phase ${p.stage}`,
      theme: themes[idx] || "Developmental alignment phase.",
      pinnacleNumber: p.number,
      pinnacleDesc: p.description,
      challengeNumber: c.number,
      challengeDesc: c.description
    };
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden text-left mb-10 border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 border-b border-white/[0.06] pb-5">
        <div>
          <h3 className="font-serif text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-400" />
            <span>Interactive Destiny Milestones</span>
          </h3>
          <p className="text-sm font-serif font-light text-[#f5f5f7] mt-1 tracking-wide">
            Horizontal Mapping of Your Life Cycles & Major Age Transmissions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openGlossary('Pinnacles')}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-blue-400 font-sans border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-full transition-all hover:bg-blue-500/10 hover:border-blue-500/20 cursor-pointer"
          >
            <BookOpen className="w-3 h-3" /> Glossary
          </button>
        </div>
      </div>

      {/* HORIZONTAL TIMELINE STEPPER/INDICATOR TRACK */}
      <div className="relative w-full mb-10 overflow-hidden px-4">
        {/* Continuous track line */}
        <div className="absolute top-[26px] left-8 right-8 h-[2px] bg-white/[0.06] z-0"></div>
        {/* Active colored filling track line */}
        <div 
          className="absolute top-[26px] left-8 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-500 z-0 transition-all duration-500 ease-out"
          style={{ width: `${(activeMilestone / (milestones.length - 1)) * 80 + 5}%` }}
        ></div>

        {/* Milestone Nodes */}
        <div className="flex justify-between items-center relative z-10">
          {milestones.map((milestone, idx) => {
            const isActive = activeMilestone === idx;
            return (
              <button
                key={idx}
                onMouseEnter={() => playHoverTick()}
                onClick={() => { playTactileClick(); setActiveMilestone(idx); }}
                className="flex flex-col items-center group focus:outline-none cursor-pointer"
              >
                {/* Node bubble */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    backgroundColor: isActive ? 'rgb(59, 130, 246)' : 'rgba(24, 24, 27, 0.9)',
                    borderColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center font-serif text-sm relative shadow-xl ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-500'
                  }`}
                >
                  {/* Subtle pulsing outer ring for active node */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-60"></span>
                  )}
                  {milestone.stage}
                </motion.div>

                {/* Age label under node */}
                <span className={`text-[10px] font-sans font-medium uppercase mt-2.5 transition-all ${
                  isActive ? 'text-blue-400 font-bold tracking-wider' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}>
                  Ages {milestone.ageRange}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HORIZONTALLY SCROLLING CARDS CONTAINER */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x snap-mandatory flex gap-6 scroll-smooth"
      >
        {milestones.map((milestone, idx) => {
          const isActive = activeMilestone === idx;
          return (
            <motion.div
              id={`milestone-card-${idx}`}
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ 
                opacity: isActive ? 1 : 0.4, 
                scale: isActive ? 1 : 0.96,
                y: isActive ? 0 : 4
              }}
              whileHover={isActive ? { 
                scale: 1.01,
                rotateX: 1,
                rotateY: -1,
                boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.15)",
                borderColor: "rgba(59, 130, 246, 0.3)"
              } : {}}
              onClick={() => {
                if (!isActive) {
                  playTactileClick();
                  setActiveMilestone(idx);
                }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className={`snap-center shrink-0 w-full md:w-[620px] rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isActive 
                  ? 'bg-white/[0.03] backdrop-blur-xl border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.06)]' 
                  : 'bg-black/40 border-white/[0.04] opacity-50 hover:opacity-80'
              }`}
            >
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-bl-full pointer-events-none"></div>
              
              {/* Header inside Card */}
              <div className="flex justify-between items-start gap-4 mb-5 border-b border-white/[0.05] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 uppercase">
                      Era {milestone.stage}
                    </span>
                    <span className="text-xs text-zinc-400 font-sans">
                      Ages {milestone.ageRange}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-light text-[#f5f5f7] mt-1.5">
                    {milestone.title}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans">Active Vibrations</span>
                  <div className="flex gap-2.5 mt-1 items-center justify-end">
                    <div className="text-center">
                      <div className="text-xs font-mono text-zinc-400">P{milestone.stage}</div>
                      <div className="text-xl font-serif text-blue-400">{milestone.pinnacleNumber}</div>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-xs font-mono text-zinc-400">C{milestone.stage}</div>
                      <div className="text-xl font-serif text-rose-400">{milestone.challengeNumber}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core theme paragraph */}
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6 italic">
                "{milestone.theme}"
              </p>

              {/* Detailed Pinnacle vs Challenge Splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Pinnacle Split */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-blue-500/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-blue-400 font-bold font-sans mb-2">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>Opportunity Frequency ({milestone.pinnacleNumber})</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {milestone.pinnacleDesc}
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-zinc-500 font-sans font-medium uppercase tracking-wide">
                    Harnessing Pinnacle {milestone.pinnacleNumber} Energy
                  </div>
                </div>

                {/* Challenge Split */}
                <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-rose-500/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-rose-400 font-bold font-sans mb-2">
                      <Target className="w-3 h-3 text-rose-400" />
                      <span>Spiritual Hurdle ({milestone.challengeNumber})</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {milestone.challengeDesc}
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-zinc-500 font-sans font-medium uppercase tracking-wide">
                    Overcoming Challenge {milestone.challengeNumber}
                  </div>
                </div>
              </div>

              {/* Direct alignment insight message */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between gap-3 text-[11px] font-sans">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-500/60" />
                  <span>Era {milestone.stage} integration advice</span>
                </span>
                <span className="text-blue-400 font-serif italic text-right">
                  "Focus on the {milestone.pinnacleNumber} current to naturally neutralize the {milestone.challengeNumber} shadow."
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline Controls Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 relative z-10 px-1">
        <div className="flex gap-1.5">
          {milestones.map((_, i) => (
            <button
              key={i}
              onClick={() => { playTactileClick(); setActiveMilestone(i); }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                activeMilestone === i ? 'bg-blue-500 w-4' : 'bg-white/10 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 select-none">
          <span className="animate-pulse flex items-center gap-1">
            <span>Swipe or click era to slide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
