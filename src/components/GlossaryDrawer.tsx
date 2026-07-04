import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Sparkles, AlertCircle, Compass, RefreshCw, Layers } from 'lucide-react';
import { playHoverTick, playTactileClick } from '../audio';

export interface GlossaryTerm {
  id: string;
  title: string;
  category: 'core' | 'cycles' | 'karma' | 'celestial';
  shortDef: string;
  longDef: string;
  formula: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'lifepath',
    title: 'Life Path Number',
    category: 'core',
    shortDef: 'Your core identity, life path, and the destination of your journey.',
    longDef: 'The most critical single number in your entire numerological chart. It represents your natural traits, the core lessons you are here to learn, and the specific path you are destined to walk. This vibration guides your career, personal growth, and general path through existence.',
    formula: 'Calculated by reducing your complete month, day, and year of birth to a single digit (or master number).'
  },
  {
    id: 'expression',
    title: 'Expression (Destiny) Number',
    category: 'core',
    shortDef: 'Your natural talents, active capabilities, and outward expression.',
    longDef: 'Often referred to as the Destiny Number, this vibration represents your potential, capabilities, and the natural gifts you brought into the world. It is the vehicle through which you live out your Life Path, representing how you express your ideas, desires, and dreams.',
    formula: 'Calculated by converting all letters of your full birth name into their Pythagorean numerical equivalents and reducing them.'
  },
  {
    id: 'soulurge',
    title: "Soul Urge (Heart's Desire)",
    category: 'core',
    shortDef: 'Your innermost motivations, deep cravings, and private soul needs.',
    longDef: 'The Soul Urge reveals your hidden motivations, deepest cravings, and what you truly value in life. It reflects who you are when you are alone with your thoughts—the quiet whisper of your heart that drives your relationships, lifestyle choices, and spiritual calling.',
    formula: 'Calculated by adding and reducing the numerical values of the vowels in your full birth name.'
  },
  {
    id: 'personality',
    title: 'Personality Number',
    category: 'core',
    shortDef: 'The first impression you make and how others perceive your outer persona.',
    longDef: "The Personality Number acts as your outer shield—the first impression you make on others before they get to know you deeply. It represents the traits you willingly reveal to the world and helps filter out or welcome experiences and relationships that align with your inner self.",
    formula: 'Calculated by adding and reducing the numerical values of the consonants in your full birth name.'
  },
  {
    id: 'birthday',
    title: 'Birth Day Number',
    category: 'core',
    shortDef: 'Specific auxiliary talents and gifts you brought with you.',
    longDef: 'The day of the month you were born represents an auxiliary talent, perspective, or skill you can call upon at any time to assist you on your Life Path. It acts as a specialized tool that helps you solve problems and navigate daily life.',
    formula: 'Derived directly from the day of your birth (reduced to a single digit unless it is a Master Number 11 or 22).'
  },
  {
    id: 'karmicdebt',
    title: 'Karmic Debt Number',
    category: 'karma',
    shortDef: 'Past life imbalances that must be acknowledged and resolved in this lifetime.',
    longDef: 'Karmic Debts (specifically the numbers 13, 14, 16, or 19) indicate areas where your soul experienced imbalances or misuses of power, freedom, love, or responsibility in past lives. In this lifetime, these numbers serve as critical wake-up calls and lessons to restore cosmic balance.',
    formula: 'Detected when sub-totals or intermediate totals before the final reduction match 13, 14, 16, or 19 in major core calculations.'
  },
  {
    id: 'pinnacles',
    title: 'Pinnacles',
    category: 'cycles',
    shortDef: 'Four seasonal chapters of opportunities, growth, and focus.',
    longDef: 'Life is divided into four long-term Pinnacles, representing major shifts in your environment, career, relationships, and priorities. Each Pinnacle presents a specific opportunity to build, grow, and mature under a particular vibrational energy.',
    formula: 'First Pinnacle (Birth to mid-30s), Second Pinnacle (next 9 years), Third Pinnacle (next 9 years), and Fourth Pinnacle (mid-50s and beyond). Each has unique calculations based on day, month, and year of birth.'
  },
  {
    id: 'challenges',
    title: 'Challenges',
    category: 'cycles',
    shortDef: 'Specific lifetime obstacles linked to your pinnacles.',
    longDef: 'Alongside each Pinnacle, a Challenge represents a psychological or behavioral hurdle you must overcome to fully step into your potential. Overcoming these challenges releases deep reserves of strength and unlocks your primary gifts.',
    formula: 'Calculated using subtraction between specific reduced elements of your birth date.'
  },
  {
    id: 'personalyear',
    title: 'Personal Year Cycle',
    category: 'cycles',
    shortDef: 'A 9-year cyclic energy governing the vibe of each calendar year.',
    longDef: 'Your life progresses in continuous 9-year cycles, with each year carrying a distinct theme (from 1: New Beginnings to 9: Completion and Release). Aligning your actions with your Personal Year vibration prevents you from swimming against the cosmic tide.',
    formula: 'Calculated by adding your Month of Birth + Day of Birth + Current Calendar Year, reduced to a single digit.'
  },
  {
    id: 'planetaryhour',
    title: 'Planetary Hour',
    category: 'celestial',
    shortDef: 'Specific planetary energies ruling localized times of day.',
    longDef: 'A system of fine-grained cosmic timing that assigns different planetary rulers to each hour of the day. Choosing the right planetary hour for signatures, meditation, negotiations, or rest aligns your efforts with cosmic micro-currents.',
    formula: 'Derived from calculations of local sunrise/sunset and dividing day/night portions into 12 equal hours.'
  },
  {
    id: 'lunarphase',
    title: 'Lunar Phase',
    category: 'celestial',
    shortDef: 'Inner emotional tides and deep subconscious instincts.',
    longDef: 'The phase of the moon at your birth influences your deep emotional reactions, subconscious drives, and the natural rhythm of your growth. It represents the light level of your inner world and how you project your feelings.',
    formula: 'Calculated based on the exact synodic period of the Moon relative to the Sun on your date of birth.'
  },
  {
    id: 'inclusiontable',
    title: 'Inclusion (Karmic Lesson) Table',
    category: 'karma',
    shortDef: 'A map of the letters in your name, showing hidden strengths and missing lessons.',
    longDef: 'The Inclusion Table measures how many of each number (1-9) appear in your birth name. Missing numbers represent Karmic Lessons (traits you need to learn), while over-represented numbers represent intense strengths or over-emphasis on certain traits.',
    formula: 'Obtained by counting the frequency of letters matching each number 1 to 9 based on name letters.'
  }
];

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function GlossaryDrawer({ isOpen, onClose, searchTerm, onSearchChange }: GlossaryDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'cycles' | 'karma' | 'celestial'>('all');

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = term.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            term.shortDef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            term.longDef.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || term.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer" 
            onClick={() => { playHoverTick(); onClose(); }}
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-black/90 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-serif text-lg font-light text-[#f5f5f7] tracking-wide">
                    Cosmic Glossary
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-sans uppercase tracking-widest font-medium">
                    Pythagorean Lexicon & Vibrations
                  </p>
                </div>
              </div>
              <button 
                onMouseEnter={() => playHoverTick()}  
                onClick={() => { playTactileClick(); onClose(); }}
                className="p-2 text-zinc-400 hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-all cursor-pointer rounded-xl border border-transparent hover:border-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-6 pt-5 pb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search glossary terms..." 
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-[#f5f5f7] placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all font-sans"
                />
                {searchTerm && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-[#f5f5f7]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 pb-4 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {(['all', 'core', 'cycles', 'karma', 'celestial'] as const).map((cat) => (
                <button
                  key={cat}
                  onMouseEnter={() => playHoverTick()}
                  onClick={() => { playTactileClick(); setActiveCategory(cat); }}
                  className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                      : 'bg-white/[0.02] text-zinc-400 border-white/[0.05] hover:bg-white/[0.05] hover:text-[#f5f5f7]'
                  }`}
                >
                  {cat === 'all' && 'All'}
                  {cat === 'core' && 'Core Numbers'}
                  {cat === 'cycles' && 'Cycles & Pinnacles'}
                  {cat === 'karma' && 'Karma & Debt'}
                  {cat === 'celestial' && 'Celestial'}
                </button>
              ))}
            </div>

            {/* Glossary Content */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
              {filteredTerms.map((term, idx) => (
                <motion.div 
                  key={term.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-serif text-base font-normal text-[#f5f5f7] group-hover:text-blue-400 transition-colors">
                      {term.title}
                    </h4>
                    <span className="text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.05]">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-3">
                    {term.longDef}
                  </p>
                  <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl flex gap-2 items-start">
                    <Layers className="w-3.5 h-3.5 text-blue-500/60 mt-0.5 shrink-0" />
                    <div className="text-[10px] text-zinc-500 font-sans leading-normal">
                      <span className="font-bold text-zinc-400">Vibrational Formula:</span> {term.formula}
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredTerms.length === 0 && (
                <div className="text-center py-16 text-zinc-500 font-sans space-y-2">
                  <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs">No matching glossary terms found.</p>
                  <button 
                    onClick={() => { onSearchChange(''); setActiveCategory('all'); }}
                    className="text-xs text-blue-500 hover:underline mt-2"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] text-center text-[10px] text-zinc-500 font-sans">
              Pythagorean Hermetic Science &copy; {new Date().getFullYear()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
