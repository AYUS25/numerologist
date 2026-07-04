import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car, Home, Hash, Sparkles, AlertCircle, Palette, Hexagon, ShieldAlert, Wrench } from 'lucide-react';
import { playMechanicalDial, playHoverTick } from '../audio';

interface Props {
  lifePathNumber: number;
  rootNumber: number;
}

export default function AssetAnalyzer({ lifePathNumber, rootNumber }: Props) {
  const [assetType, setAssetType] = useState<'house' | 'vehicle'>('house');
  const [assetInput, setAssetInput] = useState('');
  const [system, setSystem] = useState<'pythagorean' | 'chaldean'>('pythagorean');

        const calculateVibration = (input: string) => {
    if (!input) return null;
    
    let sum = 0;
    const alphanumeric = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const pythagoreanValues: Record<string, number> = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };

    const chaldeanValues: Record<string, number> = {
      A: 1, I: 1, J: 1, Q: 1, Y: 1,
      B: 2, K: 2, R: 2,
      C: 3, G: 3, L: 3, S: 3,
      D: 4, M: 4, T: 4,
      E: 5, H: 5, N: 5, X: 5,
      U: 6, V: 6, W: 6,
      O: 7, Z: 7,
      F: 8, P: 8
    };

    const letterValues = system === 'pythagorean' ? pythagoreanValues : chaldeanValues;

    for (const char of alphanumeric) {
      if (/[0-9]/.test(char)) {
        sum += parseInt(char, 10);
      } else if (letterValues[char]) {
        sum += letterValues[char];
      }
    }

    if (sum === 0) return null;
    
    let current = sum;
    while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
      current = current.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    
    return current;
  };

  const vibration = calculateVibration(assetInput);

    const getCompatibility = (vibration: number, root: number) => {
    const matrix: Record<number, { best: number[], avoid: number[] }> = {
      1: { best: [1, 2, 3, 9], avoid: [8] },
      2: { best: [1, 5], avoid: [4, 8, 9] },
      3: { best: [1, 2, 3, 9], avoid: [6] },
      4: { best: [5, 6, 7], avoid: [2, 8, 9] },
      5: { best: [1, 4, 5, 6], avoid: [] },
      6: { best: [4, 5, 6, 8], avoid: [3] },
      7: { best: [5, 6], avoid: [8, 9] },
      8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] },
      9: { best: [1, 3, 5], avoid: [2, 4, 8] }
    };
    const row = matrix[root] || { best: [], avoid: [] };
    if (row.best.includes(vibration)) return { status: 'Lucky', score: 100 };
    if (row.avoid.includes(vibration)) return { status: 'Incompatible', score: 40 };
    return { status: 'Neutral', score: 70 };
  };

    const getHouseVibrationMeaning = (v: number) => {
    switch (v) {
      case 1: return "House 1: A sanctuary of pure independence, pioneering ambition, and self-employment. Outstanding for entrepreneurs and self-starters, though it can sometimes feel solitary or high-pressure.";
      case 2: return "House 2: The ultimate haven of peace, intimacy, and cooperation. It fosters deep relationships, gentle healing, and active listening, but demands guardrails against emotional codependency.";
      case 3: return "House 3: A vibrant, chaotic social hub of creative self-expression, humor, and artistic design. Incredible for entertainers and designers, but can become cluttered and disorganized.";
      case 4: return "House 4: A sturdy fortress of heavy grounding, profound discipline, hard work, and ancestral structure. It offers unmatched security, but can occasionally feel rigid, chilly, or repetitive.";
      case 5: return "House 5: A dynamic, high-velocity node of freedom, constant change, active communication, and constant visitors. Ideal for travel lovers and public figures, but lacks domestic stability.";
      case 6: return "House 6: A warm, nurturing sanctuary of deep love, domestic duty, beauty, and family. It represents the pinnacle of protection, pets, and children, though you must guard against over-worrying.";
      case 7: return "House 7: A quiet, solitary temple of deep analytical research, spiritual contemplation, and mystic isolation. Perfect for writers and researchers, but is prone to feeling aloof or lonely.";
      case 8: return "House 8: A powerful, authoritative powerhouse of material abundance and wealth creation. Ideal for ambitious executives and money management, but can make it very difficult to wind down and sleep.";
      case 9: return "House 9: A universal school of compassionate humanitarianism, artistic closure, and global wisdom. Welcoming to all cultures, though it often attracts heavy emotional processing and major life transitions.";
      default: return "A unique energetic shelter.";
    }
  };

  const getVehicleVibrationMeaning = (v: number) => {
    switch (v) {
      case 1: return "Vehicle 1: Strong, authoritative, and always leading the lane. Radiates immense confidence and self-reliance, but can occasionally trigger speed or on-road impatience.";
      case 2: return "Vehicle 2: Quiet, steady, and gentle. Excellent for safety-conscious drivers who value smooth, stress-free commutes and passenger comfort over high-speed racing.";
      case 3: return "Vehicle 3: Socially bright, colorful, and fun. Exceptional for group carpools and road trips filled with music, but watch out for visual distractions while driving.";
      case 4: return "Vehicle 4: A systematic, sturdy workhorse of heavy-duty reliability. Delivers practical, predictable transits, but is prone to rigid handling and requires strict adherence to maintenance logs.";
      case 5: return "Vehicle 5: High-speed, dynamic, and a true explorer. It absolutely thrives on long-distance road trips, rapid maneuvering, and adventure, but demands undivided attention behind the wheel.";
      case 6: return "Vehicle 6: A cozy, exceptionally protective family cruiser. Promotes high highway safety, warm interiors, and a highly nurturing, dependable passenger atmosphere.";
      case 7: return "Vehicle 7: Technical precision, high-end engineering, and a quiet, mysterious cabin environment. Perfect for solitary road trips and reflective commutes; exceptionally low friction when maintained.";
      case 8: return "Vehicle 8: High status, commanding road presence, and executive luxury. Excellent for driving to business deals, but carries high registration and costly spare-part pricing.";
      case 9: return "Vehicle 9: A universal, tolerant traveler. Excellent for charity transports, international driving, and concluding old, bad road habits with patience and grace.";
      default: return "A steady energetic carrier.";
    }
  };

  const getHouseRemedies = (vibration: number, root: number) => {
    let remedyText = getHouseVibrationMeaning(vibration) + " ";
    
    const compat = getCompatibility(vibration, root);
    if (compat.score === 100) {
      remedyText += `This is a highly compatible, lucky energetic match for your Root Number (${root})! Your home naturally supports your core vibration.`;
    } else if (compat.score === 70) {
      remedyText += `This is a neutral match for your Root Number (${root}). It offers balanced energy without extreme friction.`;
    } else {
      // Find a lucky target number
      const matrix: Record<number, { best: number[], avoid: number[] }> = {
        1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
        4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
        7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
      };
      const best = matrix[root]?.best[0] || root;
      let targetDiff = best - vibration;
      if (targetDiff < 0) targetDiff += 9;
      
      remedyText += `To harmonize the current energy using the 'Add a Digit' fix, place a small, barely visible letter '${targetDiff === 1 ? 'A' : targetDiff === 2 ? 'B' : targetDiff === 3 ? 'C' : targetDiff === 4 ? 'D' : targetDiff === 5 ? 'E' : targetDiff === 6 ? 'F' : targetDiff === 7 ? 'G' : targetDiff === 8 ? 'H' : 'I'}' (or number ${targetDiff}) near your front door. This shifts the overall home vibration to a lucky ${best}.`;
    }
  
    const colors = [
      "Ruby Red, Gold, Bright Orange", "Silver, Pearl White", "Yellow, Amethyst Purple", 
      "Earthy Brown, Terracotta", "Light Blue, Silver, Turquoise", "Indigo, Rose Pink", 
      "Violet, Sea Green", "Charcoal Black, Dark Blue", "Crimson, Maroon" 
    ];
    const symbols = [
      "Sun motifs, bold geometric shapes", "Crescent moons, paired objects", "Triangles, vibrant blooming flowers", 
      "Squares, heavy wooden furniture", "Stars, wind chimes", "Hexagrams, family portraits", 
      "Heptagrams, indoor water fountains", "Octagons, metallic accents", "Enneagrams, global artifacts" 
    ];
  
    return {
      text: remedyText,
      colors: colors[(root - 1) % 9] || colors[0],
      symbols: symbols[(root - 1) % 9] || symbols[0],
      placement: "Focus these enhancements near your front entrance and primary living areas."
    };
  };
  
  const getVehicleRemedies = (vibration: number, root: number) => {
    let remedyText = getVehicleVibrationMeaning(vibration) + " ";
    let safety = "";
    
    if (vibration === 5) {
      safety = "Number 5 is generally considered the best universal number for vehicles, associated with smooth communication, trade, and movement.";
    } else if (vibration === 4 || vibration === 8) {
      safety = "Numbers 4 and 8 are widely avoided for vehicles as they can attract sudden events (4) or delays (8), unless they specifically complement your chart.";
    } else {
      safety = "Maintain regular checkups, tire pressures, and fluid levels for cosmic flow.";
    }
  
    const compat = getCompatibility(vibration, root);
    if (compat.score === 100) {
      remedyText += `It is perfectly aligned as a 'lucky' number for you, offering natural protection and smooth transits.`;
    } else if (compat.score === 70) {
      remedyText += `It holds neutral alignment with your Root Number. Solid and dependable.`;
    } else {
      const matrix: Record<number, { best: number[], avoid: number[] }> = {
        1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
        4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
        7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
      };
      const best = matrix[root]?.best[0] || root;
      let targetDiff = best - vibration;
      if (targetDiff < 0) targetDiff += 9;
      
      remedyText += `To improve current energetic alignment on roads, keep a small talisman with the number '${targetDiff}' inside the glovebox to shift the net vibration to a lucky ${best}.`;
    }
  
    return {
      text: remedyText,
      maintenance: safety
    };
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl w-full mx-auto mb-8 border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f5f7] font-light uppercase tracking-wider flex items-center justify-center gap-3">
          <Hash className="w-6 h-6 text-blue-500" />
          Material Asset Harmonizer
        </h3>
        <p className="text-sm text-zinc-400 mt-2 font-sans max-w-2xl mx-auto">
          Calculate the energetic resonance of your home address or vehicle license plate. Find out if it aligns with your Life Path ({lifePathNumber}) and how to adjust its vibration for optimal luck and safety.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        <div className="flex-1 space-y-6">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { playMechanicalDial(); setAssetType('house'); }}
              onMouseEnter={() => playHoverTick()}
              className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                assetType === 'house' ? 'bg-blue-500/20 text-blue-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Home className="w-4 h-4" /> Living Space
            </button>
            <button
              onClick={() => { playMechanicalDial(); setAssetType('vehicle'); }}
              onMouseEnter={() => playHoverTick()}
              className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                assetType === 'vehicle' ? 'bg-blue-500/20 text-blue-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Car className="w-4 h-4" /> Vehicle
            </button>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-serif font-bold">
              {assetType === 'house' ? 'House Number or Full Address' : 'License Plate or VIN'}
            </label>
            <input
              type="text"
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
              placeholder={assetType === 'house' ? 'e.g. 1428' : 'e.g. ABC 123'}
              className="w-full bg-[#171717]/80 backdrop-blur-md border border-dark-border focus:border-blue-500/50 rounded-xl py-4 px-5 text-[#f5f5f7] placeholder-[#404040] focus:outline-none transition-colors text-sm font-mono uppercase shadow-inner"
            />
            <p className="mt-2 text-[10px] text-zinc-500 font-sans italic">
              {assetType === 'house' 
                ? 'Enter just the door/house number for immediate environmental resonance.' 
                : 'Enter your license plate number. Letters are converted to numbers based on the selected system.'}
            </p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mt-4">
            <button
              onClick={() => { playMechanicalDial(); setSystem('pythagorean'); }}
              onMouseEnter={() => playHoverTick()}
              className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                system === 'pythagorean' ? 'bg-blue-500/20 text-blue-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Pythagorean
            </button>
            <button
              onClick={() => { playMechanicalDial(); setSystem('chaldean'); }}
              onMouseEnter={() => playHoverTick()}
              className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                system === 'chaldean' ? 'bg-blue-500/20 text-blue-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Chaldean
            </button>
          </div>
        </div>

        <div className="flex-1">
          {vibration ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full bg-gradient-to-br from-[#0f172a] to-[#020617] border border-blue-500/20 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-xl"
            >
              <div className="absolute -top-10 -right-10 text-blue-500/5">
                {assetType === 'house' ? <Home className="w-48 h-48" /> : <Car className="w-48 h-48" />}
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
                    Calculated Frequency
                  </span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getCompatibility(vibration, rootNumber).score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : getCompatibility(vibration, rootNumber).score >= 60 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {getCompatibility(vibration, rootNumber).score >= 80 ? 'Very Lucky' : getCompatibility(vibration, rootNumber).score >= 60 ? 'Neutral Match' : 'Needs Fixation'} ({getCompatibility(vibration, rootNumber).score}%)
                  </span>
                </div>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-6xl font-serif text-[#f5f5f7]">{vibration}</span>
                  <span className="text-sm font-serif text-blue-400 italic">Root Vibration</span>
                </div>
                
                {assetType === 'house' ? (
                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                       <h4 className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Living Space Harmony
                      </h4>
                      <p className="text-sm text-zinc-300 font-serif italic">
                        {getHouseRemedies(vibration, rootNumber).text}
                      </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-sm space-y-3">
                       <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Vibe Optimization
                      </h4>
                      <div className="text-xs space-y-2 font-sans">
                        <p><span className="text-zinc-500 w-20 inline-block font-mono">COLORS:</span> <span className="text-zinc-300">{getHouseRemedies(vibration, rootNumber).colors}</span></p>
                        <p><span className="text-zinc-500 w-20 inline-block font-mono">SYMBOLS:</span> <span className="text-zinc-300">{getHouseRemedies(vibration, rootNumber).symbols}</span></p>
                        <p><span className="text-zinc-500 w-20 inline-block font-mono">PLACEMENT:</span> <span className="text-zinc-300">{getHouseRemedies(vibration, rootNumber).placement}</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                       <h4 className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" /> Vehicle Numerology
                      </h4>
                      <p className="text-sm text-zinc-300 font-serif italic">
                        {getVehicleRemedies(vibration, rootNumber).text}
                      </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                       <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2 flex items-center gap-2">
                        <Wrench className="w-3 h-3" /> Maintenance & Safety Focus
                      </h4>
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                        {getVehicleRemedies(vibration, rootNumber).maintenance}
                      </p>
                    </div>
                  </div>
                )}

                {/* Alchemical Character-by-Character Decomposition */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2.5 mt-4" id="asset-decomposition-table">
                  <span className="text-[9px] uppercase tracking-widest text-blue-400 font-mono font-bold block">
                    Alchemical Character Breakdown ({system === 'pythagorean' ? 'Pythagorean' : 'Chaldean'})
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {assetInput.toUpperCase().replace(/[^A-Z0-9]/g, '').split('').map((char, index) => {
                      const pythagoreanValues: Record<string, number> = {
                        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
                        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
                        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
                      };
                      const chaldeanValues: Record<string, number> = {
                        A: 1, I: 1, J: 1, Q: 1, Y: 1,
                        B: 2, K: 2, R: 2,
                        C: 3, G: 3, L: 3, S: 3,
                        D: 4, M: 4, T: 4,
                        E: 5, H: 5, N: 5, X: 5,
                        U: 6, V: 6, W: 6,
                        O: 7, Z: 7,
                        F: 8, P: 8
                      };
                      const letterMap = system === 'pythagorean' ? pythagoreanValues : chaldeanValues;
                      const val = /[0-9]/.test(char) ? parseInt(char, 10) : (letterMap[char] || 0);
                      
                      return (
                        <div key={index} className="flex flex-col items-center justify-center bg-zinc-950/80 border border-white/10 rounded-lg p-2 min-w-[38px] shadow-sm">
                          <span className="text-sm font-serif font-bold text-zinc-100">{char}</span>
                          <span className="text-[10px] font-mono text-blue-400 font-bold">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center p-8 text-center text-zinc-500 bg-black/20">
              <p className="text-xs uppercase tracking-widest font-serif">Enter an identifier to reveal its esoteric vibration and remedies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
