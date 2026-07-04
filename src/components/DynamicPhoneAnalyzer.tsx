import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Type, Calculator, Hash, Check, AlertCircle, Info, Star } from 'lucide-react';
import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';

interface Props {
  initialPhone?: string;
  lifePathNumber: number;
  rootNumber: number;
}

export default function DynamicPhoneAnalyzer({ initialPhone, lifePathNumber, rootNumber }: Props) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');

  const calculateVibration = (input: string) => {
    const digits = input.replace(/\D/g, '');
    let sum = 0;
    for (const char of digits) {
      sum += parseInt(char, 10);
    }
    if (sum === 0) return null;
    
    let current = sum;
    while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
      current = current.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return current;
  };

  const getLastFourVibration = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length < 4) return null;
    const lastFour = digits.slice(-4);
    const sum = lastFour.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
    
    const getCompoundMeaning = (n: number) => {
      switch(n) {
        case 10: return "Wheel of Fortune. Career breakthroughs, high-profile incoming news, and leadership opportunities.";
        case 11: return "The Hidden Trial. Indicates emotional testing, abrupt miscommunications. Requires patience; check details twice.";
        case 12: return "The Sacrifice. Suffering or client anxiety. You may feel others take advantage of your helpfulness on calls.";
        case 13: return "Rebirth & Transformation. Sudden unexpected disruptions followed by powerful spiritual or material breakthroughs.";
        case 14: return "Dynamic Movement. Excellent for commerce, travel coordination, marketing, and swift business negotiations.";
        case 15: return "Esoteric Magnetism. Attracts gifts, financial support, charming partnerships, and creative collaborations.";
        case 16: return "Shattered Citadel. Warning against impulsive arguments or signing critical contracts over the phone.";
        case 17: return "The Star of Magi. Peace and harmony. Soothing, highly intuitive conversations and sincere connections.";
        case 18: return "High Material Tension. Promotes major commercial deals but raises verbal friction or arguments if unchecked.";
        case 19: return "The Prince of Heaven. Prestigious status, outstanding career expansion, and help from powerful individuals.";
        case 20: return "The Awakening. Calls lead to ambitious new directions, long-term plans, and clear life awakenings.";
        case 21: return "The Crown of Success. General success, professional elevation, social status growth, and protective support.";
        case 22: return "High-Stakes Master. Ability to handle international transactions, wide scale Logistics, or massive community networks.";
        case 23: return "The Royal Lion. Guarantees help from superiors, sudden opportunities, and unexpected financial luck.";
        case 24: return "Love & Abundance. Fortunate for emotional relationships, high financial gains, and warm cooperative speaking.";
        case 25: return "Strength through Experience. Overcomes early barriers or delays on calls, culminating in solid business mastery.";
        case 26: return "False Associations. Danger of trust betrayal. Keep proprietary or sensitive info strictly protected.";
        case 27: return "The Sceptre. Excellent intellectual command, editing, legal advice, and authoritative decision making.";
        case 28: return "The Trusting Lamb. High risk of losing time or resources through unsolicited sales pitches or fraud.";
        case 29: return "Resilience under Fire. Brings complex or dramatic problems on line, but empowers you to solve them with great wisdom.";
        case 30: return "Pure Intellect. Intellectual deduction. Puts logic and academic excellence far above personal emotional drama.";
        case 31: return "The Recluse. Isolation. Reduces social spam calls; perfect for highly focused, solitary specialists.";
        case 32: return "Mass Communication. Outstanding for public speakers, influencers, broadcasters, and high social outreach.";
        case 33: return "The Master Healer. Promotes deep counselor-client healing, absolute protection, and guidance from high mentors.";
        default: return n > 33 ? "A sturdy structural alignment carrying physical stability and systematic coordination." : "An energetic current carrying unique karmic lessons.";
      }
    };
    
    return {
      digits: lastFour,
      sum,
      meaning: getCompoundMeaning(sum)
    };
  };

  const vibration = calculateVibration(phoneNumber);
  const lastFourResult = getLastFourVibration(phoneNumber);

  const getPhoneInsight = (v: number) => {
    switch (v) {
      case 1: return "Independent, bold, and authoritative. Great for command roles, decisive actions, and initiating deals. It projects self-starting strength but can sound clinical.";
      case 2: return "Diplomatic, gentle, and highly cooperative. Perfect for counselors, client support, passive listening, and building emotional trust.";
      case 3: return "Radiantly creative, highly social, and communicative. Outstanding for marketing, sales, media, and networking, though it can attract highly scattered talk.";
      case 4: return "Methodical, structured, and profoundly stable. Ideal for lawyers, builders, trust institutions, and long-term planning. It carries heavy responsibility.";
      case 5: return "Dynamic, versatile, and freedom-loving. Attracts high-velocity change, travel bookings, and rapid sales. An absolute magnet for news and excitement.";
      case 6: return "Nurturing, family-oriented, and artistically warm. Superb for home-based services, physicians, counselors, and domestic harmony.";
      case 7: return "Analytical, private, and spiritually reflective. Perfect for mystics, researchers, scholars, and technical specialists. It limits random spam calls.";
      case 8: return "The ultimate powerhouse of material abundance and corporate executive authority. Built for major financial transactions and commanding teams.";
      case 9: return "Broad-minded, compassionate, and globally humanitarian. Suited for non-profits, international affairs, healers, and concluding major life chapters.";
      case 11: return "Highly intuitive, electrical, and spiritually charged. A master frequency that serves as a beacon of inspiration for spiritual teachers and visionary thinkers.";
      case 22: return "The Master Builder. Carries the capability to handle global logistics, international institutions, and large-scale architectural projects of major influence.";
      case 33: return "The Master Teacher. Attracts profound humanitarian counseling, unconditional support, and cosmic healing calls. A rare, high-vibrational beacon.";
      default: return "A unique telephonic resonance.";
    }
  };

  const getCompatibility = (v: number, lp: number) => {
    if (v === lp) return 100;
    if ((v % 2 === 0 && lp % 2 === 0) || (v % 2 !== 0 && lp % 2 !== 0)) return 80;
    if ((v === 8 && lp === 4) || (v === 4 && lp === 8)) return 75;
    return 60;
  };

  const getDigitCounts = (input: string) => {
    const digits = input.replace(/\D/g, '');
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;
    for (const char of digits) {
      const d = parseInt(char, 10);
      if (d >= 1 && d <= 9) {
        counts[d] = (counts[d] || 0) + 1;
      }
    }
    return counts;
  };

  const getDigitCoreMeaning = (digit: number, count: number) => {
    if (count === 0) {
      switch (digit) {
        case 1: return "Missing 1: Lack of direct assertive authority or initiating power over the phone. May find it hard to say 'no'.";
        case 2: return "Missing 2: Relationships and patient listening on calls require conscious effort; prone to interrupting.";
        case 3: return "Missing 3: Prone to dry, purely transactional calls. Hard to project lighthearted humor or artistic flair.";
        case 4: return "Missing 4: Prone to loose commitments, bad scheduling, and disorganized call records.";
        case 5: return "Missing 5: Avoidance of dynamic communication; struggles with sales or quick-witted conversations.";
        case 6: return "Missing 6: Struggle to express protective, warm, domestic, or empathetic concerns over this line.";
        case 7: return "Missing 7: Prone to superficial talk; hard to use this line for deep analysis, research, or private counseling.";
        case 8: return "Missing 8: Prone to low financial assertiveness or hesitation when quoting prices or demanding payments.";
        case 9: return "Missing 9: Prone to holding grudges or leaving discussions incomplete. Hard to close deals smoothly.";
        default: return "";
      }
    } else if (count === 1) {
      switch (digit) {
        case 1: return "Single 1: Healthy individuality and confident expression on calls.";
        case 2: return "Single 2: Balanced sensitivity and active listening.";
        case 3: return "Single 3: Natural charm, expressive speaking style.";
        case 4: return "Single 4: Reliable, practical, and systematic coordination.";
        case 5: return "Single 5: Adaptive, quick-witted, ready for sudden opportunities.";
        case 6: return "Single 6: Responsible, nurturing, and helpful advice.";
        case 7: return "Single 7: Intuitive, scholarly, and professional speaking tone.";
        case 8: return "Single 8: Confident material drive and executive demeanor.";
        case 9: return "Single 9: Patient, tolerant, and compassionate attitude.";
        default: return "";
      }
    } else {
      switch (digit) {
        case 1: return `Repeated 1s (${count}x): Amplified willpower. Great for commanding attention, but guard against ego or coming off as domineering on calls.`;
        case 2: return `Repeated 2s (${count}x): Extremely empathetic and receptive, but can make you vulnerable to absorbing other people's stress or negativity.`;
        case 3: return `Repeated 3s (${count}x): Overflowing social charm and sales charisma, though it easily scatters conversational goals into long, unproductive chats.`;
        case 4: return `Repeated 4s (${count}x): Heavy work-ethic, perfect for detail-oriented business, but attracts high stress, stubbornness, and delays.`;
        case 5: return `Repeated 5s (${count}x): Constant sensory excitement, quick sales, and sudden travel, but highly restless and hard to pin down.`;
        case 6: return `Repeated 6s (${count}x): Extreme domestic protective focus. Perfect for family, but leads to constant worrying or micro-managing.`;
        case 7: return `Repeated 7s (${count}x): High analytical skepticism. Exceptional for intellectual audits, but projects an aloof, unapproachable tone.`;
        case 8: return `Repeated 8s (${count}x): Intense business ambition and executive command. Excellent for wealth creation, but creates a high-pressure line.`;
        case 9: return `Repeated 9s (${count}x): Powerful emotional charisma and teaching vibe. Attracts dramatic calls, endings, and heavy counseling burdens.`;
        default: return "";
      }
    }
  };

  const getPhoneCaseColor = (v: number) => {
    switch(v) {
      case 1: return "Gold, Yellow, or Bold Red (to amplify leadership)";
      case 2: return "Silver, Pearl, or Soft Cream (to cultivate trust)";
      case 3: return "Bright Yellow, Purple, or Sky Blue (to boost creativity)";
      case 4: return "Earthy Brown, Terracotta, or Forest Green (to ground operations)";
      case 5: return "Turquoise, Orange, or Silver (to attract luck)";
      case 6: return "Indigo, Pink, or Royal Blue (to protect relationships)";
      case 7: return "Amethyst, Deep Violet, or Steel Grey (to expand intuition)";
      case 8: return "Carbon Black, Gold, or Emerald Green (to amplify wealth)";
      case 9: return "Crimson, Lavender, or Gold (to close chapters)";
      default: return "Translucent or Slate (to balance cosmic frequencies)";
    }
  };

  const counts = getDigitCounts(phoneNumber);

  return (
    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden" id="phone-analyzer-container">
      {/* Absolute design overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
            <Phone className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-[#f5f5f7] tracking-wider font-serif">
              Interactive Telephonic Resonance Audit
            </h4>
            <p className="text-[10px] text-zinc-500 font-sans">Esoteric numerical frequency of communications</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Phone className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => { playHoverTick(); setPhoneNumber(e.target.value); }}
            placeholder="Enter phone number (e.g. +1 555-0199)..."
            className="w-full bg-[#171717]/80 backdrop-blur-md border border-dark-border focus:border-emerald-500/50 rounded-xl py-4 pl-12 pr-4 text-[#f5f5f7] placeholder-[#404040] focus:outline-none transition-colors text-sm font-mono shadow-inner"
          />
        </div>
        <p className="text-[10px] text-zinc-500 font-sans mt-2 italic">
          Calculates the sum of all digits in your phone number to determine the overall conversational frequency.
        </p>
      </div>

      {vibration !== null ? (
        <div className="space-y-8">
          {/* Main Vibration Result */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-white/5 text-center h-full">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-pulse">
                <span className="text-4xl font-serif text-emerald-400 font-bold">{vibration}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold block mb-1">Root Phone Vibe</span>
              <span className="text-xs text-emerald-400 font-serif font-semibold italic">Conversational Aura</span>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <h5 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Esoteric Vibration Insight</h5>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">{getPhoneInsight(vibration)}</p>
              </div>

              <div className="bg-[#121212]/80 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Vibrational Compatibility</span>
                  {getCompatibility(vibration, rootNumber) >= 80 ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Very Lucky Match
                    </span>
                  ) : getCompatibility(vibration, rootNumber) >= 60 ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Neutral / Balanced</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Needs Alignment</span>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-serif italic mb-2">
                  This number holds a <strong>{getCompatibility(vibration, rootNumber)}% resonance</strong> with your Life Path vibration ({lifePathNumber}).
                </p>
                {getCompatibility(vibration, rootNumber) < 80 ? (
                  <p className="text-[11px] text-blue-400/90 leading-relaxed font-sans">
                    <strong>Talismanic Adjustment:</strong> Since this number holds a lower resonance with your Life Path, you can apply an esoteric 'bridge remedy'. Write the digit <strong>{lifePathNumber > vibration ? lifePathNumber - vibration : lifePathNumber + 9 - vibration}</strong> on a small sticker and place it under your phone case. This acts as an active vibrational bridge, shifting the overall field to perfectly align with your destiny ({lifePathNumber}).
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-400/90 leading-relaxed font-sans">
                    <strong>Cosmic Flow:</strong> This number represents a natural cosmic channel for your energy. It naturally draws fortunate opportunities, clear communications, and low friction in business transactions.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vedic Phone Astrology Last 4 Digits Compound Vibration */}
          {lastFourResult && (
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden" id="vedic-last-four-analyzer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">
                    Vedic Phone Astrology: Inner Core
                  </span>
                  <h5 className="text-xs font-bold uppercase text-zinc-100 font-serif flex items-center gap-1.5">
                    Last 4 Digits Compound: <strong className="text-emerald-400 font-mono text-sm">"{lastFourResult.digits}"</strong> (Sum: {lastFourResult.sum})
                  </h5>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    In ancient Vedic and Chaldean telephone astrology, the last 4 digits carry up to 80% of the active conversational destiny, dictating the practical events, business agreements, and client vibes attracted to this number.
                  </p>
                  <p className="text-xs text-emerald-300 mt-2 font-serif italic">
                    <strong>Predicted Channel:</strong> {lastFourResult.meaning}
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-serif text-2xl text-emerald-400 font-bold shadow-inner">
                  {lastFourResult.sum}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Phone Case Color & Remedies */}
          <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">Phone Case Remedy Color</span>
              <p className="text-xs text-zinc-300 font-sans">
                To reinforce this frequency, protect your phone with a case of color: <strong className="text-emerald-300">{getPhoneCaseColor(vibration)}</strong>.
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">Optimal Communication Hours</span>
              <p className="text-xs text-zinc-300 font-sans">
                Initiate vital business or personal conversations during the hour corresponding to your planetary hours or daily cycle for extreme flow.
              </p>
            </div>
          </div>

          {/* Grid View & Repeated / Missing Digits Breakdown */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              Esoteric Grid & Digit Frequency breakdown
            </h5>
            <p className="text-xs text-zinc-400 leading-normal font-sans">
              Individual digits carry unique karmic channels. Here is how the digits inside your phone number are distributed. Prone voids (Missing Numbers) or intense concentrations (Repeated Numbers) modify how conversations unfold.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Digit Cards */}
              {Array.from({ length: 9 }, (_, i) => {
                const digit = i + 1;
                const count = counts[digit] || 0;
                return (
                  <div 
                    key={digit}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between h-full transition-colors ${
                      count > 1 
                        ? 'bg-emerald-950/10 border-emerald-500/20' 
                        : count === 1 
                          ? 'bg-black/30 border-white/5' 
                          : 'bg-black/10 border-dashed border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-serif font-bold text-zinc-300">Digit {digit}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        count > 1 
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold' 
                          : count === 1 
                            ? 'bg-blue-500/10 text-blue-300' 
                            : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {count === 0 ? 'MISSING' : `${count} Occurrence${count > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                      {getDigitCoreMeaning(digit, count)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-black/20 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-2">
          <Info className="w-5 h-5 text-zinc-600 animate-pulse" />
          <span>Enter phone digits above to reveal their esoteric resonance and digit frequencies.</span>
        </div>
      )}
    </div>
  );
}
