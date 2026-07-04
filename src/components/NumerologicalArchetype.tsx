import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Crown, 
  BookOpen, 
  Compass, 
  Zap, 
  Award, 
  Heart, 
  Layers, 
  Cpu, 
  Activity, 
  Flame, 
  Wind, 
  Droplet, 
  Mountain, 
  RefreshCw,
  Info
} from 'lucide-react';
import { playHoverTick, playTactileClick } from '../audio';
import { NumerologyMetrics } from '../types';

interface NumerologicalArchetypeProps {
  metrics: NumerologyMetrics;
  openGlossary: (term: string) => void;
}

interface ArchetypeData {
  title: string;
  subtitle: string;
  motto: string;
  element: 'Fire' | 'Air' | 'Water' | 'Earth' | 'Ether';
  elementIcon: any;
  elementColor: string;
  summary: string;
  gift: string;
  shadow: string;
  sacredSymbol: string;
  vibrationalBars: { label: string; value: number; color: string }[];
  tags: string[];
}

export default function NumerologicalArchetype({ metrics, openGlossary }: NumerologicalArchetypeProps) {
  const [activeSubTab, setActiveSubTab] = useState<'essence' | 'alchemy' | 'guidance'>('essence');

  const lpNum = metrics.lifePath.number;
  const expNum = metrics.expression.number;
  const suNum = metrics.soulUrge.number;

  // Let's dynamically calculate the perfect archetype based on Life Path, Expression, and Soul Urge
  const getArchetypeDetails = (): ArchetypeData => {
    // 1. MASTER CODES
    if (lpNum === 11 || expNum === 11) {
      return {
        title: "The Illuminated Cosmic Seer",
        subtitle: "The Portal of Higher Vibrations & Astral Guidance",
        motto: "As above, so below; I channel the cosmic currents to illuminate the earthly path.",
        element: "Ether",
        elementIcon: Sparkles,
        elementColor: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        summary: "You hold the high-vibrational frequency of the Master Intuitive. Your existence is a bridge between the unseen, transcendental realms and standard human experience. You possess an electric, highly charged aura that acts as a lightning rod for divine inspiration, spiritual breakthroughs, and profound visionary insight.",
        gift: "Unparalleled intuitive channels, prophetic dreaming, magnetic aura, and the natural power to trigger spontaneous spiritual awakenings in others.",
        shadow: "Hyper-sensitivity to chaotic environments, tendency to carry somatic tension, and feeling isolated or 'unfit' for the mundane world.",
        sacredSymbol: "The Double Gateway (Dual Pillars of 11)",
        vibrationalBars: [
          { label: "Intuitive Resonance", value: 98, color: "bg-purple-500" },
          { label: "Creative Alchemical Fire", value: 85, color: "bg-pink-500" },
          { label: "Visionary Power", value: 94, color: "bg-blue-500" },
          { label: "Earthly Grounding", value: 45, color: "bg-emerald-500" }
        ],
        tags: ["Channeller", "Ethereal", "Highly Sensitive", "Catalyst"]
      };
    }

    if (lpNum === 22 || expNum === 22) {
      return {
        title: "The Great Divine Architect",
        subtitle: "The Master Builder of Legacy Systems & Sacred Realities",
        motto: "I translate the highest spiritual ideals into concrete, long-lasting monuments of progress.",
        element: "Earth",
        elementIcon: Mountain,
        elementColor: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        summary: "Operating under the prestigious 22 Master Builder vibration, your soul is designed to materialise massive visions on a global scale. You possess the practical genius of the 4 combined with the ethereal foresight of the 11, giving you the rare capability to build institutions, systems, or creations that alter generations.",
        gift: "Unyielding organizational genius, the ability to orchestrate complex global projects, and the supreme capacity to align high spiritual laws with physical reality.",
        shadow: "Crippling fear of failure, falling into severe perfectionism, or carrying the crushing weight of global responsibility on your shoulders.",
        sacredSymbol: "The Perfected Square (Sacred Foundation)",
        vibrationalBars: [
          { label: "Systemic Mastery", value: 99, color: "bg-amber-500" },
          { label: "Execution Precision", value: 95, color: "bg-emerald-500" },
          { label: "Transcendental Vision", value: 88, color: "bg-blue-500" },
          { label: "Emotional Receptivity", value: 55, color: "bg-purple-500" }
        ],
        tags: ["Architect", "Legacy Builder", "Pragmatic Mystic", "Systemizer"]
      };
    }

    if (lpNum === 33 || expNum === 33) {
      return {
        title: "The Avatar of Infinite Grace",
        subtitle: "The Cosmic Guardian of Spiritual Healing & Universal Devotion",
        motto: "I offer my heart as a living altar for the transmutation of collective suffering.",
        element: "Water",
        elementIcon: Droplet,
        elementColor: "text-sky-400 border-sky-500/20 bg-sky-500/5",
        summary: "As a bearer of the ultra-rare 33 Master Teacher frequency, your life is an initiation into pure, unconditional devotion and service. You feel a massive pull toward healing the world's deep wounds, offering refuge, and mentoring other souls into their highest heart alignment.",
        gift: "Radical, transformative empathy, the voice of absolute healing grace, and a divine charisma that instantly dissolves conflict and resentment.",
        shadow: "Martyrdom complexes, neglecting your own physical vitality to save others, and carrying the unhealed grief of your ancestral lineage.",
        sacredSymbol: "The Radiant Lotus Heart",
        vibrationalBars: [
          { label: "Compassion Healing", value: 100, color: "bg-sky-500" },
          { label: "Somatic Sensitivity", value: 90, color: "bg-purple-500" },
          { label: "Expressive Harmony", value: 92, color: "bg-pink-500" },
          { label: "Strategic Ego Defense", value: 38, color: "bg-amber-500" }
        ],
        tags: ["Divine Guardian", "Avatar", "Empath", "Healer"]
      };
    }

    // 2. ELEMENTAL & ARCHETYPAL MAPPINGS BY LP & EXPRESSION
    // Fire Archetypes (1, 5, 8)
    if ([1, 8].includes(lpNum) && [1, 5, 8].includes(expNum)) {
      return {
        title: "The Sovereign Alchemist",
        subtitle: "The Self-Determining Leader of Material & Spiritual Domains",
        motto: "I command my internal focus to mold external reality and manifest supreme abundance.",
        element: "Fire",
        elementIcon: Flame,
        elementColor: "text-red-400 border-red-500/20 bg-red-500/5",
        summary: "You are a powerhouse of executive, initiating, and transformative fire. Combining the fierce independence of the 1 with the material command and cyclic wisdom of the 8, your archetype is meant to lead, disrupt stagnant hierarchies, and build formidable castles of power, wealth, and spiritual sovereignty.",
        gift: "Indomitable willpower, strategic masterminding, magnetic authority, and the ability to turn crisis into massive expansion.",
        shadow: "Intolerance for perceived weakness, a tendency to control others, and workaholic burnouts that suppress emotional vulnerability.",
        sacredSymbol: "The Crowned Golden Phoenix",
        vibrationalBars: [
          { label: "Sovereign Command", value: 96, color: "bg-red-500" },
          { label: "Willpower Density", value: 92, color: "bg-amber-500" },
          { label: "Strategic Foresight", value: 85, color: "bg-blue-500" },
          { label: "Nurturing Intimacy", value: 50, color: "bg-pink-500" }
        ],
        tags: ["Sovereign", "Alchemist", "Disruptor", "Magnate"]
      };
    }

    // Air / Creative Archetypes (3, 5, 7)
    if ([3, 5].includes(lpNum) || [3, 5].includes(expNum)) {
      return {
        title: "The Cosmic Nomad & Alchemist",
        subtitle: "The Catalyst of Playful Wisdom & Multidimensional Expression",
        motto: "My words and actions are portals that break stagnation and ignite divine curiosity.",
        element: "Air",
        elementIcon: Wind,
        elementColor: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
        summary: "Your soul is a beautifully free, sparkling current of wind, change, and communication. Blending the magnetic, joyful creativity of the 3 with the wild, adaptive curiosity of the 5, you are here to explore every facet of human experience, transmit vital ideas, and liberate others from boring, rigid structures.",
        gift: "Electrifying wit, rapid-fire adaptability, absolute charm, and the artistic magic to translate complex spiritual concepts into popular, inspiring media.",
        shadow: "Scattering energy across too many pursuits, avoidance of deep commitment, and sensory overload due to a lack of mental filters.",
        sacredSymbol: "The Star of Endless Vectors",
        vibrationalBars: [
          { label: "Creative Alchemy", value: 95, color: "bg-cyan-500" },
          { label: "Adaptability Vector", value: 98, color: "bg-teal-500" },
          { label: "Intuitive Spark", value: 82, color: "bg-purple-500" },
          { label: "Routine Endurance", value: 40, color: "bg-slate-500" }
        ],
        tags: ["Nomad", "Storyteller", "Catalyst", "Inspirer"]
      };
    }

    // Deep Mystic / Water / Sage (7, 9)
    if ([7, 9].includes(lpNum) || [7, 9].includes(expNum)) {
      return {
        title: "The Mystical Truth Seeker",
        subtitle: "The Guardian of Hermetic Knowledge & Spiritual Evolution",
        motto: "I look past the earthly illusion to decipher the mathematical codes of the absolute truth.",
        element: "Water",
        elementIcon: Droplet,
        elementColor: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        summary: "You carry a quiet, exceptionally deep, and wise vibration. With the mystical, truth-seeking lens of the 7 and the universal, compassionate heart of the 9, you are an observer, a philosopher, and a high-level teacher. You find solitude enriching, and you extract cosmic wisdom from the depths of silence.",
        gift: "Profound analytical mind, instant recognition of spiritual fraudulence, incredible wisdom of natural laws, and deep ancestral memory.",
        shadow: "Intellectual superiority, emotional isolation, cynicism, or checking out of physical life into mental abstraction.",
        sacredSymbol: "The Deep Oracle Chalice",
        vibrationalBars: [
          { label: "Analytical Depth", value: 97, color: "bg-blue-500" },
          { label: "Metaphysical Vision", value: 92, color: "bg-purple-500" },
          { label: "Universal Empathy", value: 80, color: "bg-sky-500" },
          { label: "Mundane Commerce", value: 42, color: "bg-amber-500" }
        ],
        tags: ["Sage", "Oracle", "Philosopher", "Truthseeker"]
      };
    }

    // Sacred Grounding / Nurturing Earth (2, 4, 6)
    return {
      title: "The Sacred Pillar of Sanctuary",
      subtitle: "The Architect of Collective Harmony & Anchored Love",
      motto: "I build the safe, structured sanctuaries where life can flourish and find peace.",
      element: "Earth",
      elementIcon: Mountain,
      elementColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      summary: "Your vibrational landscape is defined by structure, deep warmth, nurturing, and loyalty. Drawing from the sacred duty and love of the 6, combined with the structural integrity of the 4 or the harmonizing empathy of the 2, you are a guardian, a stabilizer, and a sanctuary-maker for your family, community, and the earth.",
      gift: "Absolute structural reliability, master-level nurturing of living systems, healing through order, and profound loyalty.",
      shadow: "Over-functioning for others, boundary-less people-pleasing, or getting stuck in rigid dogmas out of fear of structural change.",
      sacredSymbol: "The Roots of the Cosmic Tree",
      vibrationalBars: [
        { label: "Anchored Stability", value: 94, color: "bg-emerald-500" },
        { label: "Relational Harmony", value: 90, color: "bg-teal-500" },
        { label: "Nurturing Sanctuary", value: 88, color: "bg-pink-500" },
        { label: "Risk-Taking Impulse", value: 45, color: "bg-red-500" }
      ],
      tags: ["Stabilizer", "Nurturer", "Pillar", "Guardian"]
    };
  };

  const details = getArchetypeDetails();
  const ElementIcon = details.elementIcon;

  // Let's calculate a custom alchemy description based on Life Path & Expression number combination
  const getAlchemyDescription = () => {
    return `Your Life Path ${lpNum} represents your core biological and spiritual compass—how you absorb lessons and traverse reality. Conversely, your Expression ${expNum} represents your active cosmic toolkit and destiny. The blending of ${lpNum} and ${expNum} forms a rare ${details.title} blueprint. This means while your internal driver seeks ${metrics.lifePath.label.toLowerCase()}, your external soul manifestation executes via ${metrics.expression.label.toLowerCase()}. Balancing these two ensures maximum alignment with minimal resistance.`;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] via-transparent to-transparent relative overflow-hidden mb-10 text-left">
      {/* Absolute Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/[0.01] rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      {/* Header section with badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Crown className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
              Primary Vibrational Signature
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-light text-[#f5f5f7] mt-1.5 tracking-wide">
            Your Numerological Archetype
          </h3>
        </div>

        {/* Dynamic Element Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans font-medium uppercase tracking-wider ${details.elementColor}`}>
          <ElementIcon className="w-3.5 h-3.5" />
          <span>{details.element} Element</span>
        </div>
      </div>

      {/* Main Grid: Visual Archetype Left, Data/Tabs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 relative z-10">
        {/* Left Column: Visual Card representation with premium motion tilt */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <motion.div
            whileHover={{ 
              y: -8,
              rotateX: 4,
              rotateY: -4,
              borderColor: "rgba(59, 130, 246, 0.4)",
              boxShadow: "0 25px 50px -12px rgba(59,130,246,0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01] relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-2xl"
          >
            {/* Soft inner glow behind symbol */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top row of card */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Cosmic Blueprint</span>
                <span className="text-[11px] text-blue-400 font-serif italic">{details.sacredSymbol}</span>
              </div>
              <Sparkles className="w-5 h-5 text-blue-400/80 animate-pulse" />
            </div>

            {/* Centered Name / Title with magnificent typography */}
            <div className="my-8 text-center" style={{ transform: "translateZ(30px)" }}>
              <h4 className="font-serif text-2xl sm:text-3xl font-light text-[#f5f5f7] tracking-wide leading-tight">
                {details.title}
              </h4>
              <p className="text-xs text-zinc-400 font-serif italic mt-2 max-w-xs mx-auto">
                "{details.motto}"
              </p>
            </div>

            {/* Bottom tags and core number matrix */}
            <div className="border-t border-white/[0.06] pt-4 mt-auto">
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {details.tags.map((tag, i) => (
                  <span key={i} className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-white/5 text-zinc-300 border border-white/10 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans">
                <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                  <span className="text-zinc-500 block">Life Path</span>
                  <span className="text-xs font-serif font-bold text-blue-400">{lpNum}</span>
                </div>
                <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                  <span className="text-zinc-500 block">Expression</span>
                  <span className="text-xs font-serif font-bold text-amber-400">{expNum}</span>
                </div>
                <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                  <span className="text-zinc-500 block">Soul Urge</span>
                  <span className="text-xs font-serif font-bold text-pink-400">{suNum}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 p-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.01] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Your Archetype acts as a synthesis of your core numerological currents, merging your natural environment (Life Path) with your divine purpose (Expression) and inner longing (Soul Urge).
            </p>
          </div>
        </div>

        {/* Right Column: Tab Navigation & Details */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Custom Premium Stepper/Tabs */}
            <div className="flex border-b border-white/[0.06] p-0.5 gap-1 overflow-x-auto">
              {[
                { id: 'essence', label: 'Core Essence', icon: Layers },
                { id: 'alchemy', label: 'Vibrational Alchemy', icon: RefreshCw },
                { id: 'guidance', label: 'Sacred Oracle', icon: Compass }
              ].map((subTab) => {
                const TabIcon = subTab.icon;
                const isSelected = activeSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onMouseEnter={() => playHoverTick()}
                    onClick={() => { playTactileClick(); setActiveSubTab(subTab.id as any); }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isSelected 
                        ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                        : 'border-transparent text-zinc-400 hover:text-[#f5f5f7] hover:bg-white/[0.02]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content wrapper with smooth height or cross-fades */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeSubTab === 'essence' && (
                  <motion.div
                    key="essence"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <h5 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1.5 font-bold">The Archetypal Portrait</h5>
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                        {details.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">Core Spiritual Gift</span>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {details.gift}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">Shadow Frequency & Lesson</span>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {details.shadow}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSubTab === 'alchemy' && (
                  <motion.div
                    key="alchemy"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <h5 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5 font-bold">Dual-Vibration Convergence</h5>
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                        {getAlchemyDescription()}
                      </p>
                    </div>

                    {/* Dynamic Interactive Vibrational Bars */}
                    <div className="space-y-3.5 pt-2">
                      <h6 className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-2">Vibrational Flow Coefficients</h6>
                      {details.vibrationalBars.map((bar, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-sans">
                            <span className="text-zinc-400">{bar.label}</span>
                            <span className="text-[#f5f5f7] font-semibold">{bar.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.value}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${bar.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSubTab === 'guidance' && (
                  <motion.div
                    key="guidance"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <h5 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1.5 font-bold">Sacred Oracle Alignment Statement</h5>
                      <div className="p-5 rounded-xl border border-blue-500/10 bg-blue-500/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                          <Sparkles className="w-8 h-8 text-blue-500/10" />
                        </div>
                        <p className="text-sm font-serif italic text-blue-300 leading-relaxed text-center py-2">
                          "Your core alignment thrives when you honor the stillness within. The {lpNum} Life Path forces your growth through structural shifts, but your {expNum} Expression insists you execute with absolute creative freedom. Reconcile both, and walk your path as the sovereign guardian of your destiny."
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h6 className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">Practical Alignment Rituals</h6>
                      <ul className="space-y-2 text-xs font-sans text-zinc-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Conduct a **Somatic Check-in** at dawn to balance your sensitive energetic centers.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Incorporate natural element rituals (e.g. Earth grounding, pure Water rituals) matching your **{details.element}** element.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Consult the Cosmic Glossary whenever you hit an energetic bottleneck to understand the specific lessons.</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              Calculation derived from Name + Date of Birth
            </span>
            <button
              onMouseEnter={() => playHoverTick()}
              onClick={() => openGlossary(details.title)}
              className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <span>Explore Archetype Meanings in Glossary</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
