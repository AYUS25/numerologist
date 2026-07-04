import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Calendar, Sparkles, ChevronRight, Compass, AlertCircle, Info, Star, HelpCircle, Flame } from 'lucide-react';
import { playHoverTick, playTactileClick, playMechanicalDial } from '../audio';
import { PinnacleCycle, ChallengeCycle, NumerologyInput } from '../types';
import { reduceNumber } from '../numerologyEngine';

interface LifeCycleMapProps {
  pinnacles: PinnacleCycle[];
  challenges: ChallengeCycle[];
  input: NumerologyInput;
  openGlossary?: (term: string) => void;
}

const PERSONAL_YEAR_DETAILS: Record<number, { title: string; subtitle: string; energy: string; description: string; advice: string }> = {
  1: {
    title: "Seed of Intention",
    subtitle: "New Beginnings, Independence & Direct Action",
    energy: "Initiating, Pioneer Current",
    description: "A major epochal reset. The cosmic slate is wiped clean, and a new 9-year cycle begins. You are filled with independent vigor, original impulses, and the courage to start anew. Projects launched now carry the momentum of the entire cycle.",
    advice: "Do not wait for others' permission. Take direct, solo action, initiate key connections, and plant bold new seeds."
  },
  2: {
    title: "The Silent Root",
    subtitle: "Patience, Cooperation & Relational Attunement",
    energy: "Cooperating, Diplomatic Current",
    description: "A year of slow, organic growth. The seeds planted last year are developing underground. It requires intense patience, cooperation, and working behind the scenes. Your intuitive sensitivity and relationship dynamics are heavily highlighted.",
    advice: "Cultivate receptivity and balance. Meditate, listen deeply, resolve lingering discords, and avoid forcing immediate outcomes."
  },
  3: {
    title: "The Creative Bloom",
    subtitle: "Self-Expression, Joy & Creative Expansion",
    energy: "Expressive, Joyous Current",
    description: "A beautiful, highly social period of self-expression. Your creative currents run deep, and your voice carries weight. It is an excellent year for writing, performative arts, traveling, and expanding your social circle.",
    advice: "Release all self-censorship. Share your truth through art, speaking, or writing. Embrace joy and seek inspiring company."
  },
  4: {
    title: "The Strong Foundation",
    subtitle: "Structure, Discipline, Focus & Hard Work",
    energy: "Structuring, Archival Current",
    description: "The year of organization and building. It is time to roll up your sleeves and solidify your goals. While it requires discipline and can feel restrictive, the systems and foundations you construct now will support you for decades.",
    advice: "Focus on routine, financial planning, and systematic labor. Keep your commitments solid and do not cut corners."
  },
  5: {
    title: "The Wind of Freedom",
    subtitle: "Dynamic Change, Travel & Transformational Shifts",
    energy: "Adaptive, Catalyst Current",
    description: "The midpoint pivot of the cycle. A fast-paced, unpredictable year of high adventure, personal shifts, and newfound freedom. Old restrictions break away, inviting travel, lifestyle changes, and new avenues of exploration.",
    advice: "Stay highly flexible and adaptive. Say yes to new experiences, but avoid scattered focus or impulsive commitments."
  },
  6: {
    title: "The Healing Hearth",
    subtitle: "Domestic Harmony, Sacred Duty & Community Care",
    energy: "Nurturing, Harmonic Current",
    description: "A year centered on home, family, service, and duty. You are called to act as a counselor, healer, and provider of harmony. Relationship bonds are tested and strengthened, and domestic improvements are highly favored.",
    advice: "Take responsibility with a light, warm heart. Beautify your physical sanctuary, heal old family wounds, and offer service."
  },
  7: {
    title: "The Sacred Temple",
    subtitle: "Solitude, Meditation, Research & Inner Wisdom",
    energy: "Introspective, Mystic Current",
    description: "A deeply spiritual, introspective phase. The focus shifts entirely from material ambition to internal truth. You are urged to rest, study, reflect, and seek wisdom. Trying to force material progress now often leads to frustration.",
    advice: "Engage in serious research, meditation, or therapy. Spend time in nature, read deep texts, and seek to know your true soul."
  },
  8: {
    title: "The Sovereign Harvest",
    subtitle: "Material Power, Leadership, Finances & Manifestation",
    energy: "Authoritative, Executive Current",
    description: "The peak harvest year. After the spiritual retreat of Year 7, you step back into the material matrix with supreme authority. A highly dynamic, action-oriented period where past hard work converts into financial reward and career advancement.",
    advice: "Manage your assets with high integrity. Exercise decisive leadership, make strategic investments, and step into your power."
  },
  9: {
    title: "The Absolute Soil",
    subtitle: "Completion, Release, Humanitarian Cleanup & Transition",
    energy: "Releasing, Sage Current",
    description: "The final year of the 9-year cycle. A time for dramatic inventory, release, and closure. You are clearing out the cosmic attic. Let go of outdated relationships, habits, and jobs, preparing your life path for a brand new cycle next year.",
    advice: "Forgive, let go, and complete unfinished business. Engage in selfless, humanitarian pursuits and prepare for the next dawn."
  }
};

const DYNAMIC_REMEDIES: Record<number, string> = {
  1: "Wear gold or rubies to align with the Sun's initiatory current. Keep a fresh quartz on your desk to clear mental static.",
  2: "Wear silver or pearls to anchor the Moon's gentle, cooperative flow. Meditate near moving water or a fountain.",
  3: "Integrate yellow or topaz in your attire. Write daily in a journal to give voice to your active, creative currents.",
  4: "Incorporate deep blues, grays, or raw wood in your sanctuary. Walk barefoot on grass (earthing) to stabilize your core.",
  5: "Carry a turquoise stone. Use lavender essential oils to soothe the hyper-active mental currents of this transition.",
  6: "Fill your living space with fresh flowers or green plants. Dedicate a small altar to familial peace and mutual care.",
  7: "Carry amethyst. Spend 15 minutes in silent, tech-free contemplation at dawn to capture mystical frequencies.",
  8: "Maintain impeccable spinal posture. Keep a small piece of pyrite or obsidian on your workstation for sovereign focus.",
  9: "Donate old clothes and clear physical clutter. Burn sage or sandalwood to cleanse the spatial and energetic field."
};

export default function LifeCycleMap({ pinnacles, challenges, input, openGlossary }: LifeCycleMapProps) {
  const [selectedAge, setSelectedAge] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Extract birth details safely
  const birthDate = new Date(input.dateOfBirth);
  const birthYear = isNaN(birthDate.getTime()) ? 1990 : birthDate.getFullYear();
  const birthMonth = isNaN(birthDate.getTime()) ? 1 : birthDate.getMonth() + 1;
  const birthDay = isNaN(birthDate.getTime()) ? 1 : birthDate.getDate();

  // Find boundaries
  let firstEnd = 27;
  let secondEnd = 36;
  let thirdEnd = 45;

  if (pinnacles[0]) {
    const match = pinnacles[0].ageRange.match(/\d+/);
    if (match) firstEnd = parseInt(match[0], 10);
  }
  if (pinnacles[1]) {
    const match = pinnacles[1].ageRange.match(/Age \d+ to Age (\d+)/);
    if (match) secondEnd = parseInt(match[1], 10);
  }
  if (pinnacles[2]) {
    const match = pinnacles[2].ageRange.match(/Age \d+ to Age (\d+)/);
    if (match) thirdEnd = parseInt(match[1], 10);
  }

  // Calculate current age of the user
  const currentYear = new Date().getFullYear();
  const userCurrentAge = Math.max(0, currentYear - birthYear);

  // Sync initial selected age to user's actual current age
  useEffect(() => {
    if (userCurrentAge >= 0 && userCurrentAge <= 99) {
      setSelectedAge(userCurrentAge);
    }
  }, [userCurrentAge]);

  const getStageForAge = (age: number) => {
    if (age <= firstEnd) return 0;
    if (age <= secondEnd) return 1;
    if (age <= thirdEnd) return 2;
    return 3;
  };

  const getStageName = (idx: number) => {
    const stages = ["First Cycle (Youth)", "Second Cycle (Emergence)", "Third Cycle (Transmutation)", "Fourth Cycle (Sovereignty)"];
    return stages[idx] || `Cycle ${idx + 1}`;
  };

  const activeStageIdx = getStageForAge(selectedAge);
  const targetCalendarYear = birthYear + selectedAge;

  // Calculate Personal Year for the selected target year
  const targetYearReduced = reduceNumber(
    targetCalendarYear.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0),
    false
  );
  const personalYearRaw = birthMonth + birthDay + targetYearReduced;
  const personalYearVal = reduceNumber(personalYearRaw, false);

  const activePinnacle = pinnacles[activeStageIdx];
  const activeChallenge = challenges[activeStageIdx];
  const pyDetails = PERSONAL_YEAR_DETAILS[personalYearVal] || PERSONAL_YEAR_DETAILS[1];

  // Synthesize interaction between Personal Year and active Pinnacle
  const getSynthesis = (py: number, pin: number) => {
    if (py === pin) {
      return `Vibrational Resonance! Both your Personal Year and overarching Pinnacle are operating on Vibe ${py}. This amplifies the theme of ${pyDetails.title} tenfold. Events will occur rapidly and carry profound developmental significance.`;
    }
    if ((py + pin) % 2 === 0) {
      return `Harmonic alignment. The current of your Personal Year (${py}) flows in perfect rhythm with your overarching Pinnacle (${pin}). This facilitates cooperative efforts, smooth professional transitions, and solidifies your internal sense of alignment.`;
    }
    return `Dynamic alchemy. Your Personal Year of ${py} (${pyDetails.title}) challenges you to integrate its fresh lessons into the stable background field of your Pinnacle ${pin}. This creates a creative tension that forces deep growth and self-discovery.`;
  };

  const handleAgeChange = (val: number) => {
    if (val !== selectedAge) {
      playHoverTick();
      setSelectedAge(val);
    }
  };

  const incrementAge = () => {
    if (selectedAge < 99) {
      playTactileClick();
      setSelectedAge(prev => prev + 1);
    }
  };

  const decrementAge = () => {
    if (selectedAge > 0) {
      playTactileClick();
      setSelectedAge(prev => prev - 1);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden text-left mb-10 border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent" id="life-cycle-map-container">
      {/* Visual background lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-accent/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 border-b border-white/[0.06] pb-5">
        <div>
          <h3 className="font-serif text-xs uppercase font-bold text-gold-accent tracking-widest flex items-center gap-2">
            <Map className="w-4 h-4 text-gold-accent animate-pulse" />
            <span>Sovereign Life Cycle Map</span>
          </h3>
          <p className="text-sm font-serif font-light text-[#f5f5f7] mt-1 tracking-wide">
            Interactive age-by-age grid mapping your cosmic destiny & yearly cycles
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { playMechanicalDial(); setSelectedAge(Math.min(firstEnd, userCurrentAge)); }}
            className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              selectedAge <= firstEnd 
                ? 'bg-gold-accent/15 border-gold-accent/40 text-gold-accent' 
                : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Youth Era
          </button>
          <button
            onClick={() => { playMechanicalDial(); setSelectedAge(Math.min(secondEnd, firstEnd + 5)); }}
            className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              selectedAge > firstEnd && selectedAge <= secondEnd 
                ? 'bg-gold-accent/15 border-gold-accent/40 text-gold-accent' 
                : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Emergence
          </button>
          <button
            onClick={() => { playMechanicalDial(); setSelectedAge(Math.min(thirdEnd, secondEnd + 5)); }}
            className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              selectedAge > secondEnd && selectedAge <= thirdEnd 
                ? 'bg-gold-accent/15 border-gold-accent/40 text-gold-accent' 
                : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Peak Power
          </button>
          <button
            onClick={() => { playMechanicalDial(); setSelectedAge(Math.min(99, thirdEnd + 10)); }}
            className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              selectedAge > thirdEnd 
                ? 'bg-gold-accent/15 border-gold-accent/40 text-gold-accent' 
                : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Harvest Era
          </button>
        </div>
      </div>

      {/* THREE-STAGE MAJOR LANES OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-8 relative z-10" id="life-cycle-stage-lanes">
        {pinnacles.map((p, idx) => {
          const isActive = activeStageIdx === idx;
          const c = challenges[idx];
          return (
            <div
              key={idx}
              onClick={() => { playTactileClick(); handleAgeChange(idx === 0 ? 10 : idx === 1 ? firstEnd + 4 : idx === 2 ? secondEnd + 4 : thirdEnd + 10); }}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isActive 
                  ? 'bg-gradient-to-br from-gold-accent/10 to-transparent border-gold-accent/30 shadow-[0_0_15px_rgba(212,163,89,0.06)]' 
                  : 'bg-black/30 border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[8px] font-mono uppercase tracking-widest font-bold ${isActive ? 'text-gold-accent' : 'text-zinc-500'}`}>
                    {getStageName(idx).split(' ')[0]} {getStageName(idx).split(' ')[1]}
                  </span>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-gold-accent shadow-[0_0_8px_#d4a359]"></div>}
                </div>
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide truncate">{p.label.split('(')[0]}</h4>
                <p className="text-[10px] text-zinc-500 font-sans mt-1">{p.ageRange}</p>
              </div>

              <div className="flex gap-4 items-center mt-3 pt-2.5 border-t border-white/5 text-left">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Pinnacle</span>
                  <span className={`text-base font-serif font-bold ${isActive ? 'text-gold-accent' : 'text-zinc-300'}`}>{p.number}</span>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Challenge</span>
                  <span className={`text-base font-serif font-bold ${isActive ? 'text-rose-400' : 'text-zinc-300'}`}>{c.number}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* THE AGE SLIDER CONTROLLER */}
      <div className="p-5 bg-black/40 border border-white/5 rounded-2xl relative mb-8 z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-3/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-gold-accent animate-spin-slow" />
              <span>Scroll to Select Age or Year:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={decrementAge}
                disabled={selectedAge <= 0}
                className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded border border-white/10 text-white cursor-pointer transition-colors"
              >
                -
              </button>
              <span className="text-xs font-mono text-zinc-300 font-bold bg-[#171717] px-2 py-0.5 rounded border border-white/5 min-w-[28px] text-center">
                {selectedAge}
              </span>
              <button 
                onClick={incrementAge}
                disabled={selectedAge >= 99}
                className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded border border-white/10 text-white cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="relative flex items-center h-8">
            <input
              type="range"
              min="0"
              max="99"
              value={selectedAge}
              onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-accent focus:outline-none focus:ring-0"
              style={{
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${(selectedAge/99)*100}%, rgba(255,255,255,0.1) ${(selectedAge/99)*100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
            <span>AGE 0 (Birth)</span>
            {userCurrentAge <= 99 && (
              <span 
                onClick={() => { playTactileClick(); setSelectedAge(userCurrentAge); }}
                className="text-gold-accent cursor-pointer hover:underline font-bold"
              >
                CURRENT AGE ({userCurrentAge})
              </span>
            )}
            <span>AGE 99</span>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center gap-4 bg-zinc-950/80 border border-white/10 p-4 rounded-xl min-w-[200px] w-full md:w-auto relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold-accent/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="text-left">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono block">Timeline Calendar Target</span>
            <span className="text-lg font-serif text-white font-bold block">{targetCalendarYear}</span>
            <span className="text-[10px] text-gold-accent font-sans mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Age {selectedAge} of {input.fullName.split(' ')[0]}
            </span>
          </div>
          
          <div className="w-px h-12 bg-white/10"></div>
          
          <div className="text-center">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono block">Personal Year</span>
            <span className="text-2xl font-serif text-gold-accent font-black block">{personalYearVal}</span>
          </div>
        </div>
      </div>

      {/* FOCUS YEAR ANALYSIS VIEW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAge}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="space-y-6 relative z-10"
          id="focus-year-analysis-block"
        >
          {/* Main banner for the personal year */}
          <div className="p-6 bg-gradient-to-br from-[#1c1917]/90 to-[#121212]/90 border border-gold-accent/20 rounded-2xl relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-gold-accent font-mono font-bold bg-gold-accent/10 px-2.5 py-1 rounded border border-gold-accent/20">
                    Personal Year Vibe {personalYearVal}
                  </span>
                  <span className="text-zinc-400 text-xs font-sans">
                    Active for Year {targetCalendarYear}
                  </span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#f5f5f7] tracking-wide font-medium">
                  {pyDetails.title}: <strong className="text-gold-accent font-bold">{pyDetails.subtitle}</strong>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl pt-1">
                  {pyDetails.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-gold-accent/5 border border-gold-accent/15 rounded-xl text-center min-w-[130px]">
                <Star className="w-5 h-5 text-gold-accent mb-1 animate-pulse" />
                <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-mono font-semibold">Active Current</span>
                <span className="text-xs text-gold-accent font-display font-bold mt-1 uppercase tracking-wider">{pyDetails.energy.split(',')[0]}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-white/5 text-xs text-zinc-400">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-gold-accent font-mono font-bold block mb-1">Strategic Advice</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{pyDetails.advice}</p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">Alchemical Remedies</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{DYNAMIC_REMEDIES[personalYearVal] || DYNAMIC_REMEDIES[1]}</p>
              </div>
            </div>
          </div>

          {/* Grid detailing active cycle themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pinnacle Cycle details */}
            <div className="p-5 bg-white/[0.01] border border-white/5 hover:border-gold-accent/20 transition-all rounded-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                  <span className="text-[9px] uppercase tracking-widest text-gold-accent font-mono font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-gold-accent" />
                    <span>Active Pinnacle Opportunity</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{getStageName(activeStageIdx).split(' ')[0]} Era</span>
                </div>
                
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-gold-accent/5 border border-gold-accent/20 flex items-center justify-center font-serif text-lg text-gold-accent font-bold">
                    {activePinnacle?.number}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{activePinnacle?.label.split('(')[0]}</h5>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Duration: {activePinnacle?.ageRange}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                  {activePinnacle?.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                <span>Opportunistic Vector</span>
                <span className="text-gold-accent font-bold">Resonating Vibe {activePinnacle?.number}</span>
              </div>
            </div>

            {/* Challenge Cycle details */}
            <div className="p-5 bg-white/[0.01] border border-white/5 hover:border-rose-500/20 transition-all rounded-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                  <span className="text-[9px] uppercase tracking-widest text-rose-400 font-mono font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Active Spiritual Challenge</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{getStageName(activeStageIdx).split(' ')[0]} Era</span>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-rose-500/5 border border-rose-500/20 flex items-center justify-center font-serif text-lg text-rose-400 font-bold">
                    {activeChallenge?.number}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{activeChallenge?.label.split('(')[0]}</h5>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Duration: {activeChallenge?.ageRange}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                  {activeChallenge?.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                <span>Spiritual Hurdle</span>
                <span className="text-rose-400 font-bold">Neutralizing Shadow {activeChallenge?.number}</span>
              </div>
            </div>
          </div>

          {/* Unified Synthesis of the Year */}
          <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex items-start gap-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0 text-emerald-400 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">
                Cosmic Year Synthesis & Integration Advice
              </span>
              <p className="text-xs text-zinc-200 font-serif leading-relaxed italic">
                "{getSynthesis(personalYearVal, activePinnacle?.number || 1)}"
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
