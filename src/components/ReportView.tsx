import React, { useState, useEffect } from 'react';
import { fetchWithRetry } from '../apiClient';
import { motion, AnimatePresence } from 'motion/react';
import InfoTooltip from './InfoTooltip';
import GlossaryDrawer from './GlossaryDrawer';
import { 
  AlertCircle,
  RefreshCw,
  Sparkles, Compass, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  Bookmark, 
  Grid,
  MapPin,
  CalendarDays,
  User,
  
  Heart,
  Type,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Moon, Globe, Home,
  X,
  Users,
  Briefcase,
  Target,
  Flame
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import ZodiacConstellation from './ZodiacConstellation';
import MilestoneTimeline from './MilestoneTimeline';
import LifeCycleMap from './LifeCycleMap';
import NumerologicalArchetype from './NumerologicalArchetype';
import LifecyclePhasesWidget from './LifecyclePhasesWidget';
import AssetAnalyzer from './AssetAnalyzer';
import DynamicPhoneAnalyzer from './DynamicPhoneAnalyzer';
import CosmicClockWidget from './CosmicClockWidget';
import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';
import { 
  NumerologyReport, 
  NumerologyMetrics, 
  PinnacleCycle, 
  ChallengeCycle, 
  KarmicDebt 
} from '../types';
import { 
  generateNumerologyReport, 
  calculatePartnerCompatibility 
} from '../numerologyEngine';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportViewProps {
  report: NumerologyReport;
  onReset: () => void;
}

type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors' | 'name_analysis' | 'lifestyle';


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

const getMoonPhase = (date: Date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 3) {
    year--;
    month += 12;
  }
  ++month;
  const c = 365.25 * year;
  const e = 30.6 * month;
  const jd = c + e + day - 694039.09; 
  const phase = jd / 29.5305882;
  const b = phase - Math.floor(phase);
  if (b < 0.03 || b > 0.97) return { phase: 'New Moon', suggestion: 'Plant new seeds of intention.' };
  if (b < 0.22) return { phase: 'Waxing Crescent', suggestion: 'Gather resources and plan ahead.' };
  if (b < 0.28) return { phase: 'First Quarter', suggestion: 'Take decisive action and face challenges.' };
  if (b < 0.47) return { phase: 'Waxing Gibbous', suggestion: 'Refine, adjust, and perfect your work.' };
  if (b < 0.53) return { phase: 'Full Moon', suggestion: 'Release what no longer serves you; celebrate progress.' };
  if (b < 0.72) return { phase: 'Waning Gibbous', suggestion: 'Share your wisdom and express gratitude.' };
  if (b < 0.78) return { phase: 'Last Quarter', suggestion: 'Rest, reflect, and forgive.' };
  return { phase: 'Waning Crescent', suggestion: 'Surrender, rest, and prepare for renewal.' };
};





const LifePhaseTimeline = ({ pinnacles, challenges }: { pinnacles: PinnacleCycle[], challenges: ChallengeCycle[] }) => {
  const [activeCycle, setActiveCycle] = useState(0);
  
  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-8 scrollbar-hide snap-x">
        <div className="flex gap-4 w-max px-4">
          {pinnacles.map((p, i) => {
            const c = challenges[i];
            const isActive = activeCycle === i;
            return (
              <div 
                key={i} 
                onClick={() => { playTactileClick(); setActiveCycle(i); }}
                className={`snap-center shrink-0 w-72 glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-500 ${isActive ? 'scale-105 border-blue-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]' : 'scale-95 opacity-70 hover:opacity-100'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold font-sans">Cycle {i + 1}</span>
                  <span className="text-[10px] text-zinc-400 bg-white/[0.05] px-2 py-1 rounded-full">{p.ageRange}</span>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Pinnacle</div>
                    <div className="text-3xl font-serif text-[#f5f5f7] mb-2">{p.number}</div>
                    <p className="text-[10px] text-zinc-400 line-clamp-3 leading-relaxed">{p.description}</p>
                  </div>
                  
                  <div className="w-px bg-white/[0.08]"></div>
                  
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Challenge</div>
                    <div className="text-3xl font-serif text-rose-300 mb-2">{c.number}</div>
                    <p className="text-[10px] text-zinc-400 line-clamp-3 leading-relaxed">{c.description}</p>
                  </div>
                </div>
                
                {isActive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/[0.08]">
                     <p className="text-[10px] text-blue-300 leading-relaxed italic">
                       "Focus on {p.number} to overcome the shadow of {c.number}."
                     </p>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="text-center mt-4 text-xs text-zinc-500 flex items-center justify-center gap-2">
        <ArrowRight className="w-3 h-3 animate-pulse" /> Swipe to navigate timeline
      </div>
    </div>
  )
};


const EnergyMonitor = ({ score }: { score: number }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-2xl group cursor-pointer overflow-hidden min-h-[220px]">
      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mb-2">Cycle Energy Monitor</h4>
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors rounded-2xl"></div>
      
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="url(#energyGradient)" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#818cf8" />
    <stop offset="100%" stopColor="#3b82f6" />
  </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ top: 'calc(50% + 10px)' }}>
        <span className="text-3xl font-serif text-[#f5f5f7]">{score}</span>
        <span className="text-[8px] uppercase tracking-widest text-zinc-400">Intensity</span>
      </div>
      
      <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 w-full px-2">
         <p className="text-[10px] text-blue-300">
           {score > 80 ? 'High energetic potential. Take bold actions.' : score > 50 ? 'Balanced flow. Maintain steady progress.' : 'Low resistance. Focus on inner reflection.'}
         </p>
      </div>
    </div>
  );
};

const AstrologicalAspectMap = ({ metrics }: { metrics: NumerologyMetrics }) => {
  const points = [];
  for (let i = 0; i < 9; i++) {
    const angle = (i * 40 - 90) * (Math.PI / 180);
    points.push({ x: 50 + 35 * Math.cos(angle), y: 50 + 35 * Math.sin(angle), num: i + 1 });
  }

  const getBaseNum = (n: number) => n > 9 && n !== 11 && n !== 22 && n !== 33 ? n % 9 || 9 : (n === 11 ? 2 : (n === 22 ? 4 : (n === 33 ? 6 : n)));
  const coreNums = [getBaseNum(metrics.lifePath.number), getBaseNum(metrics.expression.number), getBaseNum(metrics.soulUrge.number)];
  
  const polyPoints = coreNums.map(n => {
    const p = points[(n > 9 ? n%9||9 : n) - 1] || points[0];
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col items-center">
      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mb-3">Vibrational Geometry</h4>
      <svg viewBox="0 0 100 100" className="w-full h-32 max-w-[128px]">
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        {points.map(p => {
           const isActive = coreNums.includes(p.num);
           return (
            <g key={p.num}>
              <circle cx={p.x} cy={p.y} r={isActive ? "3" : "1.5"} fill={isActive ? "#a855f7" : "rgba(255,255,255,0.1)"} />
              <text x={p.x} y={p.y + 0.5} fontSize="3.5" fill={isActive ? "#fff" : "rgba(255,255,255,0.3)"} textAnchor="middle" alignmentBaseline="middle" fontWeight={isActive ? "bold" : "normal"}>
                {p.num}
              </text>
            </g>
           );
        })}
        <polygon points={polyPoints} fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" strokeWidth="0.75" className="animate-pulse" />
      </svg>
      <p className="text-[9px] text-zinc-500 mt-3 text-center leading-tight"> Sacred geometry linking Life Path, Expression, & Soul Urge. </p>
    </div>
  );
};

const CustomYearTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const year = data.year;
    const py = data.intensity;
    const isCurrent = data.isCurrent;
    
    const themes: Record<number, string> = {
      1: "New Beginnings & Independence",
      2: "Partnership, Cooperation & Patience",
      3: "Creative Expression & Social Growth",
      4: "Structure, Discipline & Foundation",
      5: "Dynamic Change, Freedom & Adventure",
      6: "Harmony, Family & Healing Service",
      7: "Introspection, Spirituality & Wisdom",
      8: "Abundance, Achievement & Power",
      9: "Completion, Healing & Transition"
    };

    const details: Record<number, string> = {
      1: "A period of initiating new ideas, launching projects, and cultivating self-reliance.",
      2: "Focus on building relationships, working behind the scenes, and practicing patience.",
      3: "Express your authentic self, embrace creativity, and share your voice with the world.",
      4: "Do the hard work, organize your affairs, build lasting foundations, and pay attention to details.",
      5: "Expect unexpected opportunities, travel, adaptability, and breaking free from rigid routines.",
      6: "Embrace home and family responsibilities, healing, service to others, and domestic harmony.",
      7: "A quiet, contemplative year for research, spiritual deepening, self-analysis, and rest.",
      8: "Focus on career progress, financial abundance, manifesting ambitions, and karmic rewards.",
      9: "Release what no longer serves you, complete loose ends, and prepare for the next 9-year cycle."
    };

    return (
      <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl max-w-[240px] text-left bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
            Year {year}
          </span>
          {isCurrent && (
            <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase tracking-wider font-sans">
              Current
            </span>
          )}
        </div>
        <div className="text-sm font-serif font-semibold text-blue-400 mb-0.5">
          Personal Year {py}
        </div>
        <div className="text-[10px] font-sans font-bold text-[#f5f5f7] mb-1.5 uppercase tracking-wide">
          {themes[py] || "Integration"}
        </div>
        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
          {details[py] || ""}
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportView({ report, onReset }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [activeSector, setActiveSector] = useState<string>('Career & Ambition');
  
  // Profile Tab Local State
  const [activeMetricKey, setActiveMetricKey] = useState<keyof NumerologyMetrics>('lifePath');
  const [showMathSteps, setShowMathSteps] = useState(false);

  // Optimizer Tab Local State
  const [testName, setTestName] = useState('');
  const [optimizerReport, setOptimizerReport] = useState<NumerologyReport | null>(null);

  // Compatibility Tab Local State
  const [partnerName, setPartnerName] = useState('');
  const [partnerDob, setPartnerDob] = useState('');
  const [relType, setRelType] = useState<'Spouse' | 'Business' | 'Mentor' | 'Friend' | 'Family' | 'Rival' | 'Dating'>('Spouse');
  const [compatResult, setCompatResult] = useState<any | null>(null);

  // Auto-regenerate report on the fly if missing spiritual remedies (backward compatibility)
  const safeReport = React.useMemo(() => {
    if (!report.spiritualRemedies) {
      return generateNumerologyReport(report.input.fullName, report.input.dateOfBirth, report.input.timeOfBirth, report.input.placeOfBirth);
    }
    return report;
  }, [report]);

  // Forecast Tab Local State
  const [dailyHoroscope, setDailyHoroscope] = useState<string | null>(null);
  const [isLoadingHoroscope, setIsLoadingHoroscope] = useState(false);

  // Lexicon Drawer / Glossary State
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  const openGlossary = (term: string = '') => {
    setGlossarySearch(term);
    setIsLexiconOpen(true);
  };

  useEffect(() => {
    if (activeTab === 'forecast' && !dailyHoroscope && !isLoadingHoroscope && report?.input) {
      const todayStr = new Date().toISOString().split('T')[0];
      const clientCacheKey = `daily_horoscope_${report.input.fullName}_${report.input.dateOfBirth}_${todayStr}`;
      const cached = localStorage.getItem(clientCacheKey);
      if (cached) {
        setDailyHoroscope(cached);
        return;
      }
      
      const fetchHoroscope = async () => {
        setIsLoadingHoroscope(true);
        try {
          const data = await fetchWithRetry('/api/numerology/daily-forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report })
          });
          
          if (data.forecast) {
            setDailyHoroscope(data.forecast);
            localStorage.setItem(clientCacheKey, data.forecast);
          }
        } catch (e) {
          console.error(e);
        }
        setIsLoadingHoroscope(false);
      };
      fetchHoroscope();
    }
  }, [activeTab, dailyHoroscope, isLoadingHoroscope, report]);

  const { metrics, planesOfExpression, karmicLessons, karmicStrengths, pinnacles, challenges, karmicDebts, inclusionTable, input } = report;


  // Chart data for Life Path Cycles (9-year Personal Year cycle)
  const currentYear = new Date().getFullYear();
  const dobParts = input.dateOfBirth.replace(/[^0-9-]/g, '').split('-');
  const bMonth = parseInt(dobParts[1], 10) || 1;
  const bDay = parseInt(dobParts[2], 10) || 1;
  
  const reduceNum = (n) => {
    let sum = n;
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
    }
    return sum;
  };

  const lifePathCycleData = Array.from({ length: 9 }, (_, i) => {
    const year = currentYear - 4 + i;
    const yearSum = year.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
    const py = reduceNum(reduceNum(bMonth) + reduceNum(bDay) + reduceNum(yearSum));
    return {
      year: year.toString(),
      intensity: py,
      isCurrent: year === currentYear
    };
  });

  

  // Chart data for Timeline tab
  const pinnacleChartData = pinnacles.map((p, idx) => {
    const ageStart = p.ageRange.split('-')[0].trim().replace('0-', '0');
    return {
      name: `Phase ${p.stage}`,
      ageLabel: p.ageRange,
      sortAge: parseInt(ageStart) || 0,
      pinnacleVibe: p.number,
      challengeVibe: challenges[idx]?.number || 0
    };
  });

  // Header configurations for the 5 Core Numbers
  const coreCards: { key: keyof NumerologyMetrics; title: string; subtitle: string; icon: any }[] = [
    { key: 'lifePath', title: 'Life Path', subtitle: 'Birth Destiny & Path', icon: MapPin },
    { key: 'expression', title: 'Expression', subtitle: 'Innate Talents & Power', icon: User },
    { key: 'soulUrge', title: 'Soul Urge', subtitle: 'Heart\'s Desire', icon: Bookmark },
    { key: 'personality', title: 'Personality', subtitle: 'Outer Aura & Image', icon: Activity },
    { key: 'birthday', title: 'Birthday Vibration', subtitle: 'Specific Birth Gifts', icon: CalendarDays }
  ];

  const secondaryCards: { key: keyof NumerologyMetrics; title: string; subtitle: string }[] = [
    { key: 'attitude', title: 'Attitude Number', subtitle: 'First Reaction Style' },
    { key: 'maturity', title: 'Maturity Number', subtitle: 'Second-Half Destiny' },
    { key: 'personalYear', title: 'Personal Year Cycle', subtitle: `Your Theme for ${metrics.personalYear.year}` }
  ];

  const deepCards: { key: keyof NumerologyMetrics; title: string; subtitle: string }[] = [
    { key: 'hiddenPassion', title: 'Hidden Passion', subtitle: 'Inner Talents & Drives' },
    { key: 'subconsciousSelf', title: 'Subconscious Self', subtitle: 'Crisis Confidence' },
    { key: 'balance', title: 'Balance Number', subtitle: 'Harmonizing Energy' },
    { key: 'rationalThought', title: 'Rational Thought', subtitle: 'Logical Processing' }
  ];

  const activeMetric = metrics[activeMetricKey] as any;

  // Run Real-Time Signature Optimization
  const handleTestSpelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;
    try {
      const optRep = generateNumerologyReport(testName.trim(), input.dateOfBirth, input.timeOfBirth, input.placeOfBirth);
      setOptimizerReport(optRep);
    } catch (err) {
      console.error(err);
    }
  };

  // Run Real-Time Compatibility Assessment
  const handleTestCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerDob) return;
    try {
      const result = calculatePartnerCompatibility(safeReport, partnerName.trim(), partnerDob, relType);
      setCompatResult(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPdf = async () => {
    const inputElement = document.getElementById('numerology-report-root');
    if (!inputElement) return;

    try {
      const canvas = await html2canvas(inputElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`numerology_report_${input.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }}
      className="space-y-8 pb-12" 
      id="numerology-report-root"
    >
      
      {/* 0. Daily Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Affirmation Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-500 tracking-wide text-xs uppercase font-serif">Daily Affirmation</h4>
            <p className="text-xs text-zinc-300 font-sans mt-1">
              {metrics.lifePath.number === 1 && "I am a bold pioneer, creating my own path. My independence is my greatest strength."}
              {metrics.lifePath.number === 2 && "I radiate peace and harmony in all my relationships. My intuition guides me toward perfect balance."}
              {metrics.lifePath.number === 3 && "I express my truth with joy and creativity. My voice brings light to the world."}
              {metrics.lifePath.number === 4 && "I build strong, enduring foundations. My discipline and focus turn dreams into reality."}
              {metrics.lifePath.number === 5 && "I embrace change and freedom with open arms. My adventurous spirit leads me to new horizons."}
              {metrics.lifePath.number === 6 && "I am a vessel of healing and love. My compassion creates harmony wherever I go."}
              {metrics.lifePath.number === 7 && "I seek the deeper truths of existence. My wisdom grows as I connect with my inner spirit."}
              {metrics.lifePath.number === 8 && "I am aligned with infinite abundance and success. My leadership creates powerful, positive impact."}
              {metrics.lifePath.number === 9 && "I serve humanity with a selfless heart. My universal love transforms the world around me."}
              {metrics.lifePath.number === 11 && "I am a conduit for divine inspiration. My intuitive flashes illuminate the path for others."}
              {metrics.lifePath.number === 22 && "I am a master builder of grand visions. I manifest spiritual truths into physical reality."}
              {metrics.lifePath.number === 33 && "I am a master teacher of unconditional love. My pure heart uplifts all of humanity."}
              {![1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].includes(metrics.lifePath.number) && "I embrace my unique vibrational essence and radiate my true light."}
            </p>
          </div>
        </div>

        {/* Lunar Influence Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-300 tracking-wide text-xs uppercase font-serif">Lunar Influence: {getMoonPhase(new Date()).phase}</h4>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              {getMoonPhase(new Date()).suggestion}
            </p>
          </div>
        </div>
              {/* Planetary Hour Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-400 tracking-wide uppercase font-serif">Planetary Hour: {getPlanetaryHour().planet}</h4>
            <p className="text-xs text-zinc-300 font-sans mt-1">
              {getPlanetaryHour().energy}
            </p>
          </div>
        </div>
      </div>

      
      {/* Peace & Prosperity Dashboard */}
      {report.peaceIndex && report.prosperityPotential && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-serif mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Emotional Peace Index
            </h4>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * report.peaceIndex) / 100} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-serif text-white">{report.peaceIndex}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">/100</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-4 text-center">Based on Life Path & Personal Year alignment.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-serif mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Prosperity Potential
            </h4>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * report.prosperityPotential) / 100} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-serif text-white">{report.prosperityPotential}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">/100</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-4 text-center">Current material manifestation capacity.</p>
          </div>
        </div>
      )}

      {/* 1. Profile Header block */}
      
      <div className="mb-8">
        <CosmicClockWidget />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 hidden sm:block">
            <ZodiacConstellation dateOfBirth={input.dateOfBirth} />
          </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-500 font-serif">
            Active Professional Reading
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#f5f5f7] uppercase mt-1 tracking-wide">
            {input.fullName}
          </h2>
          <p className="text-zinc-400 text-xs mt-1 flex items-center gap-2 font-sans font-medium">
            <span>DOB: {input.dateOfBirth}</span>
            <span className="text-zinc-300">•</span>
            <span>Current Year Vibe: {metrics.personalYear.number}</span>
          </p>
        </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onMouseEnter={() => playHoverTick()} 
            onClick={() => openGlossary('')}
            className="flex items-center gap-2 glass-panel hover:border-blue-500/40 text-zinc-300 hover:text-[#f5f5f7] text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md"
            title="Open Cosmic Glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Glossary</span>
          </button>
          <button onMouseEnter={() => playHoverTick()} 
            onClick={handleExportPdf}
            className="flex items-center gap-2 glass-panel hover:border-blue-500/40 text-zinc-300 hover:text-[#f5f5f7] text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md"
            id="btn-print-report"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Export PDF</span>
          </button>
          <button onMouseEnter={() => playHoverTick()} 
            onClick={onReset}
            className="flex items-center gap-2 glass-panel hover:border-blue-500/40 text-zinc-300 hover:text-[#f5f5f7] text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md"
            id="btn-recalculate"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* 2. Professional Services Navigation Tabs */}
      <div className="border-b border-white/[0.08] flex flex-wrap gap-1 md:gap-2 overflow-x-auto pb-0.5" id="services-tabs-row">
        {[
          { id: 'profile', label: 'Spiritual Blueprint', icon: Sparkles },
          { id: 'timeline', label: 'Destiny Timeline', icon: Clock },
          { id: 'karmic', label: 'Karmic Ledger', icon: ShieldAlert },
          { id: 'remedies', label: 'Spiritual Remedies', icon: Award },
          { id: 'optimizer', label: 'Signature Optimizer', icon: Type },
          { id: 'compatibility', label: 'Synergy Matcher', icon: Heart },
          { id: 'forecast', label: 'Daily Forecast', icon: TrendingUp },
    { id: 'sectors', label: 'Life Alignment Sectors', icon: Compass },
    { id: 'name_analysis', label: 'Name Analysis', icon: User },
          { id: 'lifestyle', label: 'Lifestyle Vibrations', icon: Home },

        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playTactileClick(); setActiveTab(tab.id as ActiveTab); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}
              className={`flex items-center gap-2 px-4 py-3 text-xs uppercase font-medium tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'border-blue-500 text-blue-500 bg-blue-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-[#f5f5f7] hover:bg-white/[0.03] '
              }`}
              id={`tab-btn-${tab.id}`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Stateful Services Content Grid */}
      <div className="min-h-[50vh]" id="services-tabs-content">
        <AnimatePresence mode="wait">
          
          {/* Tab 1: Spiritual Blueprint */}
          {activeTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Synthesis Summary & Astrological Integration */}
              <div className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden text-left mb-10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 space-y-4">
                    <h3 className="font-serif text-xs uppercase font-bold text-blue-500 tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Executive Summary & Astrological Integration
                    </h3>
                    <p className="text-sm font-sans text-zinc-300 leading-relaxed max-w-3xl">
                      {report.analysisSummary || `As an individual possessing a Life Path of ${metrics.lifePath.number} (${metrics.lifePath.label}) and an Expression of ${metrics.expression.number} (${metrics.expression.label}), your life represents a delicate convergence of active energy and inner potential. Born under the sign of ${report.astrology?.sign || 'Unknown'}, ruled by ${report.astrology?.rulingPlanet || 'Unknown'}, your numerological path is imbued with ${report.astrology?.element?.toLowerCase() || 'Unknown'} elemental qualities.`}
                    </p>
                  </div>
                  
                  
                  <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">
                    
                  <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">
                    {report.astrology && (
                      <div className="glass-panel p-5 rounded-2xl">
                        <h4 className="text-xs font-bold text-zinc-400 tracking-wide uppercase mb-3 border-b border-white/[0.08] pb-2">Astrological Blueprint</h4>
                        <ZodiacConstellation sign={report.astrology.sign} />
                        <ul className="space-y-2 text-xs font-sans">
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Sign</span>
                            <span className="text-blue-500 font-semibold">{report.astrology.sign}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Ruling Planet</span>
                            <span className="text-[#f5f5f7] font-semibold">{report.astrology.rulingPlanet}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Element</span>
                            <span className="text-[#f5f5f7] font-semibold">{report.astrology.element}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    

                    <AstrologicalAspectMap metrics={metrics} />
                  </div>

                    

                  </div>

                </div>
              </div>

              {/* Interactive Milestone Timeline */}
              <MilestoneTimeline 
                pinnacles={pinnacles} 
                challenges={challenges} 
                openGlossary={openGlossary} 
              />

              {/* Numerological Archetype Section */}
              <NumerologicalArchetype 
                metrics={metrics} 
                openGlossary={openGlossary} 
              />

              {/* Core numbers section */}
              <div>
                <h3 className="font-serif text-xs uppercase font-bold text-blue-500 tracking-wider mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Core Five Cosmic Numbers</span>
                </h3>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-5 gap-4" 
                  id="core-numbers-grid"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {coreCards.map((card) => {
                    const m = metrics[card.key] as any;
                    const isActive = activeMetricKey === card.key;
                    const CardIcon = card.icon;

                    return (
                      <motion.div
                        key={card.key}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ 
                          y: -6,
                          scale: 1.025,
                          rotateX: 3,
                          rotateY: -3,
                          borderColor: isActive ? "rgba(59, 130, 246, 0.6)" : "rgba(255, 255, 255, 0.18)",
                          boxShadow: "0 15px 35px -10px rgba(59, 130, 246, 0.25)"
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                        style={{ transformStyle: "preserve-3d" }}
                        onClick={() => {
                          setActiveMetricKey(card.key);
                          // Auto scroll details into view on mobile
                          if (window.innerWidth < 768) {
                            document.getElementById('analysis-detail-panel')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`cursor-pointer rounded-xl p-4 border transition-all text-center relative overflow-hidden flex flex-col justify-between ${
                          isActive 
                            ? 'bg-transparent border-blue-500/50 shadow-lg' 
                            : 'bg-white/[0.03] backdrop-blur-md border-white/[0.08] hover:border-[#404040]'
                        }`}
                        id={`card-core-${card.key}`}
                      >
                        {isActive && (
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900"></div>
                        )}
                        
                        <div className="flex justify-between items-center mb-1">
                          <span className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-transparent text-zinc-400'}`}>
                            <CardIcon className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex items-center gap-1">
                            {'isMaster' in m && m.isMaster && (
                              <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20 rounded-xl font-serif tracking-wide">
                                MASTER
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openGlossary(card.title);
                              }}
                              className="text-zinc-500 hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-white/5 relative z-30"
                              title={`Learn more about ${card.title} in Glossary`}
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="my-2.5">
                          <div className={`font-serif text-4xl tracking-wide ${isActive ? 'text-blue-500' : 'text-[#f5f5f7]'}`}>
                            {m.number}
                          </div>
                        </div>

                        <div>
                          <div className={`text-xs font-bold tracking-wide text-xs uppercase font-serif mb-0.5 ${isActive ? 'text-[#f5f5f7]' : 'text-zinc-400'} flex items-center justify-center gap-1 group/su relative z-20`}>
                            {card.title}
                            {card.key === 'soulUrge' && (
                              <div className="relative inline-flex items-center">
                                <HelpCircle className="w-2.5 h-2.5 text-blue-500 hover:text-[#f5f5f7] transition-colors cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-white/[0.03] backdrop-blur-md border border-blue-500/30 text-xs text-zinc-300 rounded shadow-xl opacity-0 group-hover/su:opacity-100 pointer-events-none transition-opacity z-50 text-left font-sans normal-case tracking-normal hidden group-hover/su:block">
                                  Your Soul Urge (Heart's Desire) reveals your hidden motivations, deepest cravings, and the spiritual intention behind your actions. It is calculated from the vowels in your full birth name.
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-[8px] text-zinc-400 font-sans font-medium uppercase truncate mt-0.5">
                            {card.subtitle}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Detail Panel */}
              <motion.div 
                layoutId="active-panel"
                className="glass-panel p-6 sm:p-8 relative rounded-xl"
                id="analysis-detail-panel"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center justify-center bg-transparent border border-white/[0.08] w-24 h-24 sm:w-32 sm:h-32 rounded-xl shrink-0 self-center md:self-start relative">
                    <div className="absolute inset-2 border border-dashed border-blue-500/20 rounded-xl"></div>
                    <div className="font-serif text-5xl font-light text-blue-500 tracking-wide">
                      {activeMetric.number}
                    </div>
                    {'isMaster' in activeMetric && activeMetric.isMaster && (
                      <div className="absolute -bottom-2 text-[8px] px-2 py-0.5 bg-blue-500 text-[#f5f5f7] font-extrabold tracking-wide text-xs uppercase rounded-xl font-serif">
                        Master
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 w-full text-left">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 font-serif">
                        Core Vibration Analysis
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl font-light text-[#f5f5f7] tracking-wide mt-1 flex flex-wrap items-center gap-2">
                        <span>{activeMetricKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {activeMetric.label}</span>
                        <button 
                          onClick={() => openGlossary(activeMetricKey.replace(/([A-Z])/g, ' $1'))}
                          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-blue-400 hover:text-[#f5f5f7] font-sans border border-blue-500/30 bg-blue-500/5 px-2.5 py-0.5 rounded-full transition-all hover:bg-blue-500/20 cursor-pointer"
                        >
                          <BookOpen className="w-2.5 h-2.5" /> Glossary
                        </button>
                      </h4>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                      {activeMetric.description}
                    </p>

                    {/* Show calculation steps option */}
                    {'calculationSteps' in activeMetric && (
                      <div className="pt-4 border-t border-white/[0.08]">
                        <button onMouseEnter={() => playHoverTick()} 
                          onClick={() => setShowMathSteps(!showMathSteps)}
                          className="flex items-center gap-1.5 text-zinc-400 hover:text-blue-500 text-xs font-sans font-medium tracking-wide focus:outline-none cursor-pointer"
                          id="btn-toggle-math"
                        >
                          {showMathSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>{showMathSteps ? 'Hide Pythagorean Mathematics' : 'Reveal Pythagorean Mathematics'}</span>
                        </button>

                        <AnimatePresence>
                          {showMathSteps && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-3 bg-transparent border border-white/[0.08] rounded-xl p-4 space-y-2 text-left"
                            >
                              <div className="text-xs font-bold text-blue-500/70 tracking-wide text-xs uppercase mb-1.5 font-serif">
                                Pythagorean Reduction Process
                              </div>
                              {activeMetric.calculationSteps?.map((step: string, idx: number) => (
                                <div key={idx} className="text-xs text-zinc-400 font-sans font-medium flex items-start gap-2">
                                  <span className="text-blue-900/70">[{idx + 1}]</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Secondary numbers section */}
              <div>
                <h3 className="font-serif text-xs uppercase font-bold text-blue-500 tracking-wider mb-4">
                  Secondary Vibrational Alignments
                </h3>
                <motion.div 
    className="grid grid-cols-1 md:grid-cols-3 gap-6" 
    id="secondary-numbers-grid"
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >
                  {secondaryCards.map((card) => {
                    const m = metrics[card.key] as any;
                    return (
                      <motion.div
                        key={card.key}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{ 
                          y: -5,
                          scale: 1.02,
                          rotateX: 2,
                          rotateY: -2,
                          borderColor: "rgba(255, 255, 255, 0.16)",
                          boxShadow: "0 12px 24px -10px rgba(59, 130, 246, 0.18)"
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="glass-panel rounded-xl p-5 flex justify-between items-center transition-all text-left"
                        id={`card-secondary-${card.key}`}
                      >
                        <div>
                          <div className="text-xs font-bold tracking-wide text-xs uppercase text-zinc-400 font-serif">
                            {card.title}
                          </div>
                          <div className="text-xs text-zinc-400 font-sans font-medium uppercase mt-0.5">
                            {card.subtitle}
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 pr-2 font-sans">
                            {m.description}
                          </p>
                        </div>
                        <div className="font-serif text-3xl font-light text-blue-500 tracking-wide shrink-0 ml-2">
                          {m.number}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Deep Subconscious Numbers section */}
              <div>
                <h3 className="font-serif text-xs uppercase font-bold text-blue-400 tracking-wider mb-4">
                  Deep Subconscious & Synthesis Matrices
                </h3>
                <motion.div 
    className="grid grid-cols-1 md:grid-cols-2 gap-6" 
    id="deep-numbers-grid"
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >
                  {deepCards.map((card) => {
                    const m = metrics[card.key] as any;
                    return (
                      <motion.div
                        key={card.key}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{ 
                          y: -5,
                          scale: 1.02,
                          rotateX: 2,
                          rotateY: -2,
                          borderColor: "rgba(147, 197, 253, 0.25)",
                          boxShadow: "0 12px 24px -10px rgba(147, 197, 253, 0.15)"
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="bg-transparent border border-white/[0.08]/60 rounded-xl p-5 flex justify-between items-center text-left transition-all"
                        id={`card-deep-${card.key}`}
                      >
                        <div>
                          <div className="text-xs font-bold tracking-wide text-xs uppercase text-blue-300 font-serif">
                            {card.title}
                          </div>
                          <div className="text-xs text-blue-500 font-sans font-medium uppercase mt-0.5">
                            {card.subtitle}
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 pr-2 font-sans">
                            {m.description}
                          </p>
                        </div>
                        <div className="font-serif text-3xl font-light text-blue-400 tracking-wide shrink-0 ml-2">
                          {Array.isArray(m.number) ? m.number.join('/') : m.number}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Planes of Expression and Inclusion Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="cosmic-maps-container">
                {/* Planes of Expression Map */}
                <div className="glass-panel rounded-xl p-6 sm:p-8 text-left">
                  <div className="mb-6">
                    <h4 className="font-serif text-xs uppercase font-semibold text-blue-500 tracking-wider flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      <span>Planes of Expression Map</span>
                    </h4>
                    <p className="text-zinc-400 text-xs font-sans mt-1">
                      Distribution of letters across physical, mental, emotional, and intuitive planes.
                    </p>
                  </div>
                  <div className="space-y-5">
                    {Object.entries(planesOfExpression).map(([key, data]) => {
                      const label = key.charAt(0).toUpperCase() + key.slice(1);
                      const colorMap: Record<string, string> = {
                        physical: 'bg-blue-900',
                        mental: 'bg-blue-500',
                        emotional: 'bg-blue-900/80',
                        intuitive: 'bg-blue-500/80'
                      };
                      const barColor = colorMap[key] || 'bg-blue-500';

                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans font-medium text-zinc-300">{label} Plane</span>
                            <div className="flex items-center gap-1.5 font-sans font-medium">
                              <span className="text-xs text-zinc-400">{data.count} letters</span>
                              <span className="text-slate-600">•</span>
                              <span className={`text-xs px-1.5 py-0.2 rounded-xl font-bold uppercase tracking-wider ${
                                data.intensity === 'High' 
                                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                  : data.intensity === 'Low'
                                    ? 'bg-white/[0.03] backdrop-blur-md text-zinc-400 border border-white/[0.08]'
                                    : 'bg-white/[0.03] backdrop-blur-md/40 text-zinc-400 border border-white/[0.08]/40'
                              }`}>
                                {data.intensity}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-white/[0.03] backdrop-blur-md h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${data.percentage}%` }}
                              className={`h-full ${barColor}`}
                            ></motion.div>
                          </div>
                          <div className="text-xs text-zinc-400 font-sans flex flex-wrap gap-1">
                            <span className="text-zinc-400">Vowels/Consonants mapped:</span>
                            {data.letters.map(letter => (
                              <span key={letter} className="glass-panel px-1.5 py-0.2 rounded-xl text-zinc-400 font-sans font-medium text-xs">{letter}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inclusion Grid */}
                <div className="glass-panel rounded-xl p-6 sm:p-8 text-left">
                  <div className="mb-6">
                    <h4 className="font-serif text-xs uppercase font-semibold text-blue-500 tracking-wider flex items-center gap-2">
                      <Grid className="w-3.5 h-3.5 text-blue-500" />
                      <span>Karmic Inclusion Grid</span>
                    </h4>
                    <p className="text-zinc-400 text-xs font-sans mt-1">
                      Occurrence of each digit 1-9 in your name. 0 counts indicate Karmic Lessons.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 bg-transparent p-4 border border-white/[0.08] rounded-xl max-w-xs mx-auto mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                      const count = inclusionTable[num] || 0;
                      let bg = 'bg-white/[0.03] backdrop-blur-md text-zinc-400 border-white/[0.08]';
                      if (count === 0) {
                        bg = 'bg-red-950/20 text-rose-300 border-red-900/35';
                      } else if (count >= 3) {
                        bg = 'bg-blue-900/10 text-blue-500 border-blue-900/30 font-bold';
                      }

                      return (
                        <div
                          key={num}
                          className={`border rounded-xl p-2 text-center flex flex-col justify-between transition-colors ${bg}`}
                          id={`inclusion-cell-${num}`}
                        >
                          <div className="text-xs font-sans font-medium text-zinc-400 tracking-wide text-xs uppercase">
                            Vibe {num}
                          </div>
                          <div className="font-serif text-xl font-bold my-1">
                            {num}
                          </div>
                          <div className="text-xs font-sans font-medium opacity-80">
                            {count}x occurrences
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center text-xs text-zinc-400 font-sans max-w-xs mx-auto italic">
                    <span className="text-red-400 font-semibold">0 count</span> represents Karmic Lessons. <span className="text-blue-500 font-semibold">3x or more</span> represents abundant Karmic Strengths.
                  </div>
                </div>
              </div>

              {/* Personal Lucky Numbers */}
              <div className="glass-panel p-6 rounded-xl text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <h4 className="font-serif text-xs uppercase font-bold text-blue-500 tracking-wider mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  Personal Lucky Numbers
                </h4>
                <p className="text-xs text-zinc-400 font-sans font-medium tracking-wide text-xs uppercase mb-6">Generated from your Core Pentad Resonance</p>
                
                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                  {Array.from(new Set([
                    metrics.lifePath.number,
                    metrics.expression.number,
                    (metrics.soulUrge.number + 7) % 9 || 9,
                    (metrics.personality.number * 3) % 9 || 9,
                    metrics.personalYear.number
                  ])).slice(0, 5).map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                      className="w-12 h-12 rounded-full border border-blue-500/40 bg-transparent flex items-center justify-center shadow-lg relative group"
                    >
                      <span className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-20"></span>
                      <span className="font-serif text-xl font-bold text-blue-500 group-hover:scale-110 transition-transform">
                        {num}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            
              {/* Life Path Cycles (9-Year Personal Year Cycle) */}
              <div className="glass-panel p-6 rounded-xl space-y-4 mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="font-serif text-lg text-[#f5f5f7] font-light uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Life Path 9-Year Cycle Intensities
                  </h3>
                  <button 
                    onClick={() => openGlossary('Personal Year')}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-blue-400 hover:text-[#f5f5f7] font-sans border border-blue-500/30 bg-blue-500/5 px-2.5 py-1 rounded-full transition-all hover:bg-blue-500/20 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" /> Learn About Personal Years
                  </button>
                </div>
                <div className="h-[280px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lifePathCycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} strokeOpacity={0.4} />
                      <XAxis 
                        dataKey="year" 
                        stroke="#64748b" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 10]}
                      />
                      <RechartsTooltip content={<CustomYearTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="intensity" 
                        name="Personal Year Vibe" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorIntensity)"
                        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Destiny Timeline (Pinnacles & Challenges) */}
          {activeTab === 'timeline' && (
            <motion.div
              key="tab-timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="p-4 bg-blue-500/5 border-l-[3px] border-blue-500 text-zinc-300 rounded-xl">
                <h4 className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif mb-1">
                  Solar Age Pinnacles & Challenges <InfoTooltip text="Pinnacles represent the overarching themes and opportunities of four major periods in your life, calculated from your birth date." />
                </h4>
                <p className="text-xs text-zinc-400">
                  Your life timeline is structured into exactly four massive development cycles. Each cycle possesses a dominant vibration to step into (Pinnacle) and a specific lesson or obstacle to overcome (Challenge).
                </p>
              </div>

              {/* Interactive Life Cycle Map Timeline */}
              <LifeCycleMap 
                pinnacles={pinnacles} 
                challenges={challenges} 
                input={input}
                openGlossary={openGlossary}
              />

              {/* Pinnacles Timeline */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-blue-500 font-light uppercase tracking-wider flex flex-wrap items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>The Four Pinnacle Cycles (Your Stages of Achievement)</span>
                  <button 
                    onClick={() => openGlossary('Pinnacles')}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-blue-400 hover:text-[#f5f5f7] font-sans border border-blue-500/30 bg-blue-500/5 px-2 py-0.5 rounded-full transition-all hover:bg-blue-500/20 cursor-pointer ml-2"
                  >
                    <BookOpen className="w-2.5 h-2.5" /> Glossary
                  </button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {pinnacles.map((p) => (
                    <div key={p.stage} className="glass-panel p-5 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/5 rounded-bl-full flex items-center justify-center font-sans font-medium text-xs text-blue-500/100 font-bold">
                        P{p.stage}
                      </div>
                      <div>
                        <span className="text-xs font-sans font-medium text-zinc-400 tracking-wide text-xs uppercase">
                          {p.ageRange}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#f5f5f7] mt-1">
                          Vibration {p.number}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="mt-4 pt-2 border-t border-white/[0.08]/40 text-xs font-sans font-medium text-blue-500/80 uppercase">
                        Active Stage {p.stage} Focus
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges Timeline */}
              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-lg text-red-400 font-light uppercase tracking-wider flex flex-wrap items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span>The Four Life Challenges (Your Spiritual Obstacles)</span>
                  <button 
                    onClick={() => openGlossary('Challenges')}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-red-400 hover:text-[#f5f5f7] font-sans border border-red-500/30 bg-red-500/5 px-2 py-0.5 rounded-full transition-all hover:bg-red-500/20 cursor-pointer ml-2"
                  >
                    <BookOpen className="w-2.5 h-2.5" /> Glossary
                  </button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {challenges.map((c) => (
                    <div key={c.stage} className="glass-panel p-5 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500/5 rounded-bl-full flex items-center justify-center font-sans font-medium text-xs text-red-400/50 font-bold">
                        C{c.stage}
                      </div>
                      <div>
                        <span className="text-xs font-sans font-medium text-zinc-400 tracking-wide text-xs uppercase">
                          {c.ageRange}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-rose-200 mt-1">
                          Vibration {c.number}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="mt-4 pt-2 border-t border-red-900/10 text-xs font-sans font-medium text-red-400/80 uppercase">
                        Active Trial {c.stage} Lesson
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          
              {/* Tab 3: Karmic Ledger */}
          {activeTab === 'karmic' && (
            <motion.div
              key="tab-karmic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
            >
              {/* Karmic Lessons (Missing Numbers) */}
              <div className="glass-panel rounded-xl p-6 sm:p-8 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-rose-500/20"></div>
                <h4 className="font-serif text-sm uppercase font-semibold text-red-400 tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Karmic Lessons (Vibrational Gaps)</span>
                </h4>
                <p className="text-zinc-400 text-xs font-sans mb-4">
                  These numbers are entirely missing from your birth name. In numerology, this represents attributes or lessons you neglected in previous lives and must consciously practice and build in this one.
                </p>

                {karmicLessons.length === 0 ? (
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
                    <p className="text-blue-500 text-xs font-sans italic font-bold">
                      Fully Balanced Spectrum! Your birth name carries every single digit from 1 to 9. You have no missing karmic lessons.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {karmicLessons.map((l) => (
                      <div key={l.number} className="glass-panel rounded-xl p-3.5 flex gap-3 items-start">
                        <span className="w-6 h-6 shrink-0 flex items-center justify-center bg-rose-500/10 text-red-400 font-bold font-sans font-medium text-xs rounded-xl">
                          {l.number}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-rose-200 uppercase font-sans font-light tracking-tight tracking-wide block">
                            Lesson of the {l.number} Vibration
                          </span>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            {l.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Karmic Debts */}
              <div className="glass-panel rounded-xl p-6 sm:p-8 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/20"></div>
                <h4 className="font-serif text-sm uppercase font-semibold text-blue-500 tracking-wider mb-4 flex flex-wrap items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Karmic Debts (Ancient Obstacles)</span>
                  <button 
                    onClick={() => openGlossary('Karmic Debt')}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-blue-400 hover:text-[#f5f5f7] font-sans border border-blue-500/30 bg-blue-500/5 px-2 py-0.5 rounded-full transition-all hover:bg-blue-500/20 cursor-pointer ml-1"
                  >
                    <BookOpen className="w-2.5 h-2.5" /> Glossary
                  </button>
                  <InfoTooltip text="Karmic Debts (13, 14, 16, 19) indicate burdens brought over from past lives that must be paid back or mastered in this lifetime." />
                </h4>
                <p className="text-zinc-400 text-xs font-sans mb-4">
                  Karmic Debts are heavy, intense patterns derived when any of your core numbers (Life Path, Expression, Soul Urge, Personality) are reduced from the double digits 13, 14, 16, or 19.
                </p>

                {karmicDebts.length === 0 ? (
                  <div className="p-5 border border-dashed border-[#404040] rounded-xl text-center flex flex-col items-center justify-center h-[200px]">
                    <CheckCircle className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-zinc-400 text-xs font-sans font-medium uppercase tracking-wider">
                      Clear Karmic Registry
                    </p>
                    <p className="text-xs text-zinc-400 max-w-xs mt-1">
                      No core numbers carry 13, 14, 16, or 19 before reduction. Your cosmic slate is free of these heavy past-life debt locks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {karmicDebts.map((d, idx) => (
                      <div key={idx} className="glass-panel rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20 rounded-xl font-sans font-medium tracking-wider uppercase">
                            Found in: {d.metricName}
                          </span>
                          <span className="font-serif text-sm font-extrabold text-blue-500">
                            {d.debtNumber}/{d.reducedNumber}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-[#f5f5f7] uppercase font-sans mt-1">
                          {d.label}
                        </h5>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                          {d.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Karmic Remediation (21-Day Protocols) */}
              {karmicDebts.length > 0 && (
                <div className="md:col-span-2 bg-white/[0.03] backdrop-blur-md border border-blue-500/30 rounded-xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <h4 className="font-serif text-sm uppercase font-bold text-blue-500 tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Karmic Remediation: 21-Day Behavioral Protocols
                  </h4>
                  <p className="text-zinc-300 text-xs font-sans mb-6">
                    Balance your active karmic debts by performing these specific, focused exercises for 21 consecutive days. This rewires the energetic blockages associated with your past-life carryovers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {karmicDebts.map((d, idx) => {
                      let protocol = "";
                      if (d.debtNumber === 13) {
                        protocol = "Commit to one complex, multi-step task per day (e.g., deep cleaning, detailed organizing) and finish it completely without shortcuts or complaints.";
                      } else if (d.debtNumber === 14) {
                        protocol = "Practice absolute physical discipline. Stick to a strict sleeping and eating schedule, and abstain from one specific indulgence (sugar, social media, alcohol).";
                      } else if (d.debtNumber === 16) {
                        protocol = "Spend 15 minutes daily in complete silence and solitude. Journal your ego attachments and practice active, ego-destroying humility in interactions.";
                      } else if (d.debtNumber === 19) {
                        protocol = "Perform one anonymous act of service for another person every day, expecting absolutely nothing in return. Resist the urge to do things entirely alone; ask for help once a day.";
                      }
                      
                      return (
                        <div key={`rem-${idx}`} className="bg-transparent border border-white/[0.08] p-5 rounded-xl shadow-md">
                          <h5 className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider mb-2 border-b border-white/[0.08] pb-2">
                            Debt {d.debtNumber}: Action Protocol
                          </h5>
                          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                            {protocol}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab Remedies: Spiritual Remedies */}
          {activeTab === 'remedies' && (
            <motion.div
              key="tab-remedies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="bg-white/[0.03] backdrop-blur-md border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-serif text-xl text-blue-500 tracking-wide text-xs uppercase mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Spiritual Alignment & Remedial Prescriptions
                </h3>
                <p className="text-zinc-400 text-xs font-sans mb-8">
                  Based on your Life Path ({metrics.lifePath.number}), active challenges, and Karmic Debts, the energy engine has mapped your alignment across the five key sectors of existence. Implement these prescriptions to balance blockages and catalyze fulfillment.
                </p>

                {/* Life Alignment Dashboard */}
                {safeReport.spiritualRemedies && (
                  <div className="mb-10">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2 font-serif flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      Life Alignment Dashboard
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {safeReport.spiritualRemedies.map((sec: any, idx: number) => {
                        const isSevere = sec.alignmentScore < 50;
                        const isLow = sec.alignmentScore < 70;
                        const scoreColor = isSevere ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500';
                        const textColor = isSevere ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400';
                        
                        let SectorIcon = Award;
                        if (sec.sector.includes('Career')) SectorIcon = Briefcase;
                        else if (sec.sector.includes('Love')) SectorIcon = Heart;
                        else if (sec.sector.includes('Wealth')) SectorIcon = TrendingUp;
                        else if (sec.sector.includes('Health')) SectorIcon = Activity;
                        else if (sec.sector.includes('Spiritual')) SectorIcon = Moon;

                        return (
                          <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col justify-between border border-white/[0.04]">
                            <div className="flex items-center gap-2 mb-3">
                              <SectorIcon className={`w-4 h-4 ${textColor}`} />
                              <span className="text-[10px] font-sans font-bold uppercase text-zinc-300 tracking-wider line-clamp-1">{sec.sector}</span>
                            </div>
                            <div className="flex items-end justify-between mb-2">
                              <span className={`text-2xl font-serif font-bold ${textColor}`}>{sec.alignmentScore}%</span>
                              <span className="text-[9px] uppercase font-bold text-zinc-500 mb-1">{isSevere ? 'Weak' : isLow ? 'Moderate' : 'Strong'}</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${scoreColor} transition-all duration-1000`} style={{ width: `${sec.alignmentScore}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}



                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2 font-serif flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Actionable Sector Protocols
                </h4>
                <div className="space-y-6">
                  {safeReport.spiritualRemedies && safeReport.spiritualRemedies.map((sec: any, idx: number) => {
                    const isLow = sec.alignmentScore < 70;
                    const isSevere = sec.alignmentScore < 50;
                    
                    // Determine sector icon
                    let SectorIcon = Award;
                    if (sec.sector.includes('Career')) SectorIcon = Briefcase;
                    else if (sec.sector.includes('Love')) SectorIcon = Heart;
                    else if (sec.sector.includes('Wealth')) SectorIcon = TrendingUp;
                    else if (sec.sector.includes('Health')) SectorIcon = Activity;
                    else if (sec.sector.includes('Spiritual')) SectorIcon = Moon;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="glass-panel p-6 rounded-xl border border-white/[0.06] hover:border-blue-500/30 transition-all duration-300"
                      >
                        {/* Sector Header & Scale */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-950/40 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-400">
                              <SectorIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg text-white tracking-wide">{sec.sector}</h4>
                              <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider ${isSevere ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isSevere ? 'Significant Obstacles Detected' : isLow ? 'Moderate Vibrational Blockage' : 'Highly Harmonized Alignment'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Scale / Gauge Bar */}
                          <div className="w-full md:w-64 space-y-1.5">
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                              <span>Vibrational Flow</span>
                              <span className={isSevere ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}>
                                {sec.alignmentScore}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sec.alignmentScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${isSevere ? 'bg-gradient-to-r from-rose-600 to-rose-400' : isLow ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Challenge Text */}
                        <p className="text-zinc-300 text-xs leading-relaxed mb-6 italic bg-white/[0.02] px-4 py-3 rounded-lg border border-white/[0.04]">
                          {sec.challengeText}
                        </p>

                        {/* Actionable Remedies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Color Remedy */}
                          <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                                <Globe className="w-3.5 h-3.5" />
                                <span>Spectral Aura Remedy</span>
                              </div>
                              <span className="text-white font-serif font-bold text-sm block mb-1">{sec.colorRemedy.color}</span>
                              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">{sec.colorRemedy.vibration}</p>
                            </div>
                            <div className="pt-2 border-t border-white/[0.04] text-[10px] text-zinc-500 leading-normal">
                              <span className="font-bold text-zinc-400">Integration:</span> {sec.colorRemedy.practice}
                            </div>
                          </div>

                          {/* Sacred Practice */}
                          <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Sacred Daily Ritual</span>
                              </div>
                              <span className="text-white font-serif font-bold text-sm block mb-1">{sec.sacredPractice.title}</span>
                              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">{sec.sacredPractice.instructions}</p>
                            </div>
                            <div className="pt-2 border-t border-white/[0.04] text-[10px] text-zinc-500 leading-normal">
                              <span className="font-bold text-zinc-400">Frequency:</span> {sec.sacredPractice.frequency}
                            </div>
                          </div>

                          {/* Sanskrit Mantra */}
                          <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Sanskrit Mantra Vibration</span>
                              </div>
                              <div className="bg-emerald-950/30 border border-emerald-500/20 px-3 py-2 rounded-lg text-center mb-2">
                                <span className="text-emerald-300 font-serif font-bold text-xs tracking-wide block leading-snug">{sec.mantra.sanskrit}</span>
                              </div>
                              <p className="text-zinc-400 text-[10px] leading-relaxed mb-3 italic">"{sec.mantra.englishTranslation}"</p>
                            </div>
                            <div className="pt-2 border-t border-white/[0.04] text-[10px] text-zinc-500 leading-normal">
                              <span className="font-bold text-zinc-400">Aura Impact:</span> {sec.mantra.benefits}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                
                {/* Current Phase Prescriptions */}
                {safeReport.remedies && safeReport.remedies.length > 0 && (
                  <div className="mt-10 mb-10">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2 font-serif flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      Active Life Phase Remedial Prescriptions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeReport.remedies.map((remedy: any, idx: number) => (
                        <div key={idx} className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl">
                          <h5 className="font-serif text-[11px] uppercase tracking-wider text-emerald-400 mb-2">{remedy.category}</h5>
                          <p className="text-zinc-300 text-xs leading-relaxed font-sans">{remedy.advice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crystal Resonance Matrix */}
                {safeReport.masterCrystals && (
                  <div className="mt-10">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2 font-serif flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Crystal Resonance Matrix
                    </h4>
                    <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed max-w-3xl">
                      Crystals hold stable vibrational frequencies. By introducing these specific minerals into your auric field, you can organically neutralize the numerological deficiencies highlighted in your alignment dashboard. These primary recommendations are mathematically mapped to your core vibrational signature.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeReport.masterCrystals.map((crystal: any, idx: number) => (
                        <div key={idx} className="bg-purple-950/10 border border-purple-500/20 p-5 rounded-xl hover:border-purple-500/40 transition-colors flex flex-col justify-between relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                          <div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                              <h5 className="font-serif text-lg text-purple-300">{crystal.name}</h5>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-purple-400/60 bg-purple-900/30 px-2 py-1 rounded">
                                {idx === 0 ? 'Career Resonance' : idx === 1 ? 'Relational Resonance' : idx === 2 ? 'Vitality Resonance' : idx === 3 ? 'Wealth Resonance' : idx === 4 ? 'Spiritual Resonance' : idx === 5 ? 'Active Phase Resonance' : 'Karmic Resonance'}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-300 leading-relaxed mb-3 font-sans relative z-10">
                              {crystal.benefits}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-purple-500/10 text-[10px] text-purple-200/60 leading-normal relative z-10">
                            <span className="font-bold text-purple-300">Resonance Protocol:</span> {crystal.methodOfUse}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 4: Signature Optimizer */}
          {activeTab === 'optimizer' && (
            <motion.div
              key="tab-optimizer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left animate-fade-in"
            >
              <div className="p-5 bg-blue-900/5 border border-blue-900/20 rounded-xl">
                <h4 className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-500" />
                  <span>Signature & Spelling Tuning Suite</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Real professional numerologists charge high fees to optimize the letters in your name (e.g. signature variations, business name ideas, pen names) to eliminate Karmic Lessons or adjust your Expression to resonate with your Life Path. Test spelling modifications below in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Input form panel */}
                <div className="lg:col-span-5 glass-panel p-6 rounded-xl">
                  <form onSubmit={handleTestSpelling} className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-wide text-xs uppercase text-zinc-400 mb-2 font-sans font-medium">
                        Test Alternative Spelling
                      </label>
                      <input
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="e.g., JON MORGAN"
                        className="w-full glass-panel focus:border-blue-500 rounded-xl py-3.5 px-4 text-[#f5f5f7] placeholder-[#404040] focus:outline-none transition-colors text-xs font-sans font-medium uppercase"
                      />
                    </div>
                    <button onMouseEnter={() => playHoverTick()} 
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-500 text-[#f5f5f7] font-serif font-bold tracking-wider text-xs uppercase py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#f5f5f7]" />
                      <span>Assess New Vibe</span>
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-white/[0.08] text-zinc-400 text-xs leading-relaxed">
                    <p className="font-bold text-zinc-400 uppercase text-xs tracking-wider mb-1.5">How to align:</p>
                    <ul className="space-y-1 list-disc pl-4 font-sans">
                      <li>Try adding or removing a silent letter (e.g. 'n', 'a', 'h')</li>
                      <li>Try using your first and last name only, or adding middle initials</li>
                      <li>Aim to match your Expression Number to your Life Path Number ({metrics.lifePath.number}) for absolute destiny alignment</li>
                    </ul>
                  </div>
                </div>

                {/* Results display panel */}
                <div className="lg:col-span-7">
                  {!optimizerReport ? (
                    <div className="bg-white/[0.03] backdrop-blur-md border border-dashed border-[#404040] rounded-xl p-8 text-center flex flex-col items-center justify-center h-[300px]">
                      <Type className="w-8 h-8 text-zinc-400 mb-2" />
                      <p className="text-zinc-400 text-xs font-sans font-medium uppercase tracking-wider">
                        Awaiting Optimized Input
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xs mt-1">
                        Enter an alternative spelling on the left to see how its letters adjust your cosmic vibration spectrum.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h4 className="text-xs uppercase font-bold text-[#f5f5f7] tracking-wider font-sans font-medium">
                        Vibrational Shift Matrix
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { 
                            title: 'Expression (Destiny)', 
                            orig: metrics.expression.number, 
                            opt: optimizerReport.metrics.expression.number,
                            isCore: true
                          },
                          { 
                            title: 'Soul Urge (Desire)', 
                            orig: metrics.soulUrge.number, 
                            opt: optimizerReport.metrics.soulUrge.number,
                            isCore: false
                          },
                          { 
                            title: 'Personality (Aura)', 
                            orig: metrics.personality.number, 
                            opt: optimizerReport.metrics.personality.number,
                            isCore: false
                          }
                        ].map((mShift, idx) => {
                          const changes = mShift.orig !== mShift.opt;
                          return (
                            <div key={idx} className="glass-panel p-4 rounded-xl">
                              <span className="text-xs uppercase font-bold text-zinc-400 font-sans block truncate">
                                {mShift.title}
                              </span>
                              <div className="flex items-center justify-between mt-3">
                                <div className="text-center">
                                  <span className="text-[8px] font-sans font-medium uppercase text-zinc-400 block">Current</span>
                                  <span className="font-serif text-2xl text-zinc-400 block mt-0.5">{mShift.orig}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                <div className="text-center">
                                  <span className="text-[8px] font-sans font-medium uppercase text-blue-500 block">Optimized</span>
                                  <span className={`font-serif text-2xl block mt-0.5 font-bold ${changes ? 'text-blue-500' : 'text-zinc-300'}`}>{mShift.opt}</span>
                                </div>
                              </div>
                              {mShift.isCore && mShift.opt === metrics.lifePath.number && (
                                <div className="mt-3 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-1 px-1.5 rounded-xl uppercase text-center font-bold">
                                  Absolute Alignment!
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Karmic Shifts comparison */}
                      <div className="glass-panel p-5 rounded-xl space-y-4">
                        <h5 className="text-xs tracking-wide text-xs uppercase font-sans font-medium text-zinc-400">
                          Spiritual Shift Log
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Karmic lessons change */}
                          <div>
                            <span className="text-xs font-sans font-medium text-zinc-400 uppercase block mb-1">Karmic Lessons:</span>
                            <div className="space-y-1">
                              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                                <span className="font-semibold text-rose-300">Original:</span>
                                {karmicLessons.length === 0 ? 'None' : karmicLessons.map(l => l.number).join(', ')}
                              </div>
                              <div className="text-xs text-zinc-200 flex items-center gap-1.5">
                                <span className="font-semibold text-blue-500">Optimized:</span>
                                {optimizerReport.karmicLessons.length === 0 ? 'None (Perfect!)' : optimizerReport.karmicLessons.map(l => l.number).join(', ')}
                              </div>
                            </div>
                          </div>

                          {/* Karmic Debts change */}
                          <div>
                            <span className="text-xs font-sans font-medium text-zinc-400 uppercase block mb-1">Karmic Debts:</span>
                            <div className="space-y-1">
                              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                                <span className="font-semibold text-rose-300">Original:</span>
                                {karmicDebts.length === 0 ? 'None' : karmicDebts.map(d => d.debtNumber).join(', ')}
                              </div>
                              <div className="text-xs text-zinc-200 flex items-center gap-1.5">
                                <span className="font-semibold text-blue-500">Optimized:</span>
                                {optimizerReport.karmicDebts.length === 0 ? 'None (Clean slate!)' : optimizerReport.karmicDebts.map(d => d.debtNumber).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary analysis */}
                        <div className="pt-3 border-t border-white/[0.08]/40 text-xs text-zinc-400 leading-relaxed font-sans">
                          {optimizerReport.metrics.expression.number === metrics.lifePath.number ? (
                            <p className="text-emerald-400">
                              <CheckCircle className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                              This new spelling creates an <strong>absolute vibration match</strong> between your destiny tools and Life Path destination. Excellent for signatures, public usernames, or professional brand naming!
                            </p>
                          ) : (
                            <p>
                              Your new spelling reduces to Expression <strong>{optimizerReport.metrics.expression.number}</strong> ({optimizerReport.metrics.expression.label}). Compares to your current destiny tool of <strong>{metrics.expression.number}</strong>.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 5: Synergy Compatibility */}
          {activeTab === 'compatibility' && (
            <motion.div
              key="tab-compatibility"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="p-5 bg-blue-500/5 border border-blue-500/25 rounded-xl">
                <h4 className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span>Interactive Synastry & Relationship Compatibility Calculator</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Real numerologists evaluate love, business, or friendship compatibility by cross-reducing the primary strings of both individuals. This tool aligns your primary and secondary pathways against a companion to determine romantic or enterprise synergy.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Input form */}
                <div className="lg:col-span-5 glass-panel p-6 rounded-xl">
                  <form onSubmit={handleTestCompatibility} className="space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-sans font-medium">
                        Companion Name
                      </label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="e.g., EMILY JANE WATSON"
                        className="w-full glass-panel focus:border-blue-500 rounded-xl py-3.5 px-4 text-[#f5f5f7] placeholder-[#404040] focus:outline-none transition-colors text-xs font-sans font-medium uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-sans font-medium">
                        Companion DOB (Birth Anchor)
                      </label>
                      <input
                        type="date"
                        value={partnerDob}
                        onChange={(e) => setPartnerDob(e.target.value)}
                        className="w-full glass-panel focus:border-blue-500 rounded-xl py-3.5 px-4 text-[#f5f5f7] focus:outline-none transition-colors text-xs font-sans font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-sans font-medium">
                        Relationship dynamic lens
                      </label>
                      <div className="relative">
                        <select
                          value={relType}
                          onChange={(e) => setRelType(e.target.value as any)}
                          className="w-full glass-panel focus:border-blue-500 rounded-xl py-3.5 px-4 text-[#f5f5f7] focus:outline-none transition-colors text-xs font-sans font-medium appearance-none cursor-pointer"
                        >
                          <option className="bg-zinc-900 text-zinc-100" value="Spouse">Spouse & Marriage (Romantic)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Dating">Dating & Early Romance (Passionate Spark)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Business">Business Partner & Executive (Professional)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Mentor">Mentor & Spiritual Guide (Guiding)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Friend">Close Friend & Creative Peer (Platonic)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Family">Family Bond & Kinship (Familial)</option>
                          <option className="bg-zinc-900 text-zinc-100" value="Rival">Karmic Catalyst & Rival (Challenging)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <button onMouseEnter={() => playHoverTick()} 
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-500 text-[#f5f5f7] font-serif font-bold tracking-wider text-xs uppercase py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-[#f5f5f7] shrink-0" />
                      <span>Assess Synergy Match</span>
                    </button>
                  </form>
                </div>

                {/* Compatibility Results */}
                <div className="lg:col-span-7">
                  {!compatResult ? (
                    <div className="bg-white/[0.03] backdrop-blur-md border border-dashed border-[#404040] rounded-xl p-8 text-center flex flex-col items-center justify-center h-[320px]">
                      <Heart className="w-8 h-8 text-zinc-400 mb-2 animate-pulse" />
                      <p className="text-zinc-400 text-xs font-sans font-medium uppercase tracking-wider">
                        Awaiting Partner Credentials
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xs mt-1">
                        Enter your romantic, family, or business partner's birth coordinates on the left to activate the synergy engine.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Warnings panel */}
                      {compatResult.warnings && compatResult.warnings.length > 0 && (
                         <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                           <div className="flex items-center gap-2 text-rose-400 text-xs uppercase font-bold tracking-wider font-serif">
                             <AlertTriangle className="w-4 h-4 text-rose-500" />
                             <span>Karmic Warnings Detected</span>
                           </div>
                           <ul className="list-disc pl-5 space-y-1">
                             {compatResult.warnings.map((w: string, i: number) => (
                               <li key={i} className="text-xs text-rose-200/80 leading-relaxed font-sans">{w}</li>
                             ))}
                           </ul>
                         </div>
                      )}

                      {/* Mirror Effect Friction Alert */}
                      {compatResult.mirrorEffectAlert && (
                        <div className="p-5 bg-rose-950/25 border border-rose-500/30 rounded-xl space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
                          <div className="flex items-center gap-2 text-rose-400 text-xs uppercase font-bold tracking-wider font-serif">
                            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse shrink-0" />
                            <span>Mirror Effect Friction Alert</span>
                          </div>
                          <h5 className="font-serif text-sm text-rose-300">{compatResult.mirrorEffectAlert.title}</h5>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                            {compatResult.mirrorEffectAlert.description}
                          </p>
                        </div>
                      )}

                      {/* Cautionary Insight */}
                      {compatResult.cautionaryInsights && compatResult.cautionaryInsights.length > 0 && (
                         <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-2">
                           <div className="flex items-center gap-2 text-orange-400 text-xs uppercase font-bold tracking-wider font-serif">
                             <AlertTriangle className="w-4 h-4" />
                             <span>Cautionary Insight: Karmic Dissonance</span>
                           </div>
                           <ul className="list-disc pl-5 space-y-1">
                             {compatResult.cautionaryInsights.map((w: string, i: number) => (
                               <li key={i} className="text-xs text-orange-200/80 leading-relaxed font-sans">{w}</li>
                             ))}
                           </ul>
                         </div>
                      )}

                      {/* Overall Synergy Index */}
                      <div className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0 relative">
                          {/* SVG Gauge */}
                          <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                            <circle cx="50%" cy="50%" r="40%" stroke="#2a2a2a" strokeWidth="8%" fill="none" />
                            <circle 
                              cx="50%" cy="50%" r="40%" 
                              stroke={(compatResult?.score || 0) >= 70 ? "#10b981" : (compatResult?.score || 0) >= 50 ? "#f59e0b" : "#ef4444"} 
                              strokeWidth="8%" 
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}%`}
                              strokeDashoffset={`${(2 * Math.PI * 40) - ((compatResult?.score || 0) / 100) * (2 * Math.PI * 40)}%`}
                              className="transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className={`font-serif text-3xl font-bold relative z-10 ${(compatResult?.score || 0) >= 70 ? 'text-emerald-400' : (compatResult?.score || 0) >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {compatResult?.score || 0}%
                          </span>
                          <span className="text-[8px] font-sans font-medium text-zinc-400 uppercase absolute -bottom-2 bg-white/[0.03] backdrop-blur-md px-1 z-10 rounded">
                            SYNERGY
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs uppercase font-bold tracking-wider text-blue-500 font-serif block">
                              Cosmic Match Result ({relType} Lens)
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 font-sans font-medium uppercase">
                            Target Partner: {compatResult.partnerName}
                          </p>
                          <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-sans">
                            {compatResult.overallSynergy}
                          </p>
                        </div>
                      </div>

                      {/* Karmic Balance Section */}
                      {compatResult.karmicBalance && (
                        <div className="glass-panel p-6 rounded-xl border border-blue-500/20 relative overflow-hidden bg-gradient-to-br from-blue-950/20 to-indigo-950/20">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.06] mb-4">
                            <div className="flex items-center gap-2.5">
                              <Globe className="w-5 h-5 text-indigo-400" />
                              <div>
                                <h4 className="font-serif text-base text-white">Karmic Connection Balance</h4>
                                <span className="text-[10px] text-indigo-300 font-sans uppercase font-bold tracking-wider">
                                  Bond Profile: {compatResult?.karmicBalance?.connectionType || 'Unknown'}
                                </span>
                              </div>
                            </div>
                            <div className="bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                              <span className="text-[9px] font-sans text-indigo-300 uppercase block tracking-wider font-semibold">Balance Index</span>
                              <span className="text-lg font-serif font-bold text-white">{compatResult?.karmicBalance?.score || 0}/100</span>
                            </div>
                          </div>
                          
                          <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-sans italic">
                            {compatResult.karmicBalance.description}
                          </p>

                          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Karmic Contracts & Teachings:</span>
                            <ul className="space-y-1.5 pl-1">
                              {compatResult.karmicBalance.lessons.map((lesson: string, lIdx: number) => (
                                <li key={lIdx} className="text-xs text-zinc-300 leading-relaxed font-sans flex items-start gap-2">
                                  <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                                  <span>{lesson}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Radar Chart for 7 Dimensions */}
                      {compatResult.radarData && compatResult.radarData.length > 0 && (
                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center">
                          <span className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif mb-1 block w-full text-center">
                            7-Axis Synergy spectrum Map
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sans mb-4 block w-full text-center">
                            Hover over any vertex to reveal specialized explanations
                          </span>
                          <div className="w-full h-[280px] sm:h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={compatResult?.radarData || []}>
                                <PolarGrid stroke="#3f3f46" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'sans-serif' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Synergy" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                                <RechartsTooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-black/95 border border-blue-500/40 p-3 rounded-lg max-w-xs shadow-2xl backdrop-blur-md">
                                          <p className="text-xs font-serif font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                            <span>{data?.subject || 'Unknown'}</span>
                                            <span className="text-white bg-blue-900/40 px-1.5 py-0.5 rounded text-[10px]">{data?.score || 0}%</span>
                                          </p>
                                          <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                                            {data?.explanation || ''}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }} 
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Category Recommendations */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { key: 'romance', label: 'Romantic & Emotional', icon: <Heart className="w-4 h-4" /> },
                          { key: 'friendship', label: 'Platonic & Friendship', icon: <Sparkles className="w-4 h-4" /> },
                          { key: 'business', label: 'Business & Professional', icon: <Briefcase className="w-4 h-4" /> }
                        ].map((cat) => {
                          const data = compatResult?.recommendations?.[cat.key as keyof typeof compatResult.recommendations];
                          let colorClass = "text-emerald-400";
                          let bgClass = "bg-emerald-500/10 border-emerald-500/20";
                          if (data && (data.score || 0) < 50) {
                            colorClass = "text-rose-400";
                            bgClass = "bg-rose-500/10 border-rose-500/20";
                          } else if (data && (data.score || 0) < 75) {
                            colorClass = "text-amber-400";
                            bgClass = "bg-amber-500/10 border-amber-500/20";
                          }
                          
                          if (!data) return null;
                          
                          return (
                            <div key={cat.key} className={`p-4 rounded-xl border ${bgClass} flex flex-col items-center text-center justify-between`}>
                              <div className="flex flex-col items-center">
                                <div className={`${colorClass} mb-2`}>{cat.icon}</div>
                                <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider block">{cat.label}</span>
                                <span className={`text-lg font-serif font-bold ${colorClass} my-1`}>{data.score || 0}%</span>
                              </div>
                              <span className={`text-[9px] uppercase font-bold tracking-wider ${colorClass}`}>{data.label || ''}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detail points */}
                      <div className="space-y-4">
                        {[
                          { title: 'Life Path Integration (Sovereign Paths)', desc: compatResult.matchDetails.lifePath },
                          { title: 'Soul Urge Connection (Inner Hearts)', desc: compatResult.matchDetails.soulUrge },
                          { title: 'Expression Alignment (Active Cooperation)', desc: compatResult.matchDetails.expression },
                          { title: 'Destiny Trajectory (Long-Term Goals)', desc: compatResult.matchDetails.destiny },
                          { title: 'Karmic Friction (Lessons & Debts)', desc: compatResult.matchDetails.karmic }
                        ].map((detail, idx) => (
                          <div key={idx} className="glass-panel p-4 rounded-xl text-left relative overflow-hidden">
                            <span className="text-xs uppercase font-bold text-blue-500 font-sans block mb-1">
                              {detail.title}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{detail.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 6: Forecast */}
          {activeTab === 'forecast' && (
            <motion.div
              key="tab-forecast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="p-4 bg-blue-500/5 border-l-[3px] border-blue-500 text-zinc-300 rounded-xl">
                <h4 className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif mb-1">
                  Chronological Vibe Tracking (Personal Solar Waves)
                </h4>
                <p className="text-xs text-zinc-400">
                  Real numerologists trace timing. While your Life Path never changes, the sun cycle creates yearly, monthly, and daily shifts that alter your active opportunities. Align your actions with today's wave!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year */}
                <div className="glass-panel p-6 rounded-xl relative flex flex-col justify-between h-[240px]">
                  <div>
                    <span className="text-[8px] font-sans font-medium text-zinc-400 tracking-wide text-xs uppercase block">
                      CYCLE YEAR LAYER
                    </span>
                    <h4 className="font-serif text-3xl font-light text-blue-500 mt-2">
                      Personal Year {metrics.personalYear.number}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-3 leading-relaxed line-clamp-4">
                      {metrics.personalYear.description}
                    </p>
                  </div>
                  <div className="text-xs font-sans font-medium text-zinc-400 uppercase mt-4">
                    Theme for {metrics.personalYear.year}
                  </div>
                </div>

                {/* Month */}
                <div className="glass-panel p-6 rounded-xl relative flex flex-col justify-between h-[240px]">
                  <div>
                    <span className="text-[8px] font-sans font-medium text-zinc-400 tracking-wide text-xs uppercase block">
                      CYCLE MONTH LAYER
                    </span>
                    <h4 className="font-serif text-3xl font-light text-[#f5f5f7] mt-2">
                      Personal Month {metrics.personalMonth.number}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-3 leading-relaxed line-clamp-4">
                      {metrics.personalMonth.description}
                    </p>
                  </div>
                  <div className="text-xs font-sans font-medium text-zinc-400 uppercase mt-4">
                    Active monthly trend
                  </div>
                </div>

                {/* Day */}
                <div className="glass-panel p-6 rounded-xl relative flex flex-col justify-between h-[240px] border-blue-500/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                  <div>
                    <span className="text-[8px] font-sans font-medium text-blue-500 tracking-wide text-xs uppercase block font-bold">
                      TODAY'S INSTANT ENERGY
                    </span>
                    <h4 className="font-serif text-3xl font-bold text-blue-500 mt-2">
                      Personal Day {metrics.personalDay.number}
                    </h4>
                    <p className="text-xs text-zinc-200 mt-3 leading-relaxed font-sans line-clamp-4">
                      {metrics.personalDay.description}
                    </p>
                  </div>
                  <div className="text-xs font-sans font-medium text-blue-500 uppercase mt-4 font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Today's active vibration</span>
                  </div>
                </div>
              </div>

              {/* Gemini Horoscope Block */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-blue-500/20 p-6 rounded-xl mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <h3 className="font-serif text-sm tracking-wide text-xs uppercase text-blue-500 font-bold">
                    Numerologist AI Daily Horoscope
                  </h3>
                </div>
                {isLoadingHoroscope ? (
                  <div className="flex items-center gap-3 text-zinc-400 font-sans font-medium text-xs animate-pulse py-8">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    Consulting the oracle for today's alignments...
                  </div>
                ) : dailyHoroscope ? (
                  <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
                    {dailyHoroscope.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 font-sans font-medium">Unable to retrieve daily reading.</p>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      
          
          
          {/* Tab: Name Resonance & Esoteric Letters Analysis */}
          {activeTab === 'name_analysis' && (
            <motion.div
              key="tab-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              {report.nameAnalysis && (
                <div className="space-y-8">
                  {/* 1. Core Expression & Chaldean Details */}
                  <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <h4 className="text-xs uppercase font-bold text-[#f5f5f7] tracking-wider font-serif mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Name Resonance & Compound Frequency
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-white/5 text-center">
                        <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(59,130,246,0.15)] animate-celestial-float">
                          <span className="text-4xl font-serif text-blue-400 font-bold">{report.nameAnalysis.currentExpression}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1">Pythagorean Expression</span>
                        <span className="text-xs text-blue-400 font-serif font-semibold italic">Talents & Capabilities</span>
                      </div>

                      <div className="lg:col-span-8 space-y-4">
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">Esoteric Name Synthesis</h5>
                          <p className="text-sm text-zinc-300 font-sans leading-relaxed">{report.nameAnalysis.insight}</p>
                        </div>

                        {report.nameAnalysis.chaldeanSum && (
                          <div className="p-4 bg-blue-950/10 border border-blue-500/20 rounded-xl">
                            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold block mb-1">Chaldean Compound Vibe {report.nameAnalysis.chaldeanSum}</span>
                            <p className="text-xs text-zinc-300 font-sans leading-normal">
                              The Chaldean compound number is the physical and material energy your name carries.
                              <strong> Meaning:</strong> {report.nameAnalysis.chaldeanMeaning}
                            </p>
                          </div>
                        )}

                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2 font-bold">Optimization Suggestion</span>
                          <p className="text-xs text-slate-400 font-serif italic leading-relaxed">{report.nameAnalysis.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Three Pillars of the First Name: Cornerstone, Capstone, First Vowel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cornerstone */}
                    {report.nameAnalysis.cornerstone && (
                      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/5 hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-blue-400 font-mono block"> Esoteric Pillar 1 </span>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-[#f5f5f7] font-serif mt-0.5">The Cornerstone</h5>
                          </div>
                          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center font-serif text-xl text-blue-400 font-bold shadow-inner">
                            {report.nameAnalysis.cornerstone}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans flex-1">
                          The Cornerstone is the first letter of your first name. It establishes your fundamental character, how you approach life's opportunities, and how you react to immediate obstacles at the start of any new project.
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/[0.05] bg-black/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Cornerstone Vibe</span>
                          <p className="text-xs text-zinc-300 font-serif italic leading-normal">{report.nameAnalysis.cornerstoneMeaning}</p>
                        </div>
                      </div>
                    )}

                    {/* Capstone */}
                    {report.nameAnalysis.capstone && (
                      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/5 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono block"> Esoteric Pillar 2 </span>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-[#f5f5f7] font-serif mt-0.5">The Capstone</h5>
                          </div>
                          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center font-serif text-xl text-emerald-400 font-bold shadow-inner">
                            {report.nameAnalysis.capstone}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans flex-1">
                          The Capstone is the final letter of your first name. It dictates how you finish what you start, your approach to completing projects, your follow-through, and your ultimate reaction once a goal is successfully attained.
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/[0.05] bg-black/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Capstone Vibe</span>
                          <p className="text-xs text-zinc-300 font-serif italic leading-normal">{report.nameAnalysis.capstoneMeaning}</p>
                        </div>
                      </div>
                    )}

                    {/* First Vowel */}
                    {report.nameAnalysis.firstVowel && (
                      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/5 hover:border-purple-500/20 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-purple-400 font-mono block"> Esoteric Pillar 3 </span>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-[#f5f5f7] font-serif mt-0.5">The First Vowel</h5>
                          </div>
                          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center font-serif text-xl text-purple-400 font-bold shadow-inner">
                            {report.nameAnalysis.firstVowel}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans flex-1">
                          The First Vowel of your first name is a powerful emotional key. It reveals your deep-seated, instinctive reaction to sudden surprises, unexpected events, and emotional situations before your mind takes over.
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/[0.05] bg-black/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">First Vowel Vibe</span>
                          <p className="text-xs text-zinc-300 font-serif italic leading-normal">{report.nameAnalysis.firstVowelMeaning}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Soul Urge and Personality sub-resonance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Vowel Distribution (Soul Urge)</span>
                      <h5 className="text-sm font-semibold font-serif text-blue-400 mb-2">Vowel Core Sum: {report.nameAnalysis.vowelSum}</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Vowels contain the emotional and spiritual core of your name. With a vowel sum of {report.nameAnalysis.vowelSum}, your soul deeply craves the vibrational energies of this specific root frequency. It acts as the driver for your internal motivation and what makes you truly happy behind closed doors.
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono block mb-1">Consonant Distribution (Personality)</span>
                      <h5 className="text-sm font-semibold font-serif text-emerald-400 mb-2">Consonant Core Sum: {report.nameAnalysis.consonantSum}</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Consonants represent the outer shell of your name—your personality vibration. With a consonant sum of {report.nameAnalysis.consonantSum}, this is the magnetic frequency others feel when they meet you. It shapes your outer aura, your clothing preferences, and your first impression.
                      </p>
                    </div>
                  </div>

                  {/* 4. Complete Letter-by-Letter Vibration Matrix */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4" id="name-vibration-matrix-container">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <h5 className="text-xs uppercase font-bold tracking-widest text-zinc-100 font-mono">Letter-by-Letter Vibrational Matrix</h5>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This master matrix breaks down every single letter of your full birth name (<strong>{report.input.fullName}</strong>). In sacred numerology, each letter acts as a conduit of a specific plane of expression and numerical value, casting a micro-vibration over your daily thoughts, actions, and destiny.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/30">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-zinc-500 uppercase font-mono tracking-wider text-[10px] bg-white/[0.02]">
                            <th className="py-3 px-4">Letter</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Pythagorean Vibe</th>
                            <th className="py-3 px-4">Chaldean Vibe</th>
                            <th className="py-3 px-4">Plane of Expression</th>
                            <th className="py-3 px-4">Astrological Rule</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {report.input.fullName.toUpperCase().split('').map((char, index) => {
                            if (/[^A-Z]/.test(char)) return null; // skip spaces/hyphens
                            
                            const isVowel = ['A','E','I','O','U'].includes(char);
                            const pythVal = {
                              A: 1, J: 1, S: 1,
                              B: 2, K: 2, T: 2,
                              C: 3, L: 3, U: 3,
                              D: 4, M: 4, V: 4,
                              E: 5, N: 5, W: 5,
                              F: 6, O: 6, X: 6,
                              G: 7, P: 7, Y: 7,
                              H: 8, Q: 8, Z: 8,
                              I: 9, R: 9
                            }[char] || 0;
                            
                            const chaldVal = {
                              A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1, J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2, S:3, T:4, U:6, V:6, W:6, X:5, Y:1, Z:7
                            }[char] || 0;
                            
                            const plane = {
                              A: 'Mental', H: 'Mental', J: 'Mental', K: 'Mental', Q: 'Mental', S: 'Mental', Z: 'Mental',
                              D: 'Physical', E: 'Physical', M: 'Physical', N: 'Physical', V: 'Physical', W: 'Physical',
                              B: 'Emotional', C: 'Emotional', F: 'Emotional', L: 'Emotional', O: 'Emotional', T: 'Emotional', U: 'Emotional', X: 'Emotional',
                              G: 'Intuitive', I: 'Intuitive', P: 'Intuitive', R: 'Intuitive', Y: 'Intuitive'
                            }[char] || 'Mental';

                            const planetaryAstrology: Record<number, string> = {
                              1: "Sun ☉ (Sovereignty)",
                              2: "Moon ☽ (Emotional Flow)",
                              3: "Jupiter ♃ (Wisdom/Expansion)",
                              4: "Rahu ☊ (Discipline)",
                              5: "Mercury ☿ (Intellect)",
                              6: "Venus ♀ (Art/Harmony)",
                              7: "Ketu ☋ or Neptune ♆ (Contemplation)",
                              8: "Saturn ♄ (Karma/Responsibility)",
                              9: "Mars ♂ (Willpower/Force)"
                            };

                            const astro = planetaryAstrology[pythVal] || "Cosmic Node";

                            return (
                              <tr key={index} className="hover:bg-white/[0.02] transition-colors font-mono">
                                <td className="py-3 px-4 font-serif text-lg text-blue-400 font-bold">{char}</td>
                                <td className="py-3 px-4">
                                  {isVowel ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-sans">Vowel (Soul)</span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-sans">Consonant (Outer)</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-[#f5f5f7] font-semibold">{pythVal}</td>
                                <td className="py-3 px-4 text-zinc-300">{chaldVal}</td>
                                <td className="py-3 px-4">
                                  {plane === 'Mental' && <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-sans font-medium">Mental</span>}
                                  {plane === 'Physical' && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">Physical</span>}
                                  {plane === 'Emotional' && <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-sans font-medium">Emotional</span>}
                                  {plane === 'Intuitive' && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-sans font-medium">Intuitive</span>}
                                </td>
                                <td className="py-3 px-4 text-zinc-500 text-[11px] font-sans">{astro}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 8: Material Assets */}
          {activeTab === 'lifestyle' && (
            <motion.div
              key="tab-assets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetAnalyzer rootNumber={report.metrics.rootNumber} lifePathNumber={report.metrics.lifePath.number} />
              <div className="mt-8">
                <DynamicPhoneAnalyzer initialPhone={report.phoneAnalysis?.number || ''} rootNumber={report.metrics.rootNumber} lifePathNumber={report.metrics.lifePath.number} />
              </div>
            </motion.div>
          )}


          {/* Tab 7: Life Alignment Sectors (Deterministic & Instant) */}
          {activeTab === 'sectors' && report.lifePredictions && (
            <motion.div
              key="tab-sectors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="p-5 bg-blue-900/10 border-l-[3px] border-blue-500 rounded-xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <h4 className="text-xs uppercase font-bold text-blue-400 tracking-wider font-serif mb-1 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  Life Predictions & Real-World Realities
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-2 max-w-3xl">
                  A deeply analytical breakdown of your potentials and setbacks across major life categories. 
                  Scores are calculated via Pythagorean cross-referencing of your Life Path, Expression, and Soul Urge vibrations. 
                  Warning: These analyses do not sugarcoat your karmic tendencies.
                </p>
              </div>

              
              {/* Visual Scaling Component via Recharts */}
              <div className="glass-panel p-6 rounded-2xl mb-8">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider font-sans mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Life Alignment Sectors Intensity Scaling
                </h4>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.lifePredictions}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#8e8e93" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis dataKey="category" type="category" stroke="#8e8e93" fontSize={11} tickLine={false} axisLine={false} width={100} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#2c2c2e', borderRadius: '12px', fontSize: '12px', color: '#f5f5f7' }}
                        itemStyle={{ color: '#0a84ff' }}
                        cursor={{fill: '#2c2c2e', opacity: 0.4}}
                      />
                      <Bar dataKey="score" fill="#0a84ff" radius={[0, 4, 4, 0]} barSize={16}>
                         {
                           report.lifePredictions.map((entry: any, index: number) => {
                             const score = entry?.score || 0;
                             return (
                               <Cell key={`cell-${index}`} fill={score > 75 ? '#32d74b' : score > 50 ? '#0a84ff' : '#ff9f0a'} />
                             );
                           })
                         }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sub-navigation for sectors */}
              <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
                {report.lifePredictions.map((sector: any) => (
                  <button
                    key={sector.category}
                    onClick={() => { playTactileClick(); setActiveSector(sector.category); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}
                    className={`px-4 py-2 text-xs tracking-wide text-xs uppercase font-bold rounded-xl transition-colors ${
                      activeSector === sector.category 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {sector.category}
                  </button>
                ))}
              </div>

              {/* Display active sector */}
              <AnimatePresence mode="wait">
                {report.lifePredictions.filter((s: any) => s.category === activeSector).map((sector: any, idx: number) => (
                  <motion.div 
                    key={sector.category}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="glass-panel rounded-2xl p-8 rounded-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
                    
                    <h4 className="text-xl font-bold text-zinc-200 tracking-wide text-xs uppercase mb-6 flex justify-between items-center font-serif">
                      {sector.category}
                      <div className="flex flex-col items-end">
                        <span className="text-blue-400 font-serif text-3xl">{sector.score || 0}<span className="text-[12px] text-zinc-400 font-sans ml-1">/100</span></span>
                        <span className="text-xs tracking-wide text-xs uppercase text-zinc-500 mt-1">Alignment Score</span>
                      </div>
                    </h4>
                    
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sector.score || 0}%` }}
                        transition={{ delay: 0.2, duration: 1.5, type: 'spring' }}
                        className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-300 h-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                        <h5 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4 font-sans font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Native Potentials
                        </h5>
                        <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                          {sector.potential}
                        </p>
                      </div>
                      
                      <div className="bg-red-950/10 p-6 rounded-xl border border-red-900/20">
                        <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4 font-sans font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Setbacks & Karmic Cautions
                        </h5>
                        <p className="text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                          {sector.setbacks}
                        </p>
                        <div className="p-4 bg-red-950/30 rounded-xl border border-red-900/30">
                           <h5 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2 font-sans font-medium flex items-center gap-2">
                             <ShieldAlert className="w-3 h-3" /> Strict Avoidance
                           </h5>
                           <p className="text-[12px] text-zinc-400 font-sans leading-relaxed">
                             {sector.avoidance}
                           </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
      {/* Glossary Drawer */}
      <GlossaryDrawer
        isOpen={isLexiconOpen}
        onClose={() => setIsLexiconOpen(false)}
        searchTerm={glossarySearch}
        onSearchChange={setGlossarySearch}
      />
    </motion.div>
  );
}
