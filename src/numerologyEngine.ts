import { 
  NumerologyInput, 
  NumerologyReport, LunarPhase, PlanetaryHour, 
  NumerologyMetrics, 
  PlaneOfExpression, 
  KarmicLesson, 
  KarmicStrength,
  PinnacleCycle,
  ChallengeCycle,
  KarmicDebt,
  CompatibilityResult,
  SpiritualRemedySection,
  MasterCrystal
} from './types';
const chaldeanMap: Record<string, number> = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };

function getChaldeanCompound(name: string): number {
  let sum = 0;
  for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
    sum += chaldeanMap[char] || 0;
  }
  return sum;
}
function getChaldeanMeaning(num: number): string {
  switch(num) {
    case 10: return "Wheel of Fortune. Success, honor, and faith.";
    case 11: return "A hidden danger, trial, or treachery. Great difficulty.";
    case 12: return "The Sacrifice. Suffering or anxiety. The victim.";
    case 13: return "Upheaval and destruction, yet rebirth.";
    case 14: return "Movement, combination of people and things. Risk.";
    case 15: return "Magic and mystery. Charisma. Good for receiving gifts.";
    case 16: return "The Shattered Citadel. Defeat of plans.";
    case 17: return "The Star of the Magi. Peace and love. Highly fortunate.";
    case 18: return "Materialism destroying spiritual sides. Bitter quarrels.";
    case 19: return "Prince of Heaven. Highly fortunate. Success and honor.";
    case 20: return "The Awakening. New purpose, new plans, new ambitions.";
    case 21: return "The Crown of the Magi. General success, advancement.";
    case 22: return "Illusion and delusion. A good person who lives in a fool's paradise.";
    case 23: return "The Royal Star of the Lion. Success, help from superiors.";
    case 24: return "Love, money, and creativity. Fortunate through opposite sex.";
    case 25: return "Strength through experience. Success comes after early trials.";
    case 26: return "Disasters brought about by association with others.";
    case 27: return "The Sceptre. Good for authority, command, and intellect.";
    case 28: return "The Trusting Lamb. Loss through trust in others.";
    case 29: return "Grace under pressure. Deception by others, but internal strength.";
    case 30: return "Mental deduction. Usually puts intellect over material success.";
    case 31: return "The Recluse. Isolation. Not very fortunate from a worldly standpoint.";
    case 32: return "Communication. Good for mass movements and speaking.";
    case 33: return "A fortunate number promising help and protection from others.";
    case 37: return "Royal Star of the Bull. Good and fortunate friendships in love.";
    case 42: return "Love, affection, and sympathy. But can be naive.";
    case 52: return "A combination of creativity and sudden reversals.";
    default: return "A uniquely vibrating karmic compound pattern.";
  }
}


// Pythagorean Letter Value Mapping
const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// Planes of Expression letter mapping
const LETTER_PLANES: Record<string, 'physical' | 'mental' | 'emotional' | 'intuitive'> = {
  A: 'mental', H: 'mental', J: 'mental', K: 'mental', Q: 'mental', S: 'mental', Z: 'mental',
  D: 'physical', E: 'physical', M: 'physical', N: 'physical', V: 'physical', W: 'physical',
  B: 'emotional', C: 'emotional', F: 'emotional', L: 'emotional', O: 'emotional', T: 'emotional', U: 'emotional', X: 'emotional',
  G: 'intuitive', I: 'intuitive', P: 'intuitive', R: 'intuitive', Y: 'intuitive'
};

// Vowel detection with conditional Y rule: Y is a vowel if there are no other vowels in the word.
function isVowel(char: string, word: string): boolean {
  const c = char.toUpperCase();
  if (['A', 'E', 'I', 'O', 'U'].includes(c)) return true;
  if (c === 'Y') {
    const hasOtherVowels = [...word.toUpperCase()].some(letter => 
      ['A', 'E', 'I', 'O', 'U'].includes(letter)
    );
    return !hasOtherVowels;
  }
  return false;
}

// Help reduce a number. If allowMaster is true, stops at 11, 22, 33.
export function reduceNumber(n: number, allowMaster = true): number {
  if (n === 0) return 0;
  
  while (n > 9) {
    if (allowMaster && (n === 11 || n === 22 || n === 33)) {
      return n;
    }
    n = n.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return n;
}

// Check for Karmic Debts in a sum before final reduction
export function detectKarmicDebt(sumsToCheck: number[]): number | null {
  for (const sum of sumsToCheck) {
    if ([13, 14, 16, 19].includes(sum)) {
      return sum;
    }
    // Also check digit sums of double digits before they collapse
    let temp = sum;
    while (temp > 9) {
      if ([13, 14, 16, 19].includes(temp)) {
        return temp;
      }
      temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
  }
  return null;
}

// Map numbers to key traits
const NUMBER_LABELS: Record<number, string> = {
  1: 'The Pioneer / Leader',
  2: 'The Peacemaker / Diplomat',
  3: 'The Creative / Communicator',
  4: 'The Builder / Architect',
  5: 'The Explorer / Visionary',
  6: 'The Nurturer / Caregiver',
  7: 'The Seeker / Philosopher',
  8: 'The Powerhouse / Executive',
  9: 'The Humanitarian / Sage',
  11: 'The Master Teacher',
  22: 'The Master Builder',
  33: 'The Master Healer'
};

// Detailed definitions of each vibration
const NUMBER_DESCRIPTIONS: Record<string, Record<number, string>> = {
  lifePath: {
    1: 'Your destiny is to cultivate absolute independence, creative self-reliance, and pioneered leadership. You possess the raw courage to stand alone, carve out new paths, and inspire others through your actions. Challenges involve overcoming self-doubt, impulsiveness, or a tendency toward self-centeredness.',
    2: 'Your destiny centers on cooperation, sensitivity, balance, and diplomacy. You are highly intuitive, acting as a natural mediator and bridge builder. You find your greatest strength in partnerships and collaboration. Your challenge lies in avoiding codependency, hypersensitivity, or passive-aggressiveness.',
    3: 'Your path is of creative self-expression, communication, and joyful optimism. You thrive on imagination, artistry, and social connection. You are here to uplift others through your voice, writing, or performance. Guard against scattering your energies, superficiality, or emotional drama.',
    4: 'Your path is one of structure, hard work, discipline, and establishing solid foundations. You are the ultimate realist, valuing order, reliability, and precision. You build systems that last. Challenges center on rigidity, stubbornness, or becoming overly cautious.',
    5: 'Your path is a dynamic journey of absolute freedom, adventure, versatility, and learning through direct experience. You are highly adaptable, a champion of progress and change. Your lesson is to learn the constructive use of freedom without falling into excess or restlessness.',
    6: 'Your path is centered on deep responsibility, unconditional love, nurturing, and domestic harmony. You are a natural healer and counselor, deeply connected to your community and home. Your primary challenge is to avoid self-sacrifice to the point of resentment or becoming over-protective.',
    7: 'Your destiny is to seek truth, wisdom, and spiritual depth. You possess a brilliant, analytical mind that looks far beneath the surface of things. You require periods of solitude to recharge and integrate knowledge. Guard against cynicism, emotional coldness, or isolation.',
    8: 'Your path is the mastery of power, material success, authority, and financial abundance. You understand the law of cause and effect (karma) deeply. You are here to lead massive enterprises and manifest physical results. Your challenge is balancing material power with spiritual integrity.',
    9: 'Your path is of global humanitarian service, compassion, and artistic completion. You possess an open, non-judgmental heart and look at the world from a universal perspective. You are here to learn selfless giving and release attachment. Guard against martyr complexes or holding onto past hurts.',
    11: 'As a Master Number, your path is that of the Master Teacher. You possess intense intuitive sensitivity and act as a lightning rod for spiritual insights. You are here to inspire humanity, serving as a beacon of illumination. Your path is highly demanding, requiring you to master intense nervous energy and self-doubt.',
    22: 'As a Master Number, your path is the Master Builder. You have the unique ability to take massive, idealistic dreams and ground them into concrete, physical reality. You combine the spiritual insights of the 11 with the practical discipline of the 4. This is a path of immense responsibility and global influence.',
    33: 'As a Master Number, your path is the Master Healer and spiritual guide. You represent the height of universal compassion, nurturing, and selfless devotion. You are here to raise the spiritual consciousness of others through unconditional love. It is a highly rare and demanding vibration focused on planetary service.'
  },
  expression: {
    1: 'You express yourself as an ambitious, original individual with a powerful drive to create and lead. You possess a commanding presence and work best when setting your own standards.',
    2: 'You express yourself through harmony, gentle collaboration, and supportive roles. Your natural capacity for active listening and empathy makes you an invaluable team member.',
    3: 'You express yourself through sparkling charm, humor, and brilliant creativity. You possess an innate gift for language, storytelling, and uplifting social circles.',
    4: 'You express yourself as a methodical, structured, and profoundly reliable individual. You find deep satisfaction in order, practicality, and high-quality workmanship.',
    5: 'You express yourself as a highly versatile, quick-witted explorer who thrives on variety, communication, and multi-faceted career paths. You are a natural salesperson of ideas.',
    6: 'You express yourself as a loving protector, artist, and counselor. You bring harmony to discord and naturally shoulder the responsibilities of your environment.',
    7: 'You express yourself as an intellectual investigator, quiet scholar, or intuitive seeker. You possess an air of mystery and prefer deep, meaningful exchanges.',
    8: 'You express yourself as a powerful organizer, executive, or builder of material success. You display strength, confidence, and natural authority.',
    9: 'You express yourself as a broad-minded humanitarian, educator, or artist. You are highly idealistic, seeing the bigger picture and seeking to make a lasting global impact.',
    11: 'You express yourself with an magnetic, electrical intensity. Your words are visionary, your actions are guided by high-frequency intuition, and you inspire others effortlessly.',
    22: 'You express yourself as a force of nature, capable of managing large-scale institutions or complex systems to bring world-changing ideas into the physical world.',
    33: 'You express yourself with pure compassion, absolute sincerity, and a highly protective, nurturing energy. You represent a safe harbor for everyone you encounter.'
  },
  soulUrge: {
    1: 'In your deepest soul, you yearn for absolute independence, to be first, and to stand as a self-sufficient creator. You dislike being restricted, micromanaged, or overshadowed.',
    2: 'Your innermost desire is to love and be loved, to dwell in harmonious relationships, and to experience perfect peace. You crave connection, safety, and emotional safety.',
    3: 'Your soul craves joy, creative play, and artistic freedom. You have an inner hunger to write, paint, sing, or simply make the world a more vibrant, light-hearted place.',
    4: 'Your soul deeply desires stability, safety, and concrete order. You find emotional comfort in routine, predictability, and knowing exactly where you stand.',
    5: 'Your soul hungers for continuous change, travel, and sensory adventure. You have a deep-seated dread of boredom, stagnation, and restrictive routines.',
    6: 'Your soul is nourished by taking care of others, having a beautiful and comfortable home, and creating a supportive, close-knit family or community circle.',
    7: 'Your soul yearns for absolute truth, spiritual alignment, and private quietude. You seek to understand the hidden mysteries of life and the depths of your own consciousness.',
    8: 'Your soul secretly or openly desires material mastery, status, and large-scale control. You feel most aligned when exercising authority and mastering the physical realm.',
    9: 'Your soul is driven by a deep longing to heal the world, alleviate suffering, and experience universal oneness. You crave spiritual fulfillment and absolute altruism.',
    11: 'Your soul is pulled by a profound spiritual calling. You crave mystical experiences, intuitive alignment, and serving as a spiritual catalyst for others.',
    22: 'Your soul is driven by a monumental desire to build legacy-scale projects that benefit humanity for generations. You find satisfaction only in massive practical achievements.',
    33: 'Your soul is pure devotion. You crave nothing more than to elevate the spiritual well-being of others, offering yourself as a humble vessel of divine compassion.'
  },
  personality: {
    1: 'Others perceive you as strong, confident, independent, and highly capable. You project a commanding, sometimes intimidating, "I can do it myself" aura.',
    2: 'You appear to others as gentle, approachable, cooperative, and a highly safe person to talk to. You dress tastefully and present a quiet, harmonious presence.',
    3: 'You project a sunny, charming, witty, and highly popular personality. Others are drawn to your expressive eyes, laughter, and light-hearted conversation.',
    4: 'Others see you as stable, conservative, practical, and highly direct. You project an aura of absolute honesty, work ethic, and no-nonsense capability.',
    5: 'You appear youthful, fashionable, exciting, and highly charismatic. You are perceived as someone who is always on the move, full of stories, and fun to be around.',
    6: 'You project a warm, motherly or fatherly, comforting, and domestic energy. Others naturally come to you for advice, feeling your deep responsibility and caring nature.',
    7: 'Others perceive you as reserved, quiet, intellectual, and somewhat mysterious or aloof. You project an air of deep wisdom, refinement, and integrity.',
    8: 'You project an aura of success, physical power, and natural authority. Others see you as a leader, well-organized, and someone who knows how to handle big business.',
    9: 'You appear to others as warm, generous, charismatic, and worldly. You project a broad-minded, philosophic, and highly tolerant humanitarian presence.',
    11: 'You project an electric, charismatic, and intensely intuitive aura. Others sense your spiritual sensitivity, treating you as someone of high spiritual authority or visionary sight.',
    22: 'Others see you as a giant of competence. You project absolute authority, efficiency, and the rare ability to command large groups with masterly calm.',
    33: 'Others perceive you as a saint-like, comforting, and deeply healing figure. Your presence brings immediate calm and emotional relief to those in distress.'
  },
  birthday: {
    1: 'Being born on a day that reduces to 1 highlights your individualistic, competitive, and pioneering drive. You are an initiator.',
    2: 'Your birth day vibration amplifies your sensitive, cooperative nature, making you an exceptional partner, listener, and diplomat.',
    3: 'Your birth day brings an extra spark of creativity, humor, social charm, and artistic communication to your life.',
    4: 'Your birth day anchors you with practical skills, an eye for detail, discipline, and an appreciation for honest labor.',
    5: 'Your birth day gives you an energetic, highly curious, versatile, and restless spirit. You love travel and quick shifts.',
    6: 'Your birth day infuses your life with deep family values, domestic responsibility, artistic taste, and a desire to serve.',
    7: 'Your birth day enhances your intuition, analytical capacity, love for research, and comfort in quiet contemplation.',
    8: 'Your birth day boosts your business sense, ambition, material organization, and executive potential.',
    9: 'Your birth day expands your compassion, artistic capabilities, tolerance, and broad-minded approach to humanity.',
    11: 'Being born on the 11th gives you immediate access to master-level intuition, visionary ideas, and intense psychic sensitivity.',
    22: 'Being born on the 22nd infuses your core with the potential of the Master Builder, allowing you to ground the highest dreams.'
  },
  attitude: {
    1: 'You react to life with a "can-do", highly independent, and proactive attitude. You hate being told what to do and prefer to solve problems single-handedly.',
    2: 'Your initial reaction to any situation is cooperative, diplomatic, and observational. You seek to keep the peace and understand others before acting.',
    3: 'You approach life with a sense of humor, optimism, and social enthusiasm. You light up a room and look at the glass as half-full.',
    4: 'You approach challenges with a practical, methodical, and structured mindset. You want facts, order, and a plan before moving forward.',
    5: 'Your response to life is fast, adaptable, and excitement-seeking. You love sudden changes and react with curiosity and flexibility.',
    6: 'You approach the world with a highly protective, nurturing, and responsible attitude. You immediately ask: "Who needs help, and how can I fix it?"',
    7: 'You react to situations with quiet analysis, skepticism, and deep contemplation. You do not accept things at face value and need to think about them in private.',
    8: 'You approach life with an executive, highly authoritative, and result-oriented attitude. You immediately take charge and seek practical dominance.',
    9: 'You respond to the world with a deeply caring, philosophical, and universal attitude. You see things from a global perspective and are easily moved by suffering.',
    11: 'You react to life with an electric, deeply intuitive awareness. You sense the unseen dynamics in any room instantly.',
    22: 'You respond to challenges with immense competence, looking immediately to build large-scale solutions that endure.'
  },
  maturity: {
    1: 'In the second half of your life, you will step into your ultimate power as an independent leader and pioneer, standing fully in your own light.',
    2: 'Your mature years will bring deep fulfillment through peaceful partnerships, intuitive counselor roles, and diplomatic endeavors.',
    3: 'Your later years will be a wonderful canvas of creative writing, artistic self-expression, joyful socialization, and youthful play.',
    4: 'Your mature life will bring great stability, concrete assets, respected authority, and the satisfaction of having built lasting structures.',
    5: 'Your future years promise continuous learning, exciting travels, writing, and absolute personal freedom without restrictions.',
    6: 'Your maturity will center on a beautiful home life, being the respected matriarch/patriarch of your family, and healing your community.',
    7: 'Your later years will lead you deep into spiritual studies, writing, teaching, meditation, and achieving true inner wisdom.',
    8: 'Your mature years will bring great executive power, financial success, material rewards, and leadership of substantial organizations.',
    9: 'Your maturity is a beautiful humanitarian transition, focused on teaching, philanthropy, global traveling, and spiritual completion.',
    11: 'Your maturity brings true spiritual illumination, serving as an elder, intuitive teacher, and inspirer of minds.',
    22: 'Your mature years will see the realization of your grandest practical projects, leaving a massive physical legacy for humanity.',
    33: 'Your later years will be an era of profound universal service, healing, and guiding others with pure, unconditional love.'
  },
  personalYear: {
    1: 'A year of new beginnings, fresh starts, and major life changes. It is time to plant seeds, take risks, and assert your independence. What you start now will shape the next 9 years.',
    2: 'A year of patience, partnerships, and quiet growth. Focus on cooperation, diplomacy, and building relationships. Do not force progress; let things develop naturally.',
    3: 'A year of absolute self-expression, creativity, and social joy. Your imagination is heightened. Travel, write, socialize, and express yourself. Avoid scattering your energy.',
    4: 'A year of hard work, building foundations, and organizing your life. Focus on discipline, health, career, and physical assets. It is a year to consolidate and secure.',
    5: 'A year of massive transitions, freedom, and unexpected opportunities. Expect travel, sudden shifts in plans, and exciting social connections. Adaptability is your superpower.',
    6: 'A year of family, home, relationships, and deep responsibilities. Focus on domestic harmony, healing, and community. Many experience marriage, births, or home remodeling.',
    7: 'A year of introspection, self-discovery, spiritual growth, and quiet research. It is a time to rest, study, analyze, and look inward. Do not push for material expansion.',
    8: 'A year of harvest, power, career advancement, and financial opportunities. Your hard work over the past 7 years bears fruit. Stand in your authority and make big moves.',
    9: 'A year of completions, releases, and deep cleansings. It is time to finish outstanding projects, let go of toxic relationships, and prepare for the next cycle. Forgive and release.'
  }
};

const PINNACLE_DESCRIPTIONS: Record<number, string> = {
  1: "A cycle prioritizing self-reliance, leadership, and individual development. You are urged to stand on your own feet and drive new ideas forward.",
  2: "A cycle focused on partnerships, sensitivity, collaboration, and learning patience. Excellent for counseling, diplomacy, and emotional mastery.",
  3: "A cycle of heightened creativity, self-expression, communication, and happiness. You are encouraged to write, speak, perform, and connect.",
  4: "A cycle of building structure, hard work, discipline, and establishing long-term foundations. Outstanding for physical assets, property, and career safety.",
  5: "A cycle of dynamic change, personal freedom, travel, adaptability, and high versatility. A fast-moving era of progressive and major shifts.",
  6: "A cycle centering on deep domestic responsibility, marriage, raising family, teaching, healing, and service. Focus is heavily on home harmony.",
  7: "A cycle of spiritual research, quiet solitude, introspection, and deep analytical learning. Focus shifts from material growth to profound wisdom.",
  8: "A cycle of great physical power, executive responsibility, and financial rewards. Excellent for managing large-scale enterprises or scaling assets.",
  9: "A cycle of universal completion, global humanitarian services, healing, letting go, and developing extensive selfless giving.",
  11: "A master cycle of intense spiritual awakening, cosmic intuition, serving as a visionary teacher, and acting as a magnetic spiritual beacon.",
  22: "A master cycle of legacy building, where grand idealistic dreams are grounded into physically concrete, lasting international structures."
};

const CHALLENGE_DESCRIPTIONS: Record<number, string> = {
  0: "The Challenge of Choice: You face no specific single obstacle. You have complete freedom to pursue any direction, which requires self-starting wisdom.",
  1: "The Challenge of Individuality: Overcoming feelings of weakness, lack of courage, or being dominated by others. Must learn absolute self-belief.",
  2: "The Challenge of Sensitivity: Overcoming hypersensitivity, fear of criticism, and codependency. Must learn to cooperate without losing your identity.",
  3: "The Challenge of Expression: Overcoming self-doubt, shyness, social anxiety, or scattering energies. Must learn to focus and write/speak confidently.",
  4: "The Challenge of Chaos: Overcoming restlessness, dislike of routine, or lazy tendencies. Must learn discipline, patience, and organization.",
  5: "The Challenge of Restlessness: Overcoming fear of change, excessive escapism, or dynamic instability. Must learn constructive and balanced freedom.",
  6: "The Challenge of Perfectionism: Overcoming a tendency to be overly critical of others, self-sacrificing, or codependent. Must learn acceptance.",
  7: "The Challenge of Fear: Overcoming pride, emotional coldness, cynicism, or deep isolation. Must learn to trust, open your heart, and seek inner truth.",
  8: "The Challenge of Materialism: Overcoming greed, obsession with power, or fear of poverty. Must learn to manage material systems with absolute integrity."
};

const KARMIC_DEBT_DETAILS: Record<number, { label: string; description: string }> = {
  13: {
    label: "Karmic Debt 13/4: Discipline & Focused Labor",
    description: "Indicates shortcuts, laziness, or avoidance of honest labor in a prior incarnation. You must work diligently, embrace order, and avoid scattered shortcuts to succeed."
  },
  14: {
    label: "Karmic Debt 14/5: Constructive Freedom & Temperance",
    description: "Represents historical misuse of personal freedom, indulgence, or escaping duties. You face sudden shifts and must learn self-discipline and moderation."
  },
  16: {
    label: "Karmic Debt 16/7: Absolute Humility & Soul Rebirth",
    description: "The 'shattered tower' archetype. Points to past ego, arrogance, or betrayal. Demands shedding egotistical pride, embracing spiritual alignment, and absolute truth."
  },
  19: {
    label: "Karmic Debt 19/1: Spiritual Leadership & Interdependence",
    description: "Points to past misuse of power, dominance, or refusal to cooperate. You must stand completely self-sufficient while learning to graciously receive and support others."
  }
};

// Calculate all details

export function calculateLunarPhase(date: Date): LunarPhase {
  // Simple approximation for lunar phase
  const lp = 2551443; 
  const now = date.getTime();
  const newMoon = new Date(1970, 0, 7, 20, 35, 0).getTime();
  const phase = ((now - newMoon) / 1000) % lp;
  const days = Math.floor(phase / (24 * 3600));
  
  let phaseName = "";
  let insight = "";
  
  if (days <= 1) { phaseName = "New Moon"; insight = "A time for setting deep intentions and planting seeds for the coming cycle."; }
  else if (days <= 6) { phaseName = "Waxing Crescent"; insight = "Focus on actionable steps. Your energy is building towards manifestation."; }
  else if (days <= 9) { phaseName = "First Quarter"; insight = "Friction may arise. Push through resistance and maintain your commitments."; }
  else if (days <= 13) { phaseName = "Waxing Gibbous"; insight = "Refine your plans. Trust the process as things are coming to fruition."; }
  else if (days <= 16) { phaseName = "Full Moon"; insight = "Heightened emotions and culmination. Release what no longer serves your highest good."; }
  else if (days <= 21) { phaseName = "Waning Gibbous"; insight = "Gratitude and introspection. Reflect on the harvest of this cycle."; }
  else if (days <= 24) { phaseName = "Last Quarter"; insight = "Re-evaluation and letting go. Clear physical and energetic clutter."; }
  else { phaseName = "Waning Crescent"; insight = "Rest and surrender. Conserve your energy for the upcoming new cycle."; }

  return {
    phase: phaseName,
    illumination: Math.round((1 - Math.cos((days / 29.53) * 2 * Math.PI)) * 50),
    insight
  };
}

export function calculatePlanetaryHour(date: Date): PlanetaryHour {
  const hours = [
    { planet: "Sun", energy: "Vitality, leadership, and self-expression." },
    { planet: "Venus", energy: "Love, aesthetics, harmony, and wealth." },
    { planet: "Mercury", energy: "Communication, commerce, and swift intellect." },
    { planet: "Moon", energy: "Intuition, emotions, and nurturing domestic affairs." },
    { planet: "Saturn", energy: "Discipline, structure, karma, and long-term planning." },
    { planet: "Jupiter", energy: "Expansion, luck, higher learning, and spirituality." },
    { planet: "Mars", energy: "Action, courage, conflict, and physical exertion." }
  ];
  // Simplification: based on current hour of the day (0-23) + day of the week
  const day = date.getDay();
  const hour = date.getHours();
  // Chaldean order base index per day (0=Sun, 1=Mon...6=Sat)
  const dayStarts = [0, 3, 6, 2, 5, 1, 4];
  const planetIndex = (dayStarts[day] + hour) % 7;
  
  return hours[planetIndex];
}


function analyzePhone(phone: string | undefined, lp: number) {
  if (!phone) return undefined;
  // strip non-digits
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  let sum = 0;
  for(let i=0; i<digits.length; i++) sum += parseInt(digits[i]);
  const vibration = reduceNumber(sum);
  
  let insight = "This number carries a neutral resonance.";
  let suggestion = "Consider adding digits to reach a harmonious frequency.";
  
  if (vibration === lp) {
    insight = "This number perfectly aligns with your Life Path, amplifying your natural magnetic field.";
    suggestion = "Keep this number. It acts as a powerful amplifier for your core destiny.";
  } else if ([3, 6, 9].includes(vibration) && [3, 6, 9].includes(lp)) {
    insight = "Creative and expansive resonance; highly harmonious for social connections.";
    suggestion = "Excellent for networking and creative ventures.";
  } else if ([1, 4, 8].includes(vibration) && [1, 4, 8].includes(lp)) {
    insight = "Strong material and structural resonance; ideal for business.";
    suggestion = "Perfect for career and accumulating resources.";
  } else if ([2, 5, 7].includes(vibration) && [2, 5, 7].includes(lp)) {
    insight = "Deeply analytical or adaptable frequency.";
    suggestion = "Good for research, spiritual work, or travel.";
  } else {
    insight = `The vibration of ${vibration} may introduce subtle friction against your Life Path ${lp} energy.`;
    const target = lp;
    const diff = target - vibration > 0 ? target - vibration : target + 9 - vibration;
    suggestion = `To align this with your Life Path (${lp}), you might consider adding the number ${diff} to your contacts name or acquiring a number summing to ${lp}.`;
  }
  
  return { number: phone, vibration, insight, suggestion };
}

function analyzeName(name: string, expr: number, lp: number) {
  let insight = "Your name frequency creates a unique energetic signature.";
  let suggestion = "No immediate changes recommended.";
  if (expr === lp) {
    insight = "Your name perfectly mirrors your destiny. You are walking your true path.";
    suggestion = "Your current name is a profound asset.";
  } else if ((expr%2) !== (lp%2)) {
    insight = "Your name introduces a contrasting elemental energy to your core path, causing occasional internal friction.";
    suggestion = "Consider emphasizing a middle initial or a nickname that shifts your Expression number closer to your Life Path.";
  } else {
    insight = "Your name harmonizes well with your Life Path, offering supplementary strengths.";
    suggestion = "Embrace the diverse talents your name vibration brings.";
  }
  return { currentExpression: expr, insight, suggestion };
}

function getLifecyclePhases(pinnacles: any) {
  return [
    { stage: 'Youth', ageRange: '0 - ' + pinnacles[0].age, theme: 'Formation & First Lessons', pinnacle: pinnacles[0].number, challenge: pinnacles[0].challenge || 0 },
    { stage: 'Mature', ageRange: pinnacles[0].age + ' - ' + pinnacles[2].age, theme: 'Action & Fruition', pinnacle: pinnacles[1].number, challenge: pinnacles[1].challenge || 0 },
    { stage: 'Wisdom', ageRange: pinnacles[2].age + '+', theme: 'Integration & Legacy', pinnacle: pinnacles[3].number, challenge: pinnacles[3].challenge || 0 }
  ];
}

export function generateNumerologyReport(fullName: string, dateOfBirth: string, timeOfBirth?: string, placeOfBirth?: string, phoneNumber?: string): NumerologyReport {
  const cleanName = fullName.trim().toUpperCase();
  const cleanedDob = dateOfBirth.replace(/[^0-9-]/g, ''); // YYYY-MM-DD
  
  const [yearStr, monthStr, dayStr] = cleanedDob.split('-');
  const birthYear = parseInt(yearStr, 10) || 2000;
  const birthMonth = parseInt(monthStr, 10) || 1;
  const birthDay = parseInt(dayStr, 10) || 1;

  // 1. LIFE PATH NUMBER
  const redMonth = reduceNumber(birthMonth, true);
  const redDay = reduceNumber(birthDay, true);
  
  const yearDigitsSum = birthYear.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  const redYear = reduceNumber(yearDigitsSum, true);
  
  const lifePathRawSum = redMonth + redDay + redYear;
  const lifePathFinal = reduceNumber(lifePathRawSum, true);
  const isLifePathMaster = lifePathFinal === 11 || lifePathFinal === 22 || lifePathFinal === 33;
  
  const lpSteps = [
    `Month of Birth: ${birthMonth} -> Reduced to ${redMonth}`,
    `Day of Birth: ${birthDay} -> Reduced to ${redDay}`,
    `Year of Birth: ${birthYear} -> Digit sum ${yearDigitsSum} -> Reduced to ${redYear}`,
    `Sum of Parts: ${redMonth} + ${redDay} + ${redYear} = ${lifePathRawSum}`,
    lifePathRawSum > 9 && !isLifePathMaster ? `Reduced final sum ${lifePathRawSum} to ${lifePathFinal}` : `Final Vibration: ${lifePathFinal}`
  ];

  // 2. EXPRESSION (DESTINY) NUMBER
  const nameParts = cleanName.split(/\s+/).filter(p => p.length > 0);
  const namePartsReduced: number[] = [];
  const expressionSteps: string[] = [];

  let nameRawValuesSum = 0;
  
  nameParts.forEach(part => {
    let partSum = 0;
    const letterDetails: string[] = [];
    for (const char of part) {
      const val = LETTER_VALUES[char] || 0;
      if (val > 0) {
        partSum += val;
        nameRawValuesSum += val;
        letterDetails.push(`${char}(${val})`);
      }
    }
    const partReduced = reduceNumber(partSum, true);
    namePartsReduced.push(partReduced);
    expressionSteps.push(`${part}: ${letterDetails.join(' + ')} = ${partSum} -> Reduced to ${partReduced}`);
  });

  const combinedExpressionSum = namePartsReduced.reduce((sum, val) => sum + val, 0);
  const expressionFinal = reduceNumber(combinedExpressionSum, true);
  const isExpressionMaster = expressionFinal === 11 || expressionFinal === 22 || expressionFinal === 33;

  expressionSteps.push(
    `Sum of name segments: ${namePartsReduced.join(' + ')} = ${combinedExpressionSum}`,
    combinedExpressionSum > 9 && !isExpressionMaster ? `Reduced final sum ${combinedExpressionSum} to ${expressionFinal}` : `Final Expression Vibration: ${expressionFinal}`
  );

  // 3. SOUL URGE (HEART'S DESIRE) NUMBER
  const soulUrgePartsReduced: number[] = [];
  const soulUrgeSteps: string[] = [];
  
  nameParts.forEach(part => {
    let partSum = 0;
    const vowelDetails: string[] = [];
    for (const char of part) {
      if (isVowel(char, part)) {
        const val = LETTER_VALUES[char] || 0;
        partSum += val;
        vowelDetails.push(`${char}(${val})`);
      }
    }
    const partReduced = reduceNumber(partSum, true);
    soulUrgePartsReduced.push(partReduced);
    if (vowelDetails.length > 0) {
      soulUrgeSteps.push(`${part} (Vowels): ${vowelDetails.join(' + ')} = ${partSum} -> Reduced to ${partReduced}`);
    } else {
      soulUrgeSteps.push(`${part} (Vowels): No vowels found -> 0`);
    }
  });

  const combinedSoulUrgeSum = soulUrgePartsReduced.reduce((sum, val) => sum + val, 0);
  const soulUrgeFinal = reduceNumber(combinedSoulUrgeSum, true);
  const isSoulUrgeMaster = soulUrgeFinal === 11 || soulUrgeFinal === 22 || soulUrgeFinal === 33;

  soulUrgeSteps.push(
    `Sum of segment vowels: ${soulUrgePartsReduced.join(' + ')} = ${combinedSoulUrgeSum}`,
    combinedSoulUrgeSum > 9 && !isSoulUrgeMaster ? `Reduced final sum ${combinedSoulUrgeSum} to ${soulUrgeFinal}` : `Final Soul Urge Vibration: ${soulUrgeFinal}`
  );

  // 4. PERSONALITY NUMBER
  const personalityPartsReduced: number[] = [];
  const personalitySteps: string[] = [];

  nameParts.forEach(part => {
    let partSum = 0;
    const consonantDetails: string[] = [];
    for (const char of part) {
      if (!isVowel(char, part)) {
        const val = LETTER_VALUES[char] || 0;
        partSum += val;
        consonantDetails.push(`${char}(${val})`);
      }
    }
    const partReduced = reduceNumber(partSum, true);
    personalityPartsReduced.push(partReduced);
    if (consonantDetails.length > 0) {
      personalitySteps.push(`${part} (Consonants): ${consonantDetails.join(' + ')} = ${partSum} -> Reduced to ${partReduced}`);
    } else {
      personalitySteps.push(`${part} (Consonants): No consonants found -> 0`);
    }
  });

  const combinedPersonalitySum = personalityPartsReduced.reduce((sum, val) => sum + val, 0);
  const personalityFinal = reduceNumber(combinedPersonalitySum, true);
  const isPersonalityMaster = personalityFinal === 11 || personalityFinal === 22 || personalityFinal === 33;

  personalitySteps.push(
    `Sum of segment consonants: ${personalityPartsReduced.join(' + ')} = ${combinedPersonalitySum}`,
    combinedPersonalitySum > 9 && !isPersonalityMaster ? `Reduced final sum ${combinedPersonalitySum} to ${personalityFinal}` : `Final Personality Vibration: ${personalityFinal}`
  );

  // 5. BIRTHDAY NUMBER
  const birthdayFinal = reduceNumber(birthDay, true);
  const isBirthdayMaster = birthdayFinal === 11 || birthdayFinal === 22;
  const birthdaySteps = [
    `Day of birth: ${birthDay}`,
    birthDay > 9 && !isBirthdayMaster ? `Reduced ${birthDay} to ${birthdayFinal}` : `Final Birthday Vibration: ${birthdayFinal}`
  ];

  // 6. ATTITUDE NUMBER
  const attitudeRaw = birthDay + birthMonth;
  const attitudeFinal = reduceNumber(attitudeRaw, true);
  const isAttitudeMaster = attitudeFinal === 11 || attitudeFinal === 22;
  const attitudeSteps = [
    `Month of Birth (${birthMonth}) + Day of Birth (${birthDay}) = ${attitudeRaw}`,
    attitudeRaw > 9 && !isAttitudeMaster ? `Reduced ${attitudeRaw} to ${attitudeFinal}` : `Final Attitude Vibration: ${attitudeFinal}`
  ];

  // 7. MATURITY NUMBER
  const maturityRaw = lifePathFinal + expressionFinal;
  const maturityFinal = reduceNumber(maturityRaw, true);
  const isMaturityMaster = maturityFinal === 11 || maturityFinal === 22 || maturityFinal === 33;
  const maturitySteps = [
    `Life Path Number (${lifePathFinal}) + Expression Number (${expressionFinal}) = ${maturityRaw}`,
    maturityRaw > 9 && !isMaturityMaster ? `Reduced ${maturityRaw} to ${maturityFinal}` : `Final Maturity Vibration: ${maturityFinal}`
  ];

  // 8. PERSONAL FORECASTS (Year, Month, Day)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-indexed
  const currentDay = new Date().getDate();

  const currentYearReduced = reduceNumber(
    currentYear.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0),
    false
  );
  const personalYearRaw = birthMonth + birthDay + currentYearReduced;
  const personalYearFinal = reduceNumber(personalYearRaw, false); 
  const personalYearSteps = [
    `Current calendar year: ${currentYear} (reduces to ${currentYearReduced})`,
    `Month of birth (${birthMonth}) + Day of birth (${birthDay}) + Current Year reduced (${currentYearReduced}) = ${personalYearRaw}`,
    personalYearRaw > 9 ? `Reduced ${personalYearRaw} to ${personalYearFinal}` : `Final Personal Year Vibration: ${personalYearFinal}`
  ];

  // Personal Month = Personal Year + Current Month
  const personalMonthFinal = reduceNumber(personalYearFinal + currentMonth, false);
  const personalMonthDescriptions: Record<number, string> = {
    1: 'New initiatives, independent action, starting projects, high drive.',
    2: 'Relationships, active listening, patience, processing delays.',
    3: 'Joy, writing, communication, travel, expressive creation.',
    4: 'Organization, building details, career progress, stability.',
    5: 'Adaptive transitions, personal shifts, sales, high freedom.',
    6: 'Domestic affairs, family counselor duties, home renovation.',
    7: 'Quiet introspection, researching truths, deep meditations.',
    8: 'Business gains, physical power, executive focus, harvests.',
    9: 'Completion, letting go, cleaning house, humanitarian releases.'
  };

  // Personal Day = Personal Month + Current Day
  const personalDayFinal = reduceNumber(personalMonthFinal + currentDay, false);
  const personalDayDescriptions: Record<number, string> = {
    1: 'A perfect day for starting new habits, acting alone, and taking courageous leaps.',
    2: 'An excellent day for peace, sensitive conversations, teamwork, and active support.',
    3: 'A day of high creative self-expression, laughter, meeting friends, and writing.',
    4: 'A perfect day for detailed work, structuring, organization, and cleaning files.',
    5: 'Expect surprises, travel, versatile plans, change, and physical vitality.',
    6: 'A day for loving attention to family, home beauty, nurturing, and comfort.',
    7: 'A perfect day for reading, spiritual rest, solitude, and thinking deep.',
    8: 'Excellent for financial matters, transactions, executive choices, and manifestation.',
    9: 'A day for completions, forgiveness, clearing out old elements, and generous acts.'
  };

  // 9. DETECT KARMIC DEBTS
  // Karmic Debts are searched in the sums before ultimate single-digit reduction
  const karmicDebts: KarmicDebt[] = [];
  
  const checkMetricDebt = (metricName: string, rawSum: number, reducedVal: number) => {
    const debtNum = detectKarmicDebt([rawSum]);
    if (debtNum && debtNum !== reducedVal) {
      const details = KARMIC_DEBT_DETAILS[debtNum] || { label: "Karmic Debt", description: "Vibrational challenge" };
      karmicDebts.push({
        metricName,
        debtNumber: debtNum,
        reducedNumber: reducedVal,
        label: details.label,
        description: details.description
      });
    }
  };

  checkMetricDebt("Life Path", lifePathRawSum, lifePathFinal);
  checkMetricDebt("Expression", combinedExpressionSum, expressionFinal);
  checkMetricDebt("Soul Urge", combinedSoulUrgeSum, soulUrgeFinal);
  checkMetricDebt("Personality", combinedPersonalitySum, personalityFinal);

  // Also check birthday day itself as a Karmic Debt source (13, 14, 16, 19)
  if ([13, 14, 16, 19].includes(birthDay)) {
    const details = KARMIC_DEBT_DETAILS[birthDay];
    karmicDebts.push({
      metricName: "Birthday",
      debtNumber: birthDay,
      reducedNumber: birthdayFinal,
      label: details.label,
      description: details.description
    });
  }

  // 10. ADVANCED SERVICES: PINNACLES AND CHALLENGES
  // Reduce Month, Day, Year to simple digits (1-9) for Pinnacle calculations
  const mDigit = reduceNumber(birthMonth, false);
  const dDigit = reduceNumber(birthDay, false);
  const yDigit = reduceNumber(birthYear.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0), false);

  // Age timeline limits:
  const lifePathBase = reduceNumber(lifePathFinal, false); // 1-9
  const age1stEnd = 36 - lifePathBase;
  const age2ndEnd = age1stEnd + 9;
  const age3rdEnd = age2ndEnd + 9;

  // Calculate Pinnacles
  const p1 = reduceNumber(mDigit + dDigit, true);
  const p2 = reduceNumber(dDigit + yDigit, true);
  const p3 = reduceNumber(p1 + p2, true);
  const p4 = reduceNumber(mDigit + yDigit, true);

  const pinnacles: PinnacleCycle[] = [
    {
      stage: 1,
      number: p1,
      ageRange: `Birth to Age ${age1stEnd}`,
      label: `First Pinnacle (Vibe ${p1})`,
      description: PINNACLE_DESCRIPTIONS[p1] || "A foundation cycle focusing on core development."
    },
    {
      stage: 2,
      number: p2,
      ageRange: `Age ${age1stEnd + 1} to Age ${age2ndEnd}`,
      label: `Second Pinnacle (Vibe ${p2})`,
      description: PINNACLE_DESCRIPTIONS[p2] || "An era of active growth and progressive partnerships."
    },
    {
      stage: 3,
      number: p3,
      ageRange: `Age ${age2ndEnd + 1} to Age ${age3rdEnd}`,
      label: `Third Pinnacle (Vibe ${p3})`,
      description: PINNACLE_DESCRIPTIONS[p3] || "A high cycle of peak creative and material opportunities."
    },
    {
      stage: 4,
      number: p4,
      ageRange: `Age ${age3rdEnd + 1} and Beyond`,
      label: `Fourth Pinnacle (Vibe ${p4})`,
      description: PINNACLE_DESCRIPTIONS[p4] || "A legacy phase of consolidated spiritual wisdom and harvest."
    }
  ];

  // Calculate Challenges
  const c1 = Math.abs(mDigit - dDigit);
  const c2 = Math.abs(dDigit - yDigit);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(mDigit - yDigit);

  const challenges: ChallengeCycle[] = [
    {
      stage: 1,
      number: c1,
      ageRange: `Birth to Age ${age1stEnd}`,
      label: `First Challenge (Vibe ${c1})`,
      description: CHALLENGE_DESCRIPTIONS[c1] || "Early-life obstacle to conquer and learn from."
    },
    {
      stage: 2,
      number: c2,
      ageRange: `Age ${age1stEnd + 1} to Age ${age2ndEnd}`,
      label: `Second Challenge (Vibe ${c2})`,
      description: CHALLENGE_DESCRIPTIONS[c2] || "Practical and social trial driving inner transformation."
    },
    {
      stage: 3,
      number: c3,
      ageRange: `Age ${age2ndEnd + 1} to Age ${age3rdEnd}`,
      label: `Third Challenge (Vibe ${c3})`,
      description: CHALLENGE_DESCRIPTIONS[c3] || "The master life-challenge, showing the recurring block."
    },
    {
      stage: 4,
      number: c4,
      ageRange: `Age ${age3rdEnd + 1} and Beyond`,
      label: `Fourth Challenge (Vibe ${c4})`,
      description: CHALLENGE_DESCRIPTIONS[c4] || "Late-life refinement trial to keep spirit polished."
    }
  ];

  // 12. INCLUSION TABLE & KARMIC LESSONS/STRENGTHS (Moved Up)
  const inclusionTable: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const char of cleanName) {
    const val = LETTER_VALUES[char];
    if (val) {
      inclusionTable[val] = (inclusionTable[val] || 0) + 1;
    }
  }

  const karmicLessons: KarmicLesson[] = [];
  const karmicStrengths: KarmicStrength[] = [];

  const karmicLessonDescriptions: Record<number, string> = {
    1: 'Need to build self-confidence, initiative, and stand on your own feet without depending on approval.',
    2: 'Need to cultivate diplomacy, cooperation, patience, and learn to sensitive to others without losing yourself.',
    3: 'Need to express yourself creatively and socially, overcoming shyness or a fear of judgment.',
    4: 'Need to build order, systematic habits, practical discipline, and embrace hard work.',
    5: 'Need to adapt to change, embrace constructive freedom, and learn from life experiences without fear.',
    6: 'Need to embrace family, household responsibility, service to others, and avoid avoiding community duties.',
    7: 'Need to explore deep knowledge, trust your intuition, and avoid intellectual superficiality.',
    8: 'Need to develop business efficiency, master finance/material systems, and handle power with balance.',
    9: 'Need to cultivate universal love, tolerance, compassion, and learn to release attachment.'
  };

  const karmicStrengthDescriptions: Record<number, string> = {
    1: 'Exceptional self-motivation, dynamic energy, and willingness to pioneer new ventures.',
    2: 'Profound innate diplomacy, extreme empathy, and natural supportive listening abilities.',
    3: 'High creative self-expression, natural charisma, and effortless ability to cheer up environments.',
    4: 'Natural discipline, remarkable focus on detail, orderliness, and reliable practical execution.',
    5: 'Highly versatile mind, instant adaptability, love of adventure, and great marketing/communication sense.',
    6: 'Inborn desire to protect, feed, heal, and take care of people. Deep love of beauty and home.',
    7: 'Exceptional intellectual depth, natural analytical research skills, and strong interest in mysteries.',
    8: 'Natural talent for managing money, material projects, business systems, and organizing large endeavors.',
    9: 'Vast cosmic compassion, non-judgmental approach to life, artistic talents, and humanitarian wisdom.'
  };

  Object.entries(inclusionTable).forEach(([numStr, count]) => {
    const num = parseInt(numStr, 10);
    if (count === 0) {
      karmicLessons.push({
        number: num,
        description: karmicLessonDescriptions[num] || 'A missing vibration that requires conscious cultivation in this lifetime.'
      });
    } else if (count >= 3) {
      karmicStrengths.push({
        number: num,
        count,
        description: karmicStrengthDescriptions[num] || 'An abundant vibration that acts as an innate superpower.'
      });
    }
  });

  // DEEP NUMEROLOGY CALCULATIONS
  // Hidden Passion
  let maxCount = 0;
  let hiddenPassionNums: number[] = [];
  Object.entries(inclusionTable).forEach(([numStr, count]) => {
    const num = parseInt(numStr, 10);
    if (count > maxCount) {
      maxCount = count;
      hiddenPassionNums = [num];
    } else if (count === maxCount && maxCount > 0) {
      hiddenPassionNums.push(num);
    }
  });
  const hpNum = hiddenPassionNums.length === 1 ? hiddenPassionNums[0] : hiddenPassionNums;

  // Subconscious Self
  const subconsciousSelfNum = 9 - karmicLessons.length;

  // Balance Number
  let balanceSum = 0;
  nameParts.forEach(part => {
    if (part.length > 0) {
      balanceSum += LETTER_VALUES[part[0]] || 0;
    }
  });
  const balanceFinal = reduceNumber(balanceSum, true);
  const isBalanceMaster = balanceFinal === 11 || balanceFinal === 22 || balanceFinal === 33;

  // Rational Thought
  let firstNameSum = 0;
  if (nameParts.length > 0) {
    for (const char of nameParts[0]) {
      firstNameSum += LETTER_VALUES[char] || 0;
    }
  }
  const rationalThoughtFinal = reduceNumber(firstNameSum + birthDay, true);
  const isRationalMaster = rationalThoughtFinal === 11 || rationalThoughtFinal === 22 || rationalThoughtFinal === 33;

  // Assemble Metrics Object
    let root = reduceNumber(birthDay, false);

  const metrics: NumerologyMetrics = {
    rootNumber: root,
    lifePath: {
      number: lifePathFinal,
      rawBeforeReduction: lifePathRawSum,
      isMaster: isLifePathMaster,
      label: NUMBER_LABELS[lifePathFinal] || `Vibration ${lifePathFinal}`,
      description: NUMBER_DESCRIPTIONS.lifePath[lifePathFinal] || '',
      calculationSteps: lpSteps
    },
    expression: {
      number: expressionFinal,
      rawBeforeReduction: combinedExpressionSum,
      isMaster: isExpressionMaster,
      label: NUMBER_LABELS[expressionFinal] || `Vibration ${expressionFinal}`,
      description: NUMBER_DESCRIPTIONS.expression[expressionFinal] || '',
      calculationSteps: expressionSteps
    },
    soulUrge: {
      number: soulUrgeFinal,
      rawBeforeReduction: combinedSoulUrgeSum,
      isMaster: isSoulUrgeMaster,
      label: NUMBER_LABELS[soulUrgeFinal] || `Vibration ${soulUrgeFinal}`,
      description: NUMBER_DESCRIPTIONS.soulUrge[soulUrgeFinal] || '',
      calculationSteps: soulUrgeSteps
    },
    personality: {
      number: personalityFinal,
      rawBeforeReduction: combinedPersonalitySum,
      isMaster: isPersonalityMaster,
      label: NUMBER_LABELS[personalityFinal] || `Vibration ${personalityFinal}`,
      description: NUMBER_DESCRIPTIONS.personality[personalityFinal] || '',
      calculationSteps: personalitySteps
    },
    birthday: {
      number: birthdayFinal,
      isMaster: isBirthdayMaster,
      label: NUMBER_LABELS[birthdayFinal] || `Vibration ${birthdayFinal}`,
      description: NUMBER_DESCRIPTIONS.birthday[birthdayFinal] || '',
      calculationSteps: birthdaySteps
    },
    attitude: {
      number: attitudeFinal,
      isMaster: isAttitudeMaster,
      label: NUMBER_LABELS[attitudeFinal] || `Vibration ${attitudeFinal}`,
      description: NUMBER_DESCRIPTIONS.attitude[attitudeFinal] || '',
      calculationSteps: attitudeSteps
    },
    maturity: {
      number: maturityFinal,
      isMaster: isMaturityMaster,
      label: NUMBER_LABELS[maturityFinal] || `Vibration ${maturityFinal}`,
      description: NUMBER_DESCRIPTIONS.maturity[maturityFinal] || '',
      calculationSteps: maturitySteps
    },
    hiddenPassion: {
      number: hpNum,
      label: Array.isArray(hpNum) ? 'Multiple Strengths' : `Vibration ${hpNum}`,
      description: "Reveals your specific areas of natural talent and unexpressed desires."
    },
    subconsciousSelf: {
      number: subconsciousSelfNum,
      label: `Vibration ${subconsciousSelfNum}`,
      description: "Shows how you react to emergencies or sudden events."
    },
    balance: {
      number: balanceFinal,
      isMaster: isBalanceMaster,
      label: NUMBER_LABELS[balanceFinal] || `Vibration ${balanceFinal}`,
      description: "Describes the best way to handle difficult or threatening situations."
    },
    rationalThought: {
      number: rationalThoughtFinal,
      isMaster: isRationalMaster,
      label: NUMBER_LABELS[rationalThoughtFinal] || `Vibration ${rationalThoughtFinal}`,
      description: "Reveals the way you think and process information rationally."
    },
    personalYear: {
      number: personalYearFinal,
      year: currentYear,
      label: `Year ${personalYearFinal}: ${NUMBER_LABELS[personalYearFinal]} Vibration`,
      description: NUMBER_DESCRIPTIONS.personalYear[personalYearFinal] || '',
      calculationSteps: personalYearSteps
    },
    personalMonth: {
      number: personalMonthFinal,
      month: currentMonth,
      label: `Personal Month ${personalMonthFinal}`,
      description: personalMonthDescriptions[personalMonthFinal] || ''
    },
    personalDay: {
      number: personalDayFinal,
      day: currentDay,
      label: `Personal Day ${personalDayFinal}`,
      description: personalDayDescriptions[personalDayFinal] || ''
    }
  };

  // 11. PLANES OF EXPRESSION
  const planesCount: Record<'physical' | 'mental' | 'emotional' | 'intuitive', string[]> = {
    physical: [],
    mental: [],
    emotional: [],
    intuitive: []
  };

  let totalLettersInName = 0;
  for (const char of cleanName) {
    const plane = LETTER_PLANES[char];
    if (plane) {
      planesCount[plane].push(char);
      totalLettersInName++;
    }
  }

  const getPlaneData = (plane: 'physical' | 'mental' | 'emotional' | 'intuitive'): PlaneOfExpression => {
    const letters = planesCount[plane];
    const pct = totalLettersInName > 0 ? Math.round((letters.length / totalLettersInName) * 100) : 0;
    
    let intensity: 'Low' | 'Balanced' | 'High' = 'Balanced';
    if (plane === 'physical') {
      if (pct < 20) intensity = 'Low';
      else if (pct > 35) intensity = 'High';
    } else if (plane === 'mental') {
      if (pct < 25) intensity = 'Low';
      else if (pct > 40) intensity = 'High';
    } else if (plane === 'emotional') {
      if (pct < 25) intensity = 'Low';
      else if (pct > 40) intensity = 'High';
    } else if (plane === 'intuitive') {
      if (pct < 10) intensity = 'Low';
      else if (pct > 25) intensity = 'High';
    }

    return {
      count: letters.length,
      percentage: pct,
      intensity,
      letters: Array.from(new Set(letters))
    };
  };

  const planesOfExpression = {
    physical: getPlaneData('physical'),
    mental: getPlaneData('mental'),
    emotional: getPlaneData('emotional'),
    intuitive: getPlaneData('intuitive')
  };

  // Astrological Data
  let astrology = {
    sign: "Unknown",
    rulingPlanet: "Unknown",
    element: "Unknown",
    quality: "Unknown",
    compatibility: ["Unknown"]
  };

  if (birthMonth === 1) {
    astrology = birthDay <= 19 
      ? { sign: "Capricorn", rulingPlanet: "Saturn", element: "Earth", quality: "Cardinal", compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"] }
      : { sign: "Aquarius", rulingPlanet: "Uranus & Saturn", element: "Air", quality: "Fixed", compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"] };
  } else if (birthMonth === 2) {
    astrology = birthDay <= 18
      ? { sign: "Aquarius", rulingPlanet: "Uranus & Saturn", element: "Air", quality: "Fixed", compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"] }
      : { sign: "Pisces", rulingPlanet: "Neptune & Jupiter", element: "Water", quality: "Mutable", compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"] };
  } else if (birthMonth === 3) {
    astrology = birthDay <= 20
      ? { sign: "Pisces", rulingPlanet: "Neptune & Jupiter", element: "Water", quality: "Mutable", compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"] }
      : { sign: "Aries", rulingPlanet: "Mars", element: "Fire", quality: "Cardinal", compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"] };
  } else if (birthMonth === 4) {
    astrology = birthDay <= 19
      ? { sign: "Aries", rulingPlanet: "Mars", element: "Fire", quality: "Cardinal", compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"] }
      : { sign: "Taurus", rulingPlanet: "Venus", element: "Earth", quality: "Fixed", compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"] };
  } else if (birthMonth === 5) {
    astrology = birthDay <= 20
      ? { sign: "Taurus", rulingPlanet: "Venus", element: "Earth", quality: "Fixed", compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"] }
      : { sign: "Gemini", rulingPlanet: "Mercury", element: "Air", quality: "Mutable", compatibility: ["Libra", "Aquarius", "Aries", "Leo"] };
  } else if (birthMonth === 6) {
    astrology = birthDay <= 20
      ? { sign: "Gemini", rulingPlanet: "Mercury", element: "Air", quality: "Mutable", compatibility: ["Libra", "Aquarius", "Aries", "Leo"] }
      : { sign: "Cancer", rulingPlanet: "Moon", element: "Water", quality: "Cardinal", compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"] };
  } else if (birthMonth === 7) {
    astrology = birthDay <= 22
      ? { sign: "Cancer", rulingPlanet: "Moon", element: "Water", quality: "Cardinal", compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"] }
      : { sign: "Leo", rulingPlanet: "Sun", element: "Fire", quality: "Fixed", compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"] };
  } else if (birthMonth === 8) {
    astrology = birthDay <= 22
      ? { sign: "Leo", rulingPlanet: "Sun", element: "Fire", quality: "Fixed", compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"] }
      : { sign: "Virgo", rulingPlanet: "Mercury", element: "Earth", quality: "Mutable", compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"] };
  } else if (birthMonth === 9) {
    astrology = birthDay <= 22
      ? { sign: "Virgo", rulingPlanet: "Mercury", element: "Earth", quality: "Mutable", compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"] }
      : { sign: "Libra", rulingPlanet: "Venus", element: "Air", quality: "Cardinal", compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"] };
  } else if (birthMonth === 10) {
    astrology = birthDay <= 22
      ? { sign: "Libra", rulingPlanet: "Venus", element: "Air", quality: "Cardinal", compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"] }
      : { sign: "Scorpio", rulingPlanet: "Pluto & Mars", element: "Water", quality: "Fixed", compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"] };
  } else if (birthMonth === 11) {
    astrology = birthDay <= 21
      ? { sign: "Scorpio", rulingPlanet: "Pluto & Mars", element: "Water", quality: "Fixed", compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"] }
      : { sign: "Sagittarius", rulingPlanet: "Jupiter", element: "Fire", quality: "Mutable", compatibility: ["Aries", "Leo", "Libra", "Aquarius"] };
  } else if (birthMonth === 12) {
    astrology = birthDay <= 21
      ? { sign: "Sagittarius", rulingPlanet: "Jupiter", element: "Fire", quality: "Mutable", compatibility: ["Aries", "Leo", "Libra", "Aquarius"] }
      : { sign: "Capricorn", rulingPlanet: "Saturn", element: "Earth", quality: "Cardinal", compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"] };
  }

  const analysisSummary = `As an individual possessing a Life Path of ${metrics.lifePath.number} (${metrics.lifePath.label}) and an Expression of ${metrics.expression.number} (${metrics.expression.label}), your life represents a delicate convergence of active energy and inner potential. Your Soul Urge of ${metrics.soulUrge.number} reveals that your deepest heart's desire is fueled by a search for ${metrics.soulUrge.label.toLowerCase()}, which is projected outwardly through your Personality vibration of ${metrics.personality.number}. Born under the sign of ${astrology.sign}, ruled by ${astrology.rulingPlanet}, your numerological path is imbued with ${astrology.element.toLowerCase()} elemental qualities, shaping a unique spiritual path designed to foster complete self-actualization, balance, and growth.`;

  
  const peaceIndex = Math.min(100, Math.max(0, 50 + (metrics.lifePath.number * 2) - (metrics.personalYear.number * 3)));
  const prosperityPotential = Math.min(100, Math.max(0, 60 + (metrics.expression.number * 3) + (metrics.personalYear.number * 2)));

  let phoneAnalysis = undefined;
  if (phoneNumber) {
    const digits = phoneNumber.replace(/\D/g, '');
    let sum = 0;
    for (const char of digits) {
      sum += parseInt(char, 10);
    }
    const vibration = sum > 0 ? reduceNumber(sum) : 0;
    
    let score = 50;
    if (vibration === metrics.lifePath.number) score = 100;
    else if (vibration % 2 === metrics.lifePath.number % 2) score = 80;
    else score = 60;

    phoneAnalysis = {
      number: phoneNumber,
      vibration,
      insight: `A phone vibration of ${vibration} aligns with ${vibration % 2 === 0 ? 'receptive' : 'active'} energies.`,
      suggestion: `Compatibility Score: ${score}/100 against your Life Path (${metrics.lifePath.number}).`
    };
  }

  
  // Enhanced Name Analysis
  let suggestion = metrics.expression.number === metrics.lifePath.number ? 
      'Your name harmonizes well with your Life Path.' : 
      'Consider emphasizing a middle initial or nickname to shift Expression closer to Life Path.';
      
  let insight = 'Your name frequency creates a unique energetic signature.';
  
  if (metrics.expression.number !== metrics.lifePath.number) {
    let diff = metrics.lifePath.number - metrics.expression.number;
    if (diff < 0) diff += 9;
    
    // Letters mapping to this diff
    const letterMap: Record<number, string> = {
      1: 'A, J, S', 2: 'B, K, T', 3: 'C, L, U', 4: 'D, M, V', 5: 'E, N, W', 6: 'F, O, X', 7: 'G, P, Y', 8: 'H, Q, Z', 9: 'I, R'
    };
    const suggestedLetters = letterMap[diff] || '';
    
    suggestion = `To align with your Life Path (${metrics.lifePath.number}), consider emphasizing or adding letters that sum to ${diff} (e.g., ${suggestedLetters}).`;
  }

  const chaldeanSum = getChaldeanCompound(fullName);
  const chaldeanMeaning = getChaldeanMeaning(chaldeanSum);

  const CORNERSTONE_MEANINGS: Record<string, string> = {
    A: 'Initiating, independent, and headstrong. You approach life with pioneering energy and prefer to lead from the front.',
    B: 'Sensitive, cooperative, and emotionally reserved. You prefer teamwork and seek peace, but can keep feelings bottled up.',
    C: 'Highly expressive, creative, and socially magnetic. You approach new things with optimistic communication and charm.',
    D: 'Highly disciplined, practical, and grounded. You value order and solid foundations, but can display stubbornness.',
    E: 'Thrives on freedom, sensory experience, and dynamic change. You are highly adaptable and require constant intellectual stimulation.',
    F: 'Loving, responsible, and family-oriented. You naturally take on domestic responsibilities and seek harmony first.',
    G: 'Analytical, deep, and intellectually spiritual. You prefer quiet introspection and seek deeper scientific or spiritual truths.',
    H: 'Business-minded, highly ambitious, and financially capable. You are self-reliant and focus on building physical power.',
    I: 'Compassionate, emotional, creative, and humanitarian. You feel things deeply and seek artistic completion.',
    J: 'Highly direct, ambitious, and determined. You possess relentless willpower to initiate and complete big projects.',
    K: 'Intuitive, highly dynamic, and inspirational. You carry high-voltage energy and act as a natural catalyst.',
    L: 'Intellectual, warm, and highly communicative. You analyze everything mentally and express your views eloquently.',
    M: 'Highly industrious, systematic, and methodical. You do the hard work and build structures that stand the test of time.',
    N: 'Versatile, non-conformist, and loves adventure. You seek unique perspectives and thrive on travel and change.',
    O: 'Responsible, highly protective, and home-loving. You represent steady, stable, and protective leadership.',
    P: 'Intellectual, deeply analytical, and emotionally reserved. You look at life from a unique, highly specialized viewpoint.',
    Q: 'Highly intuitive, business-savvy, and mysterious. You act on strong inner hunches and hold a unique magnetic power.',
    R: 'Emotional, energetic, and highly powerful. You complete tasks with immense passion and have deep inner strength.',
    S: 'Emotionally intense, dramatic, and highly creative. You hold immense charm and command attention wherever you go.',
    T: 'Cooperative, receptive, and highly detail-oriented. You carry high ideals and build harmonious systems with others.',
    U: 'Highly creative, expressive, and a lover of beauty. You appreciate art and possess a deep emotional depth.',
    V: 'Master builder potential. Highly intuitive yet incredibly practical. You turn ideas into physical, solid reality.',
    W: 'Highly adaptable, loves variety, and communicates beautifully. You thrive in fast-paced, multi-faceted projects.',
    X: 'Responsible, artistic, and sensual. You balance multiple creative projects and prioritize caring for others.',
    Y: 'Solitary, deeply analytical, and spiritually independent. You seek true, deep answers and cherish quiet contemplation.',
    Z: 'Dynamic, highly intuitive, and exceptional at material organization. You balance power with spiritual insight.'
  };

  const FIRST_VOWEL_MEANINGS: Record<string, string> = {
    A: 'Reacts to situations with immediate mental analysis, independent action, and an eagerness to take charge.',
    E: 'Reacts with a strong desire for personal excitement, freedom, and dynamic change.',
    I: 'Reacts with deep empathy, profound emotional compassion, and highly active intuitive sensitivity.',
    O: 'Reacts with protective concern, domestic responsibility, and emotional depth.',
    U: 'Reacts with creative expressiveness, artistic visualization, and a touch of dramatic flair.',
    Y: 'Reacts with quiet contemplation, analytical questioning, and a need for spiritual verification.'
  };

  const firstName = fullName.trim().split(/\s+/)[0] || '';
  const cornerstone = firstName.charAt(0).toUpperCase();
  const capstone = firstName.charAt(firstName.length - 1).toUpperCase();
  let firstVowel = '';
  for (const char of firstName) {
    if (isVowel(char, firstName)) {
      firstVowel = char.toUpperCase();
      break;
    }
  }

  const nameAnalysis = {
    currentExpression: metrics.expression.number,
    insight: `Your Pythagorean Expression reduces to ${metrics.expression.number}. Your Chaldean compound is ${chaldeanSum} (${chaldeanMeaning}).`,
    suggestion,
    chaldeanSum,
    chaldeanMeaning,
    cornerstone: cornerstone || undefined,
    cornerstoneMeaning: CORNERSTONE_MEANINGS[cornerstone] || undefined,
    capstone: capstone || undefined,
    capstoneMeaning: CORNERSTONE_MEANINGS[capstone] || undefined,
    firstVowel: firstVowel || undefined,
    firstVowelMeaning: FIRST_VOWEL_MEANINGS[firstVowel] || undefined,
    vowelSum: metrics.soulUrge.number,
    consonantSum: metrics.personality.number
  };


  return {
    peaceIndex,
    prosperityPotential,
    phoneAnalysis,
    nameAnalysis,
    input: { fullName, dateOfBirth, timeOfBirth, placeOfBirth, phoneNumber },
    metrics,
    planesOfExpression,
    karmicLessons,
    karmicStrengths,
    pinnacles,
    challenges,
    karmicDebts,
    inclusionTable,
    astrology,
    analysisSummary,
    lifePredictions: (() => {
      const preds = generateLifePredictions(metrics, challenges, pinnacles, birthYear, karmicLessons, birthDay);
      return preds;
    })(),
    remedies: generateRemedies(metrics, pinnacles, challenges, birthYear),
    spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear, karmicLessons, birthDay), birthYear, pinnacles),
    masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear, karmicLessons, birthDay), pinnacles, challenges, birthYear),
    lunarPhase: calculateLunarPhase(new Date()),
    planetaryHour: calculatePlanetaryHour(new Date())
  };
}



function generateRemedies(metrics: NumerologyMetrics, pinnacles: PinnacleCycle[], challenges: ChallengeCycle[], birthYear: number): { category: string, advice: string }[] {
  const lp = metrics.lifePath.number;
  const remedies = [];
  
  const currentAge = new Date().getFullYear() - birthYear;
  const py = metrics.personalYear.number;
  
  // Personal Year Phase
  if (py === 1) remedies.push({ category: "Current Phase (Year 1)", advice: "You are in a cycle of new beginnings. Take bold action and plant new seeds. Remedy: Avoid clinging to past routines; wear carnelian or red to boost courage." });
  else if (py === 2) remedies.push({ category: "Current Phase (Year 2)", advice: "You are in a cycle of partnerships and patience. Remedy: Practice active listening and diplomacy; avoid rushing things, let them develop naturally." });
  else if (py === 3) remedies.push({ category: "Current Phase (Year 3)", advice: "You are in a cycle of self-expression and creativity. Remedy: Engage in creative writing or speaking; guard against scattered energy and superficiality." });
  else if (py === 4) remedies.push({ category: "Current Phase (Year 4)", advice: "You are in a cycle of hard work and building solid foundations. Remedy: Organize your finances and home; embrace discipline over spontaneity." });
  else if (py === 5) remedies.push({ category: "Current Phase (Year 5)", advice: "You are in a cycle of rapid changes and freedom. Remedy: Stay adaptable and travel if possible; guard against reckless impulses and overindulgence." });
  else if (py === 6) remedies.push({ category: "Current Phase (Year 6)", advice: "You are in a cycle of family, responsibility, and domestic harmony. Remedy: Nurture your home environment; avoid taking on others' burdens unnecessarily." });
  else if (py === 7) remedies.push({ category: "Current Phase (Year 7)", advice: "You are in a cycle of spiritual introspection and analysis. Remedy: Schedule solitary retreats; prioritize meditation over socializing, and study." });
  else if (py === 8) remedies.push({ category: "Current Phase (Year 8)", advice: "You are in a cycle of material manifestation and career growth. Remedy: Step into leadership; ensure ethical dealings to avoid karmic backlash." });
  else if (py === 9) remedies.push({ category: "Current Phase (Year 9)", advice: "You are in a cycle of completion and release. Remedy: Forgive past grievances, declutter your life, and prepare for a new cycle." });

  // Current Pinnacle and Challenge
  const extractAgeEnd = (ageStr: string) => {
    const match = ageStr.match(/Age (\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  };
  
  let currentPinnacle = pinnacles[3];
  let currentChallenge = challenges[3];
  for (let i = 0; i < 3; i++) {
    const ageEnd = extractAgeEnd(pinnacles[i].ageRange);
    if (currentAge <= ageEnd) {
      currentPinnacle = pinnacles[i];
      currentChallenge = challenges[i];
      break;
    }
  }

  remedies.push({ 
    category: `Active Pinnacle (${currentPinnacle.number})`, 
    advice: `You are currently in a Pinnacle phase governed by ${currentPinnacle.number}. Embrace opportunities related to ${currentPinnacle.number === 1 ? 'leadership and independence' : currentPinnacle.number === 2 ? 'cooperation and harmony' : currentPinnacle.number === 3 ? 'creativity and communication' : currentPinnacle.number === 4 ? 'hard work and structure' : currentPinnacle.number === 5 ? 'change and freedom' : currentPinnacle.number === 6 ? 'family and responsibility' : currentPinnacle.number === 7 ? 'spiritual growth and study' : currentPinnacle.number === 8 ? 'business and manifestation' : 'humanitarianism and closure'}.` 
  });
  
  remedies.push({ 
    category: `Active Challenge (${currentChallenge.number})`, 
    advice: `Your current overarching obstacle is Challenge ${currentChallenge.number}. You must overcome ${currentChallenge.number === 0 ? 'the illusion of no challenges by staying proactive' : currentChallenge.number === 1 ? 'self-doubt and fear of leading' : currentChallenge.number === 2 ? 'oversensitivity and fear of conflict' : currentChallenge.number === 3 ? 'scattered focus and fear of expression' : currentChallenge.number === 4 ? 'laziness or rigid stubbornness' : currentChallenge.number === 5 ? 'fear of change and impulsivity' : currentChallenge.number === 6 ? 'perfectionism and domestic friction' : currentChallenge.number === 7 ? 'isolation and intellectual arrogance' : currentChallenge.number === 8 ? 'material greed and fear of failure' : 'emotional clinging and lack of forgiveness'}.` 
  });

  // Life Path specific
  if (lp === 1 || lp === 8) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Incorporate intense physical exercise (like martial arts, weightlifting) to burn off excess ambition and prevent stress-induced cardiovascular issues." });
    remedies.push({ category: "Mental Framing", advice: "Practice active listening. Your tendency to dominate conversations can alienate allies you need for long-term success." });
  } else if (lp === 2 || lp === 6) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Establish strict personal boundaries. You must practice saying 'no' without guilt to prevent emotional burnout from helping others." });
    remedies.push({ category: "Environmental", advice: "Spend time near water or in meticulously organized, peaceful environments to reset your highly sensitive nervous system." });
  } else if (lp === 3 || lp === 5) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Grounding routines are essential. Commit to waking up at the exact same time every day to counteract your naturally scattered, restless energy." });
    remedies.push({ category: "Mental Framing", advice: "Finish what you start. Before picking up a new hobby or project, force yourself to complete the previous one to build self-trust." });
  } else if (lp === 4) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Incorporate flexibility into your life—both physically (yoga, stretching) and mentally (spontaneous weekend trips without an itinerary)." });
  } else if (lp === 7 || lp === 9) {
    remedies.push({ category: "Environmental", advice: "You require solitary retreats. Designate a quiet space in your home strictly for meditation, reading, or processing your deep thoughts." });
    remedies.push({ category: "Mental Framing", advice: "Avoid intellectual arrogance (7) or playing the martyr (9). Stay connected to the mundane, practical world to avoid severe detachment." });
  }

  // Check for karmic debts
  const debts = [];
  if (metrics.lifePath.rawBeforeReduction === 13 || metrics.expression.rawBeforeReduction === 13 || metrics.soulUrge.rawBeforeReduction === 13) debts.push(13);
  if (metrics.lifePath.rawBeforeReduction === 14 || metrics.expression.rawBeforeReduction === 14 || metrics.soulUrge.rawBeforeReduction === 14) debts.push(14);
  if (metrics.lifePath.rawBeforeReduction === 16 || metrics.expression.rawBeforeReduction === 16 || metrics.soulUrge.rawBeforeReduction === 16) debts.push(16);
  if (metrics.lifePath.rawBeforeReduction === 19 || metrics.expression.rawBeforeReduction === 19 || metrics.soulUrge.rawBeforeReduction === 19) debts.push(19);

  if (debts.includes(13)) remedies.push({ category: "Karmic Debt 13 Remedy", advice: "You must overcome laziness and shortcuts. Success will only come through disciplined, hard work. Never give up when obstacles arise." });
  if (debts.includes(14)) remedies.push({ category: "Karmic Debt 14 Remedy", advice: "You must learn temperance and moderation. Avoid overindulgence in food, alcohol, or risky behaviors to balance past-life excesses." });
  if (debts.includes(16)) remedies.push({ category: "Karmic Debt 16 Remedy", advice: "You will experience sudden ego-deaths or relationship resets. Practice deep humility and spirituality; do not cling to material status." });
  if (debts.includes(19)) remedies.push({ category: "Karmic Debt 19 Remedy", advice: "You must learn to ask for help and not abuse your power. Stand on your own two feet, but realize you are part of a larger community." });

  return remedies;
}

function generateSpiritualRemedies(
  metrics: NumerologyMetrics,
  challenges: ChallengeCycle[],
  karmicLessons: KarmicLesson[],
  karmicDebts: KarmicDebt[],
  lifePredictions: any[],
  birthYear: number,
  pinnacles: PinnacleCycle[]
): SpiritualRemedySection[] {
  const lp = metrics.lifePath.number;
  const py = metrics.personalYear.number;
  const currentAge = new Date().getFullYear() - birthYear;

  const extractAgeEnd = (ageStr: string) => {
    const match = ageStr.match(/Age (\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  };
  
  let currentPinnacle = pinnacles[3];
  let currentChallenge = challenges[3];
  for (let i = 0; i < 3; i++) {
    const ageEnd = extractAgeEnd(pinnacles[i].ageRange);
    if (currentAge <= ageEnd) {
      currentPinnacle = pinnacles[i];
      currentChallenge = challenges[i];
      break;
    }
  }

  const pinnacleNum = currentPinnacle.number;
  const challengeNum = currentChallenge.number;

  // ==========================================
  // CALCULATE ACTIVE CURRENT LIFE PHASE ALIGNMENT SCORES
  // ==========================================

  // 1. Career & Purpose Current Score
  let currentCareerScore = 70; // Baseline
  if (py === 1) currentCareerScore += 18;
  else if (py === 8) currentCareerScore += 20;
  else if (py === 3) currentCareerScore += 10;
  else if (py === 4) currentCareerScore += 12;
  else if (py === 7) currentCareerScore -= 10;
  else if (py === 9) currentCareerScore -= 15;
  else currentCareerScore += 5;

  if (pinnacleNum === 1 || pinnacleNum === 8) currentCareerScore += 8;
  else if (pinnacleNum === 4) currentCareerScore += 6;
  else if (pinnacleNum === 22 || pinnacleNum === 11) currentCareerScore += 10;

  if (challengeNum === 1 || challengeNum === 8) currentCareerScore -= 12;
  else if (challengeNum === 4) currentCareerScore -= 10;
  else if (challengeNum === 3) currentCareerScore -= 6;

  // 2. Love & Relationships Current Score
  let currentLoveScore = 70;
  if (py === 6) currentLoveScore += 22;
  else if (py === 2) currentLoveScore += 18;
  else if (py === 5) currentLoveScore -= 15;
  else if (py === 7) currentLoveScore -= 12;
  else if (py === 9) currentLoveScore += 5;
  else if (py === 1) currentLoveScore -= 5;
  else currentLoveScore += 5;

  if (pinnacleNum === 2 || pinnacleNum === 6) currentLoveScore += 10;
  else if (pinnacleNum === 9 || pinnacleNum === 33) currentLoveScore += 8;

  if (challengeNum === 2 || challengeNum === 6) currentLoveScore -= 15;
  else if (challengeNum === 7) currentLoveScore -= 12;
  else if (challengeNum === 5) currentLoveScore -= 10;

  // 3. Wealth & Finance Current Score
  let currentWealthScore = 70;
  if (py === 8) currentWealthScore += 22;
  else if (py === 4) currentWealthScore += 14;
  else if (py === 1) currentWealthScore += 10;
  else if (py === 5) currentWealthScore -= 10;
  else if (py === 7) currentWealthScore -= 12;
  else if (py === 9) currentWealthScore -= 15;
  else currentWealthScore += 5;

  if (pinnacleNum === 8) currentWealthScore += 10;
  else if (pinnacleNum === 4) currentWealthScore += 8;
  else if (pinnacleNum === 22) currentWealthScore += 12;

  if (challengeNum === 8) currentWealthScore -= 15;
  else if (challengeNum === 4) currentWealthScore -= 12;
  else if (challengeNum === 5) currentWealthScore -= 8;

  // 4. Health & Vitality Current Score
  let currentHealthScore = 70;
  if (py === 6) currentHealthScore += 12;
  else if (py === 3) currentHealthScore += 8;
  else if (py === 1 || py === 8) currentHealthScore -= 10;
  else if (py === 5) currentHealthScore -= 15;
  else if (py === 7) currentHealthScore -= 12;
  else if (py === 4) currentHealthScore -= 8;
  else if (py === 9) currentHealthScore -= 10;
  else currentHealthScore += 5;

  if (pinnacleNum === 5) currentHealthScore -= 6;
  else if (pinnacleNum === 6) currentHealthScore += 8;

  if (challengeNum === 5) currentHealthScore -= 12;
  else if (challengeNum === 7) currentHealthScore -= 10;
  else if (challengeNum === 1 || challengeNum === 8) currentHealthScore -= 6;

  // 5. Spiritual Path Current Score
  let currentSpiritualScore = 70;
  if (py === 7) currentSpiritualScore += 25;
  else if (py === 9) currentSpiritualScore += 18;
  else if (py === 5) currentSpiritualScore += 8;
  else if (py === 8) currentSpiritualScore -= 12;
  else if (py === 4) currentSpiritualScore -= 8;
  else currentSpiritualScore += 5;

  if (pinnacleNum === 7 || pinnacleNum === 9) currentSpiritualScore += 12;
  else if (pinnacleNum === 11 || pinnacleNum === 22 || pinnacleNum === 33) currentSpiritualScore += 15;

  if (challengeNum === 7) currentSpiritualScore -= 18;
  else if (challengeNum === 9) currentSpiritualScore -= 10;

  // Clamp current scores safely between 15% and 98%
  const careerScore = Math.max(15, Math.min(98, currentCareerScore));
  const loveScore = Math.max(15, Math.min(98, currentLoveScore));
  const wealthScore = Math.max(15, Math.min(98, currentWealthScore));
  const healthScore = Math.max(15, Math.min(98, currentHealthScore));
  const spiritualScore = Math.max(15, Math.min(98, currentSpiritualScore));

  // ==========================================
  // DYNAMIC SECTOR REMEDIES GENERATION
  // ==========================================

  // Sector A: Career & Purpose
  let careerChallengeText = "";
  if (careerScore < 50) {
    careerChallengeText = `Your professional alignment is facing severe active pressure from Personal Year ${py} and Active Challenge ${challengeNum}. You may be experiencing professional stagnation, severe authority friction, or feeling completely blocked in your current work duties.`;
  } else if (careerScore < 70) {
    careerChallengeText = `You are in an active rebuilding and structuring phase in your work sphere. Personal Year ${py} prompts you to ${py === 1 ? 'initiate bold changes' : py === 4 ? 'organize systems meticulously' : py === 8 ? 'scale business actions' : 'stabilize positions'}, but Active Challenge ${challengeNum} creates self-doubt or procrastination that stalls your professional launch.`;
  } else {
    careerChallengeText = `Your career frequency is running on a highly stable, positive current. Assisted by Personal Year ${py} and Pinnacle ${pinnacleNum}, you are fully equipped to take on executive roles and implement high-impact professional projects with minimal structural friction.`;
  }

  const careerRemedy: SpiritualRemedySection = {
    sector: 'Career & Purpose',
    alignmentScore: careerScore,
    challengeText: careerChallengeText,
    colorRemedy: {
      color: [1, 8].includes(py) ? "Solar Crimson & Burnished Bronze" : "Deep Royal Blue & Silver",
      vibration: [1, 8].includes(py) 
        ? "Raw solar drive, pioneering courage, and resolute command over your workspace." 
        : "Focused structural logic, professional composure, and balanced executive speech.",
      practice: "Wear this color or place corresponding crystals (like Pyrite or Carnelian) on the right corner of your desk to focus your career intentions."
    },
    sacredPractice: {
      title: [1, 8, 4].includes(py) || [1, 8].includes(challengeNum)
        ? "Solar Plexus Willpower Activator & Clear Priority Journaling"
        : "The Sunday Night Professional Strategy Audit & Focus Reclamation",
      frequency: "Daily, before starting work (3-5 minutes)",
      instructions: [1, 8, 4].includes(py) || [1, 8].includes(challengeNum)
        ? "Sit upright. Perform 1 minute of rapid abdominal breathing (Breath of Fire) to charge your willpower. Open your notebook and write exactly three non-negotiable professional targets for the day, closing your eyes to visualize them as successfully executed."
        : "Before beginning your week, spend 10 minutes reviewing your current projects. Write down the single biggest systemic block, list three steps to delegate or simplify it, and state aloud: 'I focus my mental capital on tasks that match my ultimate legacy.'"
    },
    mantra: {
      sanskrit: "Om Hreem Shreem Lakshmibhayo Namah",
      englishTranslation: "Om, I synchronize my active willpower with the divine frequency of ultimate prosperity, leadership, and professional alignment.",
      benefits: "Overcomes imposter syndrome, calms executive stress, and dissolves obstacles that blockade horizontal and vertical career leaps."
    }
  };

  // Sector B: Love & Relationships
  let loveChallengeText = "";
  if (loveScore < 50) {
    loveChallengeText = `Your relationship sector is carrying deep active lessons. Under Personal Year ${py} and Active Challenge ${challengeNum}, you are facing challenges with codependency, unvoiced resentment, or a fear of emotional vulnerability. Old wounds are mirroring in current interactions.`;
  } else if (loveScore < 70) {
    loveChallengeText = `Your emotional alignment is undergoing active recalibration. Personal Year ${py} asks you to ${py === 6 ? 'nurture family commitments' : py === 2 ? 'practice patient diplomacy' : 'heal internal boundaries'}, but Active Challenge ${challengeNum} triggers a defensive tendency to withdraw or become overly critical of loved ones.`;
  } else {
    loveChallengeText = `Your emotional frequency is highly resonant and receptive. Governed by the supportive rays of Personal Year ${py} and Pinnacle ${pinnacleNum}, you are radiating natural warmth and magnetic safety, making this a peak period for deep romantic and family consolidation.`;
  }

  const loveRemedy: SpiritualRemedySection = {
    sector: 'Love & Relationships',
    alignmentScore: loveScore,
    challengeText: loveChallengeText,
    colorRemedy: {
      color: "Peach-Rose & Sage Green",
      vibration: "Unconditional heart-center stabilization, soft energetic boundary shielding, and inner-child calming.",
      practice: "Carry a piece of raw Rose Quartz or visualize a warm peach shield around your chest during tense conversations to immediately de-escalate auric friction."
    },
    sacredPractice: {
      title: [2, 6].includes(challengeNum) || [2, 6, 7].includes(py)
        ? "Thymus Gland Tapping & Sovereign Emotional Shielding"
        : "Vulnerability Lettering & Compassionate Breathwork",
      frequency: "Twice weekly, during evening quiet hours (5 minutes)",
      instructions: [2, 6].includes(challengeNum) || [2, 6, 7].includes(py)
        ? "Gently tap the center of your chest (Thymus gland) with your fingertips while breathing deeply. Affirm: 'I am emotionally sovereign. I release codependency and choose safe, mutual, and reciprocal love.' Feel the physical resonance of the tapping."
        : "Write down any unexpressed emotional friction on a blank sheet of paper. Read it to yourself to honor your feelings, and then safely burn or tear the paper to symbolize the release of lingering resentment from your aura."
    },
    mantra: {
      sanskrit: "Aham Prema",
      englishTranslation: "I am Divine, Unconditional Love in physical form.",
      benefits: "Heals childhood abandonment loops, melts defensive emotional armor, and retunes your auric signal to attract healthy, healing relationships."
    }
  };

  // Sector C: Wealth & Finance
  let wealthChallengeText = "";
  if (wealthScore < 50) {
    wealthChallengeText = `Abundance frequencies are facing heavy active blocks. Under Personal Year ${py} and Active Challenge ${challengeNum}, you are navigating temporary financial stagnation, unexpected outlays, or a severe scarcity-mindset pattern that restricts your flow.`;
  } else if (wealthScore < 70) {
    wealthChallengeText = `Your financial manifestation requires disciplined adjustment. Personal Year ${py} demands ${py === 8 ? 'decisive expansion' : py === 4 ? 'rigid conservative budgeting' : 'extreme adaptability in financial streams'}, but Active Challenge ${challengeNum} triggers impulsive emotional spending or disorganized bookkeeping.`;
  } else {
    wealthChallengeText = `Your material frequency is highly aligned and supportive. Backed by the rich, prosperous currents of Personal Year ${py} and Pinnacle ${pinnacleNum}, you have a highly heightened magnetic capability to attract resources, negotiate contracts, and establish lasting security.`;
  }

  const wealthRemedy: SpiritualRemedySection = {
    sector: 'Wealth & Finance',
    alignmentScore: wealthScore,
    challengeText: wealthChallengeText,
    colorRemedy: {
      color: "Antique Roman Gold & Emerald Jade",
      vibration: "Resolute prosperity intelligence, abundance magnetic grounding, and material-plane structural stability.",
      practice: "Keep a gold-accented notepad for financial planning, or carry jade in your purse to continually charge your material intentions with growing abundance."
    },
    sacredPractice: {
      title: [4, 8].includes(challengeNum) || [4, 8].includes(py)
        ? "The 10-Minute Conscious Financial Ledger & Golden Sun Infusion"
        : "New Moon Prosperity Projection & Release of Material Grips",
      frequency: "Weekly, on Friday afternoons (10 minutes)",
      instructions: [4, 8].includes(challengeNum) || [4, 8].includes(py)
        ? "Do not avoid your numbers! Log all income and expenses with active appreciation for the value exchanged. Then close your eyes and visualize a golden sun above your head, pouring liquid gold light down your spine, solidifying your root chakra and anchoring financial safety."
        : "During the New Moon, write a specific material intention on a dried bay leaf using gold ink. Hold it in your hands, feel the absolute relief of the goal already being met, and then safely burn it, letting the smoke carry your manifestation into the universe."
    },
    mantra: {
      sanskrit: "Om Shreem Maha Lakshmiyei Namaha",
      englishTranslation: "Om, I align my material actions and thoughts with the supreme universal source of abundance, beauty, and righteous wealth.",
      benefits: "Overcomes subconscious scarcity blocks, stabilizes turbulent money anxieties, and brings practical wisdom to resource management."
    }
  };

  // Sector D: Health & Vitality
  let healthChallengeText = "";
  if (healthScore < 50) {
    healthChallengeText = `Your biological vessel is under significant energetic pressure. Under Personal Year ${py} and Active Challenge ${challengeNum}, you are highly vulnerable to acute nervous exhaustion, physical burnout, or ignoring early somatic warnings of stress.`;
  } else if (healthScore < 70) {
    healthChallengeText = `Your energy reserves are operating in a deficit. Personal Year ${py} has been demanding excessive mental output, while Active Challenge ${challengeNum} triggers an overactive nervous system, causing insomnia or physical tension in your muscles.`;
  } else {
    healthChallengeText = `Your physical vessel is sustaining robust recovery and vitality. Backed by the balanced waves of Personal Year ${py} and Pinnacle ${pinnacleNum}, you possess excellent cellular recovery; maintain this current with consistent daily alignment habits.`;
  }

  const healthRemedy: SpiritualRemedySection = {
    sector: 'Health & Vitality',
    alignmentScore: healthScore,
    challengeText: healthChallengeText,
    colorRemedy: {
      color: "Sage Green & Warm Amber",
      vibration: "Nervous system cooling, adrenal stabilization, and cellular repair.",
      practice: "Spend five minutes barefoot on the lawn (Earthing) or wrap yourself in sage green blankets to instantly downregulate your fight-or-flight response."
    },
    sacredPractice: {
      title: "The 4-7-8 Parasympathetic Vagus Nerve Reset",
      frequency: "Daily, upon waking and before sleep (3 minutes)",
      instructions: "Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, and exhale slowly through your mouth with a soft 'whoosh' sound for 8 seconds. Complete this cycle exactly 4 times. This medically and metaphysically resets your nervous system, soothing somatic anxiety."
    },
    mantra: {
      sanskrit: "Om Sri Dhanvantre Namaha",
      englishTranslation: "Om, salutations to the supreme divine source of healing, holistic medicine, and physical wholeness.",
      benefits: "Balances cellular vibrations, clears deep-seated tension blocks, and sensitizes your intuition to what your body needs to thrive."
    }
  };

  // Sector E: Spiritual Path
  let spiritualChallengeText = "";
  if (spiritualScore < 50) {
    spiritualChallengeText = `Your spiritual alignment is navigating a 'Dark Night of the Soul' phase. Personal Year ${py} and Active Challenge ${challengeNum} trigger severe existential doubt, spiritual skepticism, or a feeling of absolute separation from your higher guidance.`;
  } else if (spiritualScore < 70) {
    spiritualChallengeText = `Your intuitive path is encountering heavy mental filters. Personal Year ${py} urges you to ${py === 7 ? 'undertake deep esoteric study' : py === 9 ? 'detach from ego desires' : 'seek inner contemplation'}, but Active Challenge ${challengeNum} creates intellectual pride or a fear of quiet solitude that stalls your psychic integration.`;
  } else {
    spiritualChallengeText = `Your spiritual channel is wide open and highly luminous. Influenced by the transcendent frequencies of Personal Year ${py} and Pinnacle ${pinnacleNum}, your third-eye is receptive to direct cosmic downloads, psychic dreams, and strong synchronistic currents.`;
  }

  const spiritualRemedy: SpiritualRemedySection = {
    sector: 'Spiritual Path',
    alignmentScore: spiritualScore,
    challengeText: spiritualChallengeText,
    colorRemedy: {
      color: "Cosmic Indigo & Amethyst Violet",
      vibration: "Third-eye and crown chakra activation, psychic shielding, and absolute inner peace.",
      practice: "Light a lavender candle during prayer or wear violet accessories to insulate your auric field from external collective anxiety."
    },
    sacredPractice: {
      title: [7].includes(py) || [7].includes(challengeNum)
        ? "Vipassana Silent Breath Observation & Narrative Dissolution"
        : "The Fire-Writing Release Ritual & Cosmic Aura Cleansing",
      frequency: "Daily, before sleep (5-10 minutes)",
      instructions: [7].includes(py) || [7].includes(challengeNum)
        ? "Sit in complete silence. Close your eyes. Simply observe the cold air entering your nostrils and the warm air leaving. If your mind creates doubts or arguments, label it 'thinking' and return to the breath. This dissolves intellectual ego blockages."
        : "Sit quietly, close your eyes, and visualize a sweeping violet light starting from your feet and slowly moving up to your head. Imagine this light sweeping away all negative impressions, leaving your aura completely crystalline."
    },
    mantra: {
      sanskrit: "Om Namah Shivaya",
      englishTranslation: "Om, I bow to the supreme inner divinity that dissolves all ego, illusions, and limitations.",
      benefits: "Burns away ancestral karmic residue, pacifies the critical mind, and connects your individual consciousness directly to the cosmic web."
    }
  };

  return [careerRemedy, loveRemedy, wealthRemedy, healthRemedy, spiritualRemedy];
}

function generateMasterCrystals(metrics: NumerologyMetrics, karmicDebts: KarmicDebt[], lifePredictions: any[], pinnacles: PinnacleCycle[], challenges: ChallengeCycle[], birthYear: number): MasterCrystal[] {
  const lp = metrics.lifePath.number;
  const su = metrics.soulUrge.number;
  
  const crystals: MasterCrystal[] = [];

  const getCrystalForSector = (category: string, score: number): MasterCrystal => {
    const isPrimary = score < 60;
    if (category.includes('Career')) {
      return {
        name: [1, 8].includes(lp) ? "Tiger's Eye" : "Pyrite",
        benefits: isPrimary 
          ? "Urgently addresses your Career sector blockage by grounding erratic ambitions and activating the solar plexus for sustained executive focus." 
          : "Harmonizes your professional drive, preventing ego burnout and ensuring your efforts yield tangible structural results.",
        methodOfUse: "Keep visibly on your work desk or carry in your pocket during high-stakes negotiations."
      };
    } else if (category.includes('Marriage') || category.includes('Love')) {
      return {
        name: [2, 6, 9].includes(su) ? "Rose Quartz" : "Rhodonite",
        benefits: isPrimary 
          ? "Directly neutralizes relational friction by dissolving emotional armor and promoting unconditional empathy." 
          : "Balances your emotional frequencies, helping you attract and maintain harmonious, deeply connected partnerships.",
        methodOfUse: "Wear as a pendant over the heart chakra or place on your bedside table."
      };
    } else if (category.includes('Health')) {
      return {
        name: [3, 5].includes(lp) ? "Amethyst" : "Clear Quartz",
        benefits: isPrimary 
          ? "Targets your vitality deficit by clearing nervous system static and promoting deep, cellular-level restorative rest." 
          : "Amplifies your natural life force and purifies your auric field to support ongoing physical and mental resilience.",
        methodOfUse: "Place under your pillow to combat insomnia or hold during deep breathing exercises."
      };
    } else if (category.includes('Wealth') || category.includes('Finance')) {
      return {
        name: [4, 8].includes(lp) ? "Citrine" : "Green Aventurine",
        benefits: isPrimary 
          ? "Urgently clears scarcity mindset blockages in your financial sector, stimulating the continuous flow of material abundance." 
          : "Acts as a magnetic amplifier for wealth opportunities, ensuring your cosmic timing aligns with financial growth.",
        methodOfUse: "Keep in your wallet, safe, or the far-left corner (wealth corner) of your workspace."
      };
    } else {
      // Spiritual
      return {
        name: [7, 9, 11, 22].includes(lp) ? "Selenite" : "Lapis Lazuli",
        benefits: isPrimary 
          ? "Directly addresses your spiritual misalignment by cutting through dense ego structures and opening a clear channel to higher guidance." 
          : "Deepens your intuitive capacity, allowing you to access ancestral wisdom and quiet the disruptive chatter of the mind.",
        methodOfUse: "Use to sweep your aura at the end of the day to clear energetic debris, or hold to the third eye during meditation."
      };
    }
  };

  // Add crystal for each sector
  lifePredictions.forEach(sector => {
    crystals.push(getCrystalForSector(sector.category, sector.score));
  });

  // Current Phase Crystal
  const currentAge = new Date().getFullYear() - birthYear;
  const extractAgeEnd = (ageStr: string) => {
    const match = ageStr.match(/Age (\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  };

  let currentChallenge = challenges[3];
  let currentPinnacle = pinnacles[3];
  for (let i = 0; i < 3; i++) {
    const ageEnd = extractAgeEnd(pinnacles[i].ageRange);
    if (currentAge <= ageEnd) {
      currentChallenge = challenges[i];
      currentPinnacle = pinnacles[i];
      break;
    }
  }

  const challengeNum = currentChallenge.number;
  const pinnacleNum = currentPinnacle.number;
  
  let phaseCrystalName = "Clear Quartz";
  let phaseCrystalBenefit = "Amplifies your overall intentions during this transitional phase.";
  if (challengeNum === 1 || pinnacleNum === 1) { phaseCrystalName = "Carnelian"; phaseCrystalBenefit = "Ignites courage, motivation, and leadership needed for your current cycle."; }
  else if (challengeNum === 2 || pinnacleNum === 2) { phaseCrystalName = "Moonstone"; phaseCrystalBenefit = "Balances emotional turbulence and supports the diplomacy required in your current phase."; }
  else if (challengeNum === 3 || pinnacleNum === 3) { phaseCrystalName = "Blue Lace Agate"; phaseCrystalBenefit = "Clears the throat chakra, enabling the creative expression demanded by your current cycle."; }
  else if (challengeNum === 4 || pinnacleNum === 4) { phaseCrystalName = "Hematite"; phaseCrystalBenefit = "Provides heavy grounding to help you establish the discipline and structure needed now."; }
  else if (challengeNum === 5 || pinnacleNum === 5) { phaseCrystalName = "Aquamarine"; phaseCrystalBenefit = "Cools anxiety and brings flow to the rapid, unpredictable changes of your current cycle."; }
  else if (challengeNum === 6 || pinnacleNum === 6) { phaseCrystalName = "Emerald (or Green Jasper)"; phaseCrystalBenefit = "Nurtures the heart and provides patience for the heavy domestic or community responsibilities you face."; }
  else if (challengeNum === 7 || pinnacleNum === 7) { phaseCrystalName = "Labradorite"; phaseCrystalBenefit = "Protects your aura and deepens the spiritual insight required during this introspective phase."; }
  else if (challengeNum === 8 || pinnacleNum === 8) { phaseCrystalName = "Malachite"; phaseCrystalBenefit = "Draws immense material manifestation power while protecting you from unethical business energies."; }
  else if (challengeNum === 9 || pinnacleNum === 9) { phaseCrystalName = "Lepidolite"; phaseCrystalBenefit = "Eases the emotional pain of letting go and helps you surrender to the completions happening in this cycle."; }
  else if (challengeNum === 0) { phaseCrystalName = "Fluorite"; phaseCrystalBenefit = "Maintains mental clarity and protects against the subtle illusion that you have no challenges right now."; }

  crystals.push({
    name: phaseCrystalName,
    benefits: phaseCrystalBenefit,
    methodOfUse: "Keep close to you throughout your day to harmonize with the specific frequencies of your active Pinnacle and Challenge."
  });

  // If there's a strong karmic debt, add a karmic crystal
  const debtNumbers = karmicDebts.map(d => d.debtNumber);
  if (debtNumbers.length > 0) {
    const debt = debtNumbers[0];
    if (debt === 13 || debt === 19) {
      crystals.push({
        name: "Black Tourmaline",
        benefits: `Provides overarching karmic protection, deeply absorbing blockages related to your Karmic Debt ${debt}.`,
        methodOfUse: "Wear continuously as a pendant or bracelet to ground erratic karmic cycles."
      });
    } else if (debt === 14 || debt === 16) {
      crystals.push({
        name: "Smoky Quartz",
        benefits: `Transmutes the chaotic frequency of your Karmic Debt ${debt} into grounded, spiritual wisdom and emotional peace.`,
        methodOfUse: "Hold during moments of acute stress or karmic triggering to rapidly return to center."
      });
    }
  }

  return crystals;
}

function generateLifePredictions(
  metrics: NumerologyMetrics,
  challenges: ChallengeCycle[],
  pinnacles: PinnacleCycle[],
  birthYear: number,
  karmicLessons: KarmicLesson[] = [],
  birthDay: number = 1
): any[] {
  const lp = metrics.lifePath.number;
  const ex = metrics.expression.number;
  const su = metrics.soulUrge.number;

  // 1. Establish Deep, Reliable Numerological Base Potential (Baseline = 75)
  let baseCareer = 75;
  let baseMoney = 75;
  let baseMarriage = 75;
  let baseHealth = 75;
  let baseSpiritual = 75;

  // 2. Core Triads Analysis (Mind: 1,5,7 | Practical: 2,4,8 | Creative: 3,6,9)
  const mindTriad = [1, 5, 7];
  const practicalTriad = [2, 4, 8];
  const creativeTriad = [3, 6, 9];

  const getTriad = (num: number) => {
    if (mindTriad.includes(num)) return 'mind';
    if (practicalTriad.includes(num)) return 'practical';
    if (creativeTriad.includes(num)) return 'creative';
    return 'none';
  };

  const lpTriad = getTriad(lp);
  const exTriad = getTriad(ex);
  const suTriad = getTriad(su);

  // Path & Talent Alignment (LP & Expression)
  if (lpTriad !== 'none' && lpTriad === exTriad) {
    baseCareer += 8; // Deep professional synergy
    baseMoney += 6;  // Talents naturally monetize
  } else if ((lp === 1 && ex === 8) || (lp === 8 && ex === 1) || (lp === 4 && ex === 8) || (lp === 8 && ex === 4)) {
    baseCareer += 10; // Master executives & builders
    baseMoney += 10;
  }

  // Path & Desire Alignment (LP & Soul Urge)
  if (lpTriad !== 'none' && lpTriad === suTriad) {
    baseMarriage += 8;   // High relationship satisfaction
    baseSpiritual += 8;  // Heart and path are unified
  }

  // Talent & Desire Alignment (Expression & Soul Urge)
  if (exTriad !== 'none' && exTriad === suTriad) {
    baseCareer += 5;
    baseMarriage += 5;
  }

  // 3. Core Number Specific Enhancements (Ruling Energies)
  const coreNumbers = [lp, ex, su];
  
  if (coreNumbers.includes(8)) {
    baseMoney += 8;
    baseCareer += 6;
  }
  if (coreNumbers.includes(1)) {
    baseCareer += 6;
    baseMoney += 4;
  }
  if (coreNumbers.includes(4)) {
    baseCareer += 5;
    baseMoney += 6;
  }
  if (coreNumbers.includes(2) || coreNumbers.includes(6)) {
    baseMarriage += 8;
  }
  if (coreNumbers.includes(7) || coreNumbers.includes(9)) {
    baseSpiritual += 10;
  }

  // 4. Master Number Amplifications (High-potential, high-challenge)
  if (coreNumbers.includes(11)) {
    baseSpiritual += 12;
    baseMarriage += 4; // High sensitivity can enrich relationships
  }
  if (coreNumbers.includes(22)) {
    baseCareer += 12;
    baseMoney += 12;
  }
  if (coreNumbers.includes(33)) {
    baseMarriage += 10;
    baseSpiritual += 12;
  }

  // 5. Birthday Number specific alignments
  const bdReduced = reduceNumber(birthDay, true);
  if (bdReduced === 8) {
    baseMoney += 6;
    baseCareer += 5;
  } else if (bdReduced === 2 || bdReduced === 11) {
    baseMarriage += 6;
  } else if (bdReduced === 7) {
    baseSpiritual += 6;
  } else if (bdReduced === 5) {
    baseHealth += 5;
  }

  // 6. Karmic Lessons Penalties (Under-developed vibrations in name)
  const lessonNumbers = karmicLessons.map(l => l.number);
  if (lessonNumbers.includes(8)) baseMoney -= 6; // Lessons in money/power
  if (lessonNumbers.includes(2) || lessonNumbers.includes(6)) baseMarriage -= 6; // Lessons in relationship harmony
  if (lessonNumbers.includes(4)) baseCareer -= 5; // Lessons in structure/discipline
  if (lessonNumbers.includes(5)) baseHealth -= 5; // Lessons in physical adaptability/moderation
  if (lessonNumbers.includes(7)) baseSpiritual -= 5; // Lessons in inner reflection/trust

  // 7. Core Karmic Debts Reductions
  const debts = [];
  if (metrics.lifePath.rawBeforeReduction === 13 || metrics.expression.rawBeforeReduction === 13 || metrics.soulUrge.rawBeforeReduction === 13) debts.push(13);
  if (metrics.lifePath.rawBeforeReduction === 14 || metrics.expression.rawBeforeReduction === 14 || metrics.soulUrge.rawBeforeReduction === 14) debts.push(14);
  if (metrics.lifePath.rawBeforeReduction === 16 || metrics.expression.rawBeforeReduction === 16 || metrics.soulUrge.rawBeforeReduction === 16) debts.push(16);
  if (metrics.lifePath.rawBeforeReduction === 19 || metrics.expression.rawBeforeReduction === 19 || metrics.soulUrge.rawBeforeReduction === 19) debts.push(19);

  if (debts.includes(13)) {
    baseCareer -= 12; // Overcoming shortcuts and lethargy lessons
  }
  if (debts.includes(14)) {
    baseMoney -= 12;  // Physical/financial temptations lessons
    baseHealth -= 10;
  }
  if (debts.includes(16)) {
    baseMarriage -= 15; // Relationships upheaval and ego destruction lessons
    baseSpiritual -= 5;
  }
  if (debts.includes(19)) {
    baseCareer -= 10;  // Leadership humility, learning independence lessons
    baseMarriage -= 8;
  }

  // 8. Clamp overall potentials safely to maintain professional standards (40% - 98%)
  baseCareer = Math.max(40, Math.min(98, baseCareer));
  baseMoney = Math.max(40, Math.min(98, baseMoney));
  baseMarriage = Math.max(40, Math.min(98, baseMarriage));
  baseHealth = Math.max(40, Math.min(98, baseHealth));
  baseSpiritual = Math.max(40, Math.min(98, baseSpiritual));

  const getNumLabel = (num: number, dict: Record<number, string>) => {
    return dict[num] || dict[num % 9 === 0 ? 9 : num % 9];
  };

  const careerPotentials: Record<number, string> = {
    1: "You have immense capacity for leadership and pioneering ventures. Being your own boss or managing teams is your native strength.",
    2: "You excel in diplomacy, counseling, and behind-the-scenes orchestration. Teamwork yields higher returns.",
    3: "Creative expression, media, speaking, and artistic pursuits will bring you natural success and recognition.",
    4: "Architecture, engineering, systems management, and structured corporate climbing are highly favored.",
    5: "Sales, travel, marketing, and dynamic freelance roles suit your need for constant change.",
    6: "Healing arts, teaching, HR, and creative services will place you in high demand.",
    7: "Research, analysis, esoteric studies, and specialized technical fields will unlock your true genius.",
    8: "High finance, real estate, executive leadership, and large-scale entrepreneurship are your destiny.",
    9: "Philanthropy, international relations, arts, and public service will elevate your standing."
  };

  const careerSetbacks: Record<number, string> = {
    1: "You may struggle with authority figures and micromanagement. Being a subordinate will drain your spirit.",
    2: "You often get overlooked for promotions because you avoid claiming credit for your hard work.",
    3: "Lack of focus and scattered energies can lead to incomplete projects and missed major opportunities.",
    4: "You risk burnout from overworking and may get stuck in rigid routines that limit vertical growth.",
    5: "Inconsistency and boredom cause you to abandon lucrative paths right before the breakthrough.",
    6: "Taking on too many responsibilities of others can weigh you down and stifle your personal ambitions.",
    7: "Isolation and an overly critical mind can alienate you from necessary networking and alliances.",
    8: "Power struggles, financial risks, and ethical corners cut for profit can lead to dramatic falls.",
    9: "You may sacrifice personal wealth for ideals, or feel disillusioned if the work lacks deep meaning."
  };

  const careerAvoidance: Record<number, string> = {
    1: "Avoid roles where you have zero autonomy or are heavily micromanaged.",
    2: "Avoid highly aggressive, cutthroat competitive environments.",
    3: "Avoid mundane, repetitive tasks that crush your creative spirit.",
    4: "Avoid chaotic startups with no structure or clear financial backing.",
    5: "Avoid jobs that require sitting at a desk 9-to-5 with no variety.",
    6: "Avoid toxic workplaces where you end up playing therapist to coworkers.",
    7: "Avoid roles that require constant extroverted networking and superficial charm.",
    8: "Avoid working in disorganized companies where your efforts cannot scale.",
    9: "Avoid industries that are ethically compromised or purely profit-driven."
  };

  const moneyPotentials: Record<number, string> = {
    1: "Money comes through aggressive innovation, self-reliance, and first-mover advantage.",
    2: "Wealth accumulates slowly but steadily through partnerships, passive income, and careful saving.",
    3: "Financial gains arrive through networking, charm, and monetizing your creative talents.",
    4: "Real estate, structured investments, and long-term conservative planning build a fortress of wealth.",
    5: "Windfalls, speculative ventures, and multiple streams of income keep your finances dynamic.",
    6: "Money flows when you provide value to the community, family businesses, or aesthetic industries.",
    7: "Intellectual property, specialized patents, or highly niche expertise will be your primary wealth engine.",
    8: "You have the strongest magnetic pull for massive wealth accumulation, corporate scaling, and investments.",
    9: "Wealth comes when you detach from it and focus on global impact or humanitarian services."
  };

  const moneySetbacks: Record<number, string> = {
    1: "Impulsive spending on status symbols or reckless solo ventures can deplete your reserves.",
    2: "Financial timidity and fear of investing may leave you trailing behind inflation.",
    3: "Frivolous spending and living beyond your means for social appearances can create severe debt.",
    4: "Being too frugal or missing out on high-growth opportunities due to extreme risk aversion.",
    5: "Gambling, extreme financial risk-taking, and lack of budgeting can lead to intense boom-and-bust cycles.",
    6: "Overspending on loved ones or carrying the financial burdens of family members will drain you.",
    7: "You may ignore practical financial management, treating money as an illusion or an afterthought.",
    8: "Greed, over-leveraging, or legal battles over assets can wipe out significant portions of your wealth.",
    9: "Giving too much away or being scammed by sob stories can leave you financially vulnerable."
  };

  const moneyAvoidance: Record<number, string> = {
    1: "Avoid going into debt to start a business without a proven model.",
    2: "Avoid letting a partner completely control your finances.",
    3: "Avoid 'get-rich-quick' schemes or lending money you cannot afford to lose.",
    4: "Avoid hoarding cash; make sure your money is actively working for you.",
    5: "Avoid high-risk day trading or gambling with core savings.",
    6: "Avoid co-signing loans for family members who are financially irresponsible.",
    7: "Avoid ignoring your taxes or delegating financial oversight without double-checking.",
    8: "Avoid cutting ethical corners to increase profit margins.",
    9: "Avoid feeling guilty about accumulating wealth; you need it to help others."
  };

  const marriagePotentials: Record<number, string> = {
    1: "You bring passion, protection, and fierce loyalty to relationships, demanding mutual respect.",
    2: "You are the ultimate partner—deeply empathetic, accommodating, and focused on absolute harmony.",
    3: "Romance with you is fun, spontaneous, and filled with deep emotional communication and joy.",
    4: "You offer rock-solid stability, dependability, and a commitment that stands the test of time.",
    5: "You bring excitement, adventure, and a deeply passionate, unconventional energy to partnerships.",
    6: "You are naturally domestic, nurturing, and devoted. You create a beautiful, loving home environment.",
    7: "You seek a deep spiritual and intellectual connection, offering profound loyalty to the right mind.",
    8: "You provide material security, strong provision, and you treat marriage as a powerful alliance.",
    9: "Your love is unconditional, romantic, and deeply compassionate, seeking a soul-level bond."
  };

  const marriageSetbacks: Record<number, string> = {
    1: "Dominating tendencies and a lack of compromise can suffocate your partner and lead to friction.",
    2: "Codependency, extreme sensitivity, and passive-aggressiveness can silently destroy the bond.",
    3: "Flirtatiousness, dramatic emotional highs and lows, and avoiding deep issues can cause instability.",
    4: "Emotional rigidity, stubbornness, and prioritizing work over romance can make relationships feel cold.",
    5: "Restlessness, fear of commitment, and seeking constant novelty can lead to infidelity or sudden exits.",
    6: "Smothering your partner, intense jealousy, or playing the martyr can create toxic family dynamics.",
    7: "Emotional distance, secretiveness, and a need for extreme isolation can make partners feel abandoned.",
    8: "Controlling behavior, prioritizing status over love, and treating the partner like an employee.",
    9: "Unrealistic romantic expectations, clinging to past loves, or trying to 'save' a toxic partner."
  };

  const marriageAvoidance: Record<number, string> = {
    1: "Avoid partners who are overly passive and will resent your leadership.",
    2: "Avoid aggressive, domineering partners who trample your boundaries.",
    3: "Avoid relationships with poor communication or those that stifle your expression.",
    4: "Avoid financially unstable or erratic partners who disrupt your peace.",
    5: "Avoid highly possessive or jealous partners who restrict your freedom.",
    6: "Avoid 'fixer-upper' partners who drain your nurturing energy.",
    7: "Avoid superficial partners who cannot engage in deep, philosophical conversations.",
    8: "Avoid partners who do not share your ambition or respect your drive.",
    9: "Avoid emotionally unavailable people who exploit your compassion."
  };

  const healthPotentials: Record<number, string> = {
    1: "Strong innate vitality, fast recovery, and a naturally athletic constitution.",
    2: "Sensitive nervous system, but responds incredibly well to holistic and gentle healing.",
    3: "Radiant energy that thrives on social interaction, joy, and creative physical expression.",
    4: "Endurance, physical toughness, and the ability to maintain disciplined health routines.",
    5: "High metabolic energy, adaptability, and thriving on physical variety and movement.",
    6: "Strong regenerative powers, especially when emotionally balanced and nurtured.",
    7: "A deep mind-body connection; you can heal through meditation, rest, and energy work.",
    8: "Robust physical strength and the stamina to endure immense stress.",
    9: "A resilient immune system and the ability to bounce back from near-exhaustion."
  };

  const healthSetbacks: Record<number, string> = {
    1: "Prone to stress-induced headaches, eye strain, and cardiovascular issues from high pressure.",
    2: "Digestive issues and lethargy caused directly by absorbing emotional toxicity from others.",
    3: "Throat issues, skin conditions, and nervous exhaustion from over-socializing or suppressed expression.",
    4: "Bone, joint, and dental issues, as well as chronic tension from overworking and inflexibility.",
    5: "Adrenal fatigue, accidents from rushing, and issues related to overindulgence or addiction.",
    6: "Weight fluctuations, breast/chest issues, and illnesses triggered by carrying others' emotional burdens.",
    7: "Insomnia, mysterious ailments, and severe mental fatigue from overthinking and lack of grounding.",
    8: "Stress-related chronic diseases, blood pressure issues, and intestinal blockages from holding onto control.",
    9: "Autoimmune issues or mysterious lingering fatigue from giving away too much of your life force."
  };

  const healthAvoidance: Record<number, string> = {
    1: "Avoid bottling up anger, as it directly impacts your heart and blood pressure.",
    2: "Avoid highly chaotic or toxic environments, as your body absorbs them immediately.",
    3: "Avoid using food or substances to cope with emotional highs and lows.",
    4: "Avoid sitting for long hours without stretching; your joints need mobility.",
    5: "Avoid extreme physical risks and inconsistent sleep schedules.",
    6: "Avoid emotional eating and neglecting your own needs for the sake of family.",
    7: "Avoid isolating yourself too much, leading to depressive or anxious spirals.",
    8: "Avoid overworking to the point of complete adrenal exhaustion.",
    9: "Avoid martyr complexes that cause you to neglect your own physical limits."
  };

  const spiritualPotentials: Record<number, string> = {
    1: "Your spiritual path is forged through pure self-actualization and independent courage.",
    2: "You are a natural conduit for peace, deep empathy, and healing frequencies.",
    3: "Your joy is your highest spiritual vibration; you manifest through optimism and art.",
    4: "Your spiritual strength lies in building lasting systems of care and earthly grounding.",
    5: "Your awakening comes through vast worldly experience, freedom, and sensory exploration.",
    6: "You channel divine energy directly into your home, family, and community service.",
    7: "You possess profound inner wisdom, psychic sensitivity, and a natural seeker's mind.",
    8: "You are meant to balance deep material power with ethical, karmic responsibility.",
    9: "You hold the vibration of universal love, forgiveness, and absolute cosmic surrender."
  };

  const spiritualSetbacks: Record<number, string> = {
    1: "Ego and the illusion of separation can disconnect you from higher guidance.",
    2: "Losing yourself in others' needs can sever your connection to your own soul.",
    3: "Superficial distractions can keep you from accessing deeper universal truths.",
    4: "Over-attachment to logic and the material world can blind you to subtle energies.",
    5: "Restlessness can prevent you from doing the deep, quiet work required for growth.",
    6: "Self-righteousness or martyrdom can corrupt your genuine desire to serve.",
    7: "Over-intellectualizing the divine can block you from actually feeling the connection.",
    8: "Greed and the desire for control can severely misalign your karmic trajectory.",
    9: "Holding onto past wounds and refusing to forgive can trap you in lower vibrations."
  };

  const spiritualAvoidance: Record<number, string> = {
    1: "Avoid believing you are the only one who matters.",
    2: "Avoid seeking external validation for your spiritual worth.",
    3: "Avoid gossiping or using your voice for low-vibration communication.",
    4: "Avoid dismissing the unseen or immeasurable aspects of life.",
    5: "Avoid using spirituality as a way to escape commitment.",
    6: "Avoid forcing your beliefs onto others out of a desire to 'save' them.",
    7: "Avoid isolation that leads to paranoia or superiority complexes.",
    8: "Avoid using spiritual laws merely to manifest money.",
    9: "Avoid carrying the weight of the world at the expense of your joy."
  };
  
  return [
    {
      category: "Career & Ambition",
      score: baseCareer,
      potential: getNumLabel(lp, careerPotentials),
      setbacks: getNumLabel(ex, careerSetbacks),
      avoidance: getNumLabel(lp, careerAvoidance)
    },
    {
      category: "Marriage & Relationships",
      score: baseMarriage,
      potential: getNumLabel(su, marriagePotentials),
      setbacks: getNumLabel(lp, marriageSetbacks),
      avoidance: getNumLabel(lp, marriageAvoidance)
    },
    {
      category: "Health & Vitality",
      score: baseHealth,
      potential: getNumLabel(lp, healthPotentials),
      setbacks: getNumLabel(su, healthSetbacks),
      avoidance: getNumLabel(lp, healthAvoidance)
    },
    {
      category: "Wealth & Finance",
      score: baseMoney,
      potential: getNumLabel(ex, moneyPotentials),
      setbacks: getNumLabel(lp, moneySetbacks),
      avoidance: getNumLabel(lp, moneyAvoidance)
    },
    {
      category: "Spiritual Path",
      score: baseSpiritual,
      potential: getNumLabel(su, spiritualPotentials),
      setbacks: getNumLabel(lp, spiritualSetbacks),
      avoidance: getNumLabel(lp, spiritualAvoidance)
    }
  ];
}

// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR
export function calculatePartnerCompatibility(
  ownerReport: NumerologyReport,
  partnerName: string,
  partnerDob: string,
  relType: 'Spouse' | 'Business' | 'Mentor' | 'Friend' | 'Family' | 'Rival' | 'Dating' = 'Spouse'
): CompatibilityResult {
  const pReport = generateNumerologyReport(partnerName, partnerDob);
  
  // Normalize relationship type
  let normalizedType: 'Spouse' | 'Business' | 'Mentor' | 'Friend' | 'Family' | 'Rival' | 'Dating' = 'Spouse';
  if (relType && typeof relType === 'string') {
    const lower = relType.toLowerCase();
    if (lower.includes('business')) normalizedType = 'Business';
    else if (lower.includes('mentor')) normalizedType = 'Mentor';
    else if (lower.includes('friend')) normalizedType = 'Friend';
    else if (lower.includes('family')) normalizedType = 'Family';
    else if (lower.includes('rival')) normalizedType = 'Rival';
    else if (lower.includes('dating')) normalizedType = 'Dating';
    else normalizedType = 'Spouse';
  }

  const oLp = ownerReport.metrics.lifePath.number;
  const pLp = pReport?.metrics?.lifePath?.number || 0;
  
  const oSu = ownerReport.metrics.soulUrge.number;
  const pSu = pReport?.metrics?.soulUrge?.number || 0;
  
  const oEx = ownerReport.metrics.expression.number;
  const pEx = pReport?.metrics?.expression?.number || 0;
  
  const oDe = ownerReport.metrics.maturity?.number || ownerReport.metrics.lifePath.number;
  const pDe = pReport?.metrics?.maturity?.number || pLp || 0;

  // Let's compare Life Paths (Foundation)
  let lpScore = 50;
  let lpMatchText = "";
  if (oLp === pLp) {
    lpScore = 95;
    lpMatchText = "Identical Paths! You travel the exact same wavelength, understanding each other's core motivations instantly. Highly synergistic but watch for mirroring negative habits.";
  } else {
    const lpTriads = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
    const sameTriad = lpTriads.some(triad => triad.includes(oLp) && triad.includes(pLp));
    if (sameTriad) {
      lpScore = 90;
      lpMatchText = "Triad Harmony! You are in the same element. You express yourselves in compatible, highly supportive ways that form an organic alignment.";
    } else if (Math.abs(oLp - pLp) === 1 || Math.abs(oLp - pLp) === 5) {
      lpScore = 75;
      lpMatchText = "Friendly Vibe. Your Life Paths cooperate easily. One provides structure or fuel, while the other offers perspective. Minimal natural friction.";
    } else {
      lpScore = 40;
      lpMatchText = "Complementary Growth. Your paths are highly diverse, meaning you act as teachers for one another. Mutual adjustments and listening will release major potential, but expect initial friction.";
    }
  }

  // Compare Soul Urges (Heart's Desire - Romance/Intimacy)
  let suScore = 50;
  let suMatchText = "";
  if (oSu === pSu) {
    suScore = 98;
    suMatchText = "Spiritual Soulmates! Your inner longings and emotional hungers are completely identical. You find emotional safety in the exact same environments.";
  } else if ([oSu, pSu].includes(6) || [oSu, pSu].includes(2) || [oSu, pSu].includes(9)) {
    suScore = 85;
    suMatchText = "Warm resonance. At least one partner carries a high nurturing vibration, creating a highly sympathetic and emotionally safe bond.";
  } else if (Math.abs(oSu - pSu) === 3 || Math.abs(oSu - pSu) === 2) {
    suScore = 70;
    suMatchText = "Adaptive Desire. You are motivated by different dreams, but they balance each other beautifully without colliding.";
  } else {
    suScore = 45;
    suMatchText = "Diverse Motivators. Your private drives differ. Speak openly about what truly makes you happy to align your core forces.";
  }

  // Compare Expressions (Working/Talents - Business/Colleagues)
  let exScore = 50;
  let exMatchText = "";
  if (oEx === pEx) {
    exScore = 90;
    exMatchText = "Coordinated Execution! You have identical approaches to solving daily challenges and managing work. You make an incredibly fast-paced, effective business or project team.";
  } else {
    const businessTriad = [2, 4, 8];
    if (businessTriad.includes(oEx) && businessTriad.includes(pEx)) {
      exScore = 95;
      exMatchText = "Master Builders together! Both carry natural practical discipline, organizational strength, or financial leadership. Amazing team dynamics.";
    } else if (Math.abs(oEx - pEx) <= 2) {
      exScore = 75;
      exMatchText = "Easy Collaboration. Your professional styles align easily. You are comfortable sharing tasks and understand each other's communication style.";
    } else {
      exScore = 50;
      exMatchText = "Contrasting Methods. One is highly spontaneous or intellectual, while the other is systematic or emotional. Balance is your power when you divide responsibilities.";
    }
  }
  
  // Compare Destiny (Long term goals)
  let deScore = 50;
  let deMatchText = "";
  if (oDe === pDe) {
     deScore = 95;
     deMatchText = "Parallel Destinies! Your ultimate goals and life purpose point in the exact same direction. A powerful alliance.";
  } else if (Math.abs(oDe - pDe) === 3) {
     deScore = 80;
     deMatchText = "Synergistic Ambitions. Your destinies complement each other nicely, creating a balanced and progressive momentum together.";
  } else {
     deScore = 45;
     deMatchText = "Divergent Horizons. You may find yourselves being pulled in different directions over the long term. Requires conscious compromise.";
  }
  
  // Karmic Friction Check
  let karmicScore = 80;
  let karmicMatchText = "Smooth Karmic Flow. No major overlapping karmic debts detected.";
  const oDebts = ownerReport.karmicDebts.map(d => d.debtNumber);
  const pDebts = pReport.karmicDebts.map(d => d.debtNumber);
  const sharedDebts = oDebts.filter(d => pDebts.includes(d));
  
  let warnings: string[] = [];
  
  if (sharedDebts.length > 0) {
     karmicScore = 30;
     karmicMatchText = "Karmic Mirroring. You both carry the same karmic debts (" + sharedDebts.join(", ") + "), which means you will likely trigger each other's deepest unresolved patterns.";
     warnings.push("Karmic Trigger Warning: You both share the Karmic Debt " + sharedDebts[0] + ". This relationship may feel intensely familiar but can trap you in repetitive negative cycles if you aren't both consciously healing.");
  }
  
  // Toxic combinations logic
  if ((oLp === 1 && pLp === 1)) {
     warnings.push("Clash of Egos: Two 1s can be a highly competitive match. You both want to be in charge. If you don't support each other's independence, this can turn into a battleground.");
     lpScore -= 15;
  }
  if ((oLp === 2 && pLp === 2)) {
     warnings.push("Action Paralysis: Two 2s create a very sensitive and loving bond, but you might both avoid necessary confrontation, letting resentments build up. Make sure someone takes the lead.");
     lpScore -= 10;
  }
  if ((oLp === 3 && pLp === 4) || (oLp === 4 && pLp === 3)) {
     warnings.push("Spontaneity vs. Routine: The 3 wants fun and flexibility; the 4 demands structure and predictability. This can lead to the 3 feeling bored and the 4 feeling anxious. Major compromises required.");
     lpScore -= 20;
  }
  if ((oLp === 5 && pLp === 8) || (oLp === 8 && pLp === 5)) {
     warnings.push("Freedom vs. Control: 5 requires absolute freedom, while 8 naturally seeks to manage and control outcomes. This is a classic recipe for rebellion and power struggles.");
     lpScore -= 25;
  }
  if ((oLp === 6 && pLp === 7) || (oLp === 7 && pLp === 6)) {
     warnings.push("Misaligned Needs: The 6 needs constant emotional connection and reassurance, while the 7 requires deep isolation and intellectual space. This often results in the 6 feeling abandoned and the 7 feeling smothered.");
     lpScore -= 20;
  }
  if ((oLp === 1 && pLp === 8) || (oLp === 8 && pLp === 1)) {
     warnings.push("Power Struggle Warning: 1 and 8 are both strong-willed leaders. Unless you divide domains of authority, extreme power struggles and ego clashes are likely.");
     lpScore -= 20;
  }
  if ((oLp === 4 && pLp === 5) || (oLp === 5 && pLp === 4)) {
     warnings.push("Instability Warning: 4 needs rigid structure, 5 craves absolute freedom. This pairing often leads to the 4 feeling anxious and the 5 feeling suffocated. Stay away unless willing to severely compromise.");
     lpScore -= 25;
  }

  // Karmic Dissonance Calculation
  const cautionaryInsights: string[] = [];
  let karmicDissonanceScore = 0;
  
  if (ownerReport.karmicDebts.map(d => d.debtNumber).length > 0 && pReport.karmicDebts.map(d => d.debtNumber).length > 0) {
      // Cross-referencing dissonance: e.g., one has 13/4 (hard work) and another has 14/5 (freedom/excess)
      if ((ownerReport.karmicDebts.map(d => d.debtNumber).includes(13) && pReport.karmicDebts.map(d => d.debtNumber).includes(14)) || (ownerReport.karmicDebts.map(d => d.debtNumber).includes(14) && pReport.karmicDebts.map(d => d.debtNumber).includes(13))) {
         cautionaryInsights.push("Karmic Dissonance (13 vs 14): Extreme friction between a need for rigid control and a drive for reckless escape. High probability of mutual frustration.");
         karmicDissonanceScore -= 15;
      }
      if ((ownerReport.karmicDebts.map(d => d.debtNumber).includes(16) && pReport.karmicDebts.map(d => d.debtNumber).includes(19)) || (ownerReport.karmicDebts.map(d => d.debtNumber).includes(19) && pReport.karmicDebts.map(d => d.debtNumber).includes(16))) {
         cautionaryInsights.push("Karmic Dissonance (16 vs 19): A clash between the collapse of ego (16) and the assertion of independence (19). Can lead to profound miscommunications and power vacuums.");
         karmicDissonanceScore -= 15;
      }
      if ((ownerReport.karmicDebts.map(d => d.debtNumber).includes(14) && pReport.karmicDebts.map(d => d.debtNumber).includes(16)) || (ownerReport.karmicDebts.map(d => d.debtNumber).includes(16) && pReport.karmicDebts.map(d => d.debtNumber).includes(14))) {
         cautionaryInsights.push("Karmic Dissonance (14 vs 16): Sudden upheavals meeting emotional unavailability. This pairing requires immense spiritual maturity to navigate without trauma.");
         karmicDissonanceScore -= 20;
      }
  }

  // Synergy weights based on selected category (relationship type filter)
  let weights = { lp: 0.25, su: 0.25, ex: 0.2, de: 0.2, karmic: 0.1 };
  if (normalizedType === 'Business') {
    weights = { lp: 0.2, su: 0.1, ex: 0.4, de: 0.2, karmic: 0.1 };
  } else if (normalizedType === 'Mentor') {
    weights = { lp: 0.3, su: 0.15, ex: 0.15, de: 0.3, karmic: 0.1 };
  } else if (normalizedType === 'Friend') {
    weights = { lp: 0.35, su: 0.25, ex: 0.2, de: 0.1, karmic: 0.1 };
  } else if (normalizedType === 'Family') {
    weights = { lp: 0.3, su: 0.3, ex: 0.1, de: 0.1, karmic: 0.2 };
  } else if (normalizedType === 'Rival') {
    weights = { lp: 0.15, su: 0.15, ex: 0.15, de: 0.15, karmic: 0.4 };
  } else if (normalizedType === 'Dating') {
    weights = { lp: 0.15, su: 0.4, ex: 0.25, de: 0.1, karmic: 0.1 };
  } else { // Spouse (Romantic)
    weights = { lp: 0.25, su: 0.35, ex: 0.15, de: 0.15, karmic: 0.1 };
  }

  // Adjusted Synergy Index calculation with relationship weights
  let synergyIndex = Math.max(10, Math.round(
    (lpScore * weights.lp) + 
    (suScore * weights.su) + 
    (exScore * weights.ex) + 
    (deScore * weights.de) + 
    (karmicScore * weights.karmic) + 
    karmicDissonanceScore
  ));

  // Mirror Effect: Shared primary Life Path Challenge (index 2 of challenges cycle)
  let mirrorEffectAlert = null;
  const oPrimaryChallenge = ownerReport.challenges[2]?.number;
  const pPrimaryChallenge = pReport.challenges[2]?.number;
  
  if (oPrimaryChallenge !== undefined && oPrimaryChallenge === pPrimaryChallenge) {
    const challengeThemes: Record<number, string> = {
      0: "Fear of expressing vulnerability, codependency, or major communication blockages.",
      1: "Heavy ego clashing, difficulty sharing authority, or mutual fear of standing alone.",
      2: "hypersensitivity, codependent boundaries, or a fear of rejection that leads to unvoiced resentment.",
      3: "Creative suppression, fear of deep self-expression, or critical/judgmental communication loops.",
      4: "Rigidity, stubborn resistance to routine adjustments, or obsessive micromanagement.",
      5: "Restlessness, fear of true commitment, and a tendency to flee when emotional challenges arise.",
      6: "Unrealistic expectations of perfection in love, martyr complex, or over-controlling family dynamics.",
      7: "Emotional isolation, deep cynicism, lack of trust, or a tendency to completely lock each other out.",
      8: "Power struggles, over-prioritizing wealth/status at the expense of love, or financial control issues."
    };
    
    const themeText = challengeThemes[oPrimaryChallenge] || "deep hidden blockages and emotional friction.";
    
    mirrorEffectAlert = {
      challengeNumber: oPrimaryChallenge,
      title: `Active Mirror Effect: Shared Primary Challenge ${oPrimaryChallenge}`,
      description: `Both you and your partner share the Primary Life Path Challenge of ${oPrimaryChallenge}. In long-term domestic or professional environments, you act as identical mirrors to each other's deepest unresolved patterns. When one partner struggles with ${themeText}, the other's identical anxiety is triggered, creating a compounding feedback loop of friction. To survive this mirror, you must recognize that your partner's most frustrating actions are direct reflections of your own internal shadow work.`
    };
    
    warnings.push(`Primary Mirror Effect Warning: You share Challenge Number ${oPrimaryChallenge}. This acts as an intense friction amplifier in long-term environments.`);
  }

  // Karmic Balance Score calculation
  let karmicBalanceScore = 60; // Base score
  if (oSu === pSu) {
    karmicBalanceScore += 15;
  }
  if (oEx === pEx) {
    karmicBalanceScore += 10;
  }
  
  // Cross Soul Urge - Expression links (Fated Contracts!)
  const hasCrossLink1 = oSu === pEx;
  const hasCrossLink2 = pSu === oEx;
  if (hasCrossLink1 || hasCrossLink2) {
    karmicBalanceScore += 20;
  }
  
  // Triad checks for Soul Urge
  const suTriads = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
  const suSameTriad = suTriads.some(triad => triad.includes(oSu) && triad.includes(pSu));
  if (suSameTriad && oSu !== pSu) {
    karmicBalanceScore += 10;
  }
  
  // Shared Karmic Debts subtraction represents raw soul-level lessons
  if (sharedDebts.length > 0) {
    karmicBalanceScore -= 15;
  }
  karmicBalanceScore = Math.max(10, Math.min(100, karmicBalanceScore));
  
  // Connection type designation
  let connectionType: 'Soulmate' | 'Karmic Teacher' | 'Twin Flame' | 'Catalyst' | 'Neutral' = 'Neutral';
  let connectionDesc = "";
  
  if (karmicBalanceScore >= 90) {
    connectionType = 'Twin Flame';
    connectionDesc = "An incredibly rare, high-vibrational energetic pairing. Your inner longings and outer expressions are locked in a mirrored orbit, accelerating each other's ascension and self-realization.";
  } else if (karmicBalanceScore >= 75) {
    connectionType = 'Soulmate';
    connectionDesc = "A profound fated alliance of absolute emotional safety, shared ideals, and deep structural harmony. Your soul vibrations have contracted to support each other's worldly comfort and quiet growth.";
  } else if (sharedDebts.length > 0 || karmicBalanceScore <= 55) {
    connectionType = 'Karmic Teacher';
    connectionDesc = "This is a profound 'Soul Teacher' relationship. You carry heavy, overlapping vibrational friction. You are brought together not for simple comfort, but to trigger each other's deepest unresolved patterns and master ancient lessons.";
  } else {
    connectionType = 'Catalyst';
    connectionDesc = "An active, highly transformative partnership that constantly pushes both of you to evolve, re-invent yourselves, and avoid complacency.";
  }
  
  // Custom lessons learned from debt numbers
  const karmicBalanceLessons: string[] = [];
  const allDebts = Array.from(new Set([...oDebts, ...pDebts]));
  
  if (allDebts.includes(13)) {
    karmicBalanceLessons.push("Karmic Debt 13 (The Trial of Discipline): Resolving ancient patterns of taking shortcuts. Success requires hard work, structural organization, and relentless focus together.");
  }
  if (allDebts.includes(14)) {
    karmicBalanceLessons.push("Karmic Debt 14 (The Trial of Temperance): Balancing past life excesses. This bond demands moderation in physical desires, committing to long-term plans, and respecting boundaries.");
  }
  if (allDebts.includes(16)) {
    karmicBalanceLessons.push("Karmic Debt 16 (The Trial of Humility): Transcending spiritual pride and ego attachment. Expect sudden, humbling resets that strip away illusions to rebuild on solid spiritual truth.");
  }
  if (allDebts.includes(19)) {
    karmicBalanceLessons.push("Karmic Debt 19 (The Trial of Independence): Overcoming selfishness. Stand strong in your individual power while learning to humbly ask for support and serve the team.");
  }
  if (karmicBalanceLessons.length === 0) {
    karmicBalanceLessons.push("Pure Blueprint: Neither partner carries active Karmic Debts, creating a clean energetic highway for mutual goals without old past-life anchors.");
  }

  // 7-axis Radar Chart calculations with personalized summaries
  const commScore = Math.round(Math.max(20, Math.min(100, exScore + (karmicDissonanceScore/2))));
  const stabScore = Math.round(Math.max(20, Math.min(100, (lpScore + deScore)/2 + karmicDissonanceScore)));
  const creatScore = Math.round(Math.max(20, Math.min(100, suScore * 0.75 + exScore * 0.25)));
  const emoScore = Math.round(Math.max(20, Math.min(100, suScore + (karmicScore > 70 ? 10 : -15))));
  const profScore = Math.round(Math.max(20, Math.min(100, deScore * 0.6 + lpScore * 0.4)));
  const confScore = Math.round(Math.max(10, Math.min(100, (100 - (karmicScore * 0.5 + lpScore * 0.25 + suScore * 0.25)) + (sharedDebts.length > 0 ? 30 : 0) - (karmicDissonanceScore * 0.8))));
  const growthScore = Math.round(Math.max(10, Math.min(100, 50 + (Math.abs(oLp - pLp) * 6) + (sharedDebts.length > 0 ? 25 : 0) + (karmicDissonanceScore < 0 ? 15 : 0))));

  const commExplanation = commScore >= 80 
    ? `Your communication channels are wide open. With Expression numbers of ${oEx} and ${pEx}, ideas and emotions flow organically, forming high-vibrational synergy.`
    : commScore >= 60
      ? `Communication is balanced. You understand each other's styles, though minor effort is required to fully bridge verbal styles.`
      : `High verbal friction. Expressions ${oEx} and ${pEx} create divergent conversation styles, leading to potential misinterpretations.`;

  const stabExplanation = stabScore >= 80
    ? `A rock-solid domestic and financial anchor. Your Life Paths (${oLp} and ${pLp}) ensure that major long-term transitions strengthen rather than crack your bond.`
    : stabScore >= 60
      ? `Good stability, but requires continuous maintenance. Differing lifestyles mean you must consciously establish common routines.`
      : `High vibrational volatility. Opposing lifestyle rhythms (${oLp} vs ${pLp}) indicate that domestic arrangements will require profound compromise.`;

  const creatExplanation = creatScore >= 80
    ? `An excellent creative incubator! Your Soul Urges and Expressions align to co-create beautiful spaces, projects, or artistic endeavors with zero competition.`
    : `You express creativity in divergent ways. One seeks practical order, while the other seeks spontaneous expression. Divide duties to avoid clashing.`;

  const emoExplanation = emoScore >= 80
    ? `Profound emotional safety. You instantly sense each other's vulnerabilities. With highly resonant Soul Urges (${oSu} and ${pSu}), you provide immediate comfort.`
    : `Emotional distance may arise. You hold different emotional desires, meaning one may feel neglected while the other feels smothered. Practice active empathy.`;

  const profExplanation = profScore >= 80
    ? `A formidable professional power couple! Your career numbers and ambitions reinforce one another, allowing you to manifest material abundance effectively.`
    : `Professional friction. Differing attitudes toward risk and financial discipline indicate you should separate your financial accounts.`;

  const confExplanation = confScore >= 70
    ? `High friction warning! Your contrasting blueprints generate immediate spark but also severe ego clashing and unvoiced resentment unless boundaries are strict.`
    : confScore >= 45
      ? `Moderate friction. Disagreements occur over routine habits, but they can be easily resolved through calm, loving communication.`
      : `Minimal friction. Your blueprints slide past each other without colliding, allowing you to coexist in highly peaceful, calm environments.`;

  const growthExplanation = growthScore >= 75
    ? `This relationship is an intense spiritual classroom. You act as powerful catalysts, pushing each other to master maturity and heal karmic debt.`
    : `A gentle, slow-paced growth rate. You offer a highly comfortable comfort zone, prioritizing safety over rapid spiritual transitions.`;

  const radarData = [
    { subject: 'Communication', score: commScore, fullMark: 100, explanation: commExplanation },
    { subject: 'Long-Term Stability', score: stabScore, fullMark: 100, explanation: stabExplanation },
    { subject: 'Creative Alignment', score: creatScore, fullMark: 100, explanation: creatExplanation },
    { subject: 'Emotional Intelligence', score: emoScore, fullMark: 100, explanation: emoExplanation },
    { subject: 'Professional Potential', score: profScore, fullMark: 100, explanation: profExplanation },
    { subject: 'Conflict Potential', score: confScore, fullMark: 100, explanation: confExplanation },
    { subject: 'Personal Growth Acceleration', score: growthScore, fullMark: 100, explanation: growthExplanation }
  ];

  const overallScore = synergyIndex;
  let overallSynergy = "";
  let verdict: 'Excellent' | 'Good' | 'Neutral' | 'Challenging' | 'Warning' = 'Neutral';

  const friendlyLensNames: Record<string, string> = {
    Spouse: "Spouse & Marriage (Romantic)",
    Business: "Business Partner & Executive (Professional)",
    Mentor: "Mentor & Spiritual Guide (Guiding)",
    Friend: "Close Friend & Creative Peer (Platonic)",
    Family: "Family Bond & Kinship (Familial)",
    Rival: "Karmic Catalyst & Rival (Challenging)",
    Dating: "Dating & Early Romance (Passionate Spark)"
  };
  const friendlyName = friendlyLensNames[normalizedType] || "Relationship";

  if (overallScore >= 85) {
    verdict = 'Excellent';
    overallSynergy = `A high-vibrational celestial match for ${friendlyName} alignment. Your core blueprints lock together like ancient gears, sharing compatible spiritual pathways with minimal energetic friction.`;
  } else if (overallScore >= 70) {
    verdict = 'Good';
    overallSynergy = `A highly balanced and cooperative resonance under the ${friendlyName} lens. Your paths offer rich balances where one partner's natural strengths support the other's spiritual growth opportunities.`;
  } else if (overallScore >= 55) {
    verdict = 'Neutral';
    overallSynergy = `A diverse 'Soul Teacher' relationship viewed through the ${friendlyName} lens. Your vibrational patterns are contrasting, serving to trigger each other's hidden spiritual maturity and ancient soul wisdom.`;
  } else if (overallScore >= 40) {
    verdict = 'Challenging';
    overallSynergy = `A highly intense and challenging alignment for ${friendlyName}. Your numerological vibrations are naturally at odds, which means this connection offers monumental growth but requires immense active compromise and self-awareness.`;
  } else {
    verdict = 'Warning';
    overallSynergy = `High Karmic Friction under the ${friendlyName} lens. The energetic signatures here are highly antagonistic. Without extreme self-awareness and conscious boundaries, this connection can feel intensely draining or trigger-heavy.`;
    warnings.push("General Warning: The overall synergy score is exceptionally low. Proceed with caution and maintain strong personal boundaries.");
  }

  // Calculate Romance
  const romanceScore = Math.round((suScore * 0.5) + (lpScore * 0.3) + (karmicScore * 0.2));
  let romanceLabel = romanceScore >= 80 ? "Highly Recommended" : romanceScore >= 60 ? "Favorable" : romanceScore >= 40 ? "Needs Work" : "Not Recommended";
  
  // Calculate Friendship
  const friendshipScore = Math.round((lpScore * 0.4) + (exScore * 0.3) + (deScore * 0.3));
  let friendshipLabel = friendshipScore >= 80 ? "Highly Recommended" : friendshipScore >= 60 ? "Favorable" : friendshipScore >= 40 ? "Needs Work" : "Not Recommended";

  // Calculate Business
  const businessScore = Math.round((exScore * 0.5) + (deScore * 0.3) + (lpScore * 0.2));
  let businessLabel = businessScore >= 80 ? "Highly Recommended" : businessScore >= 60 ? "Favorable" : businessScore >= 40 ? "Needs Work" : "Not Recommended";

  return {
    partnerName,
    partnerDob,
    score: overallScore,
    overallSynergy,
    verdict,
    warnings,
    synergyIndex: overallScore,
    cautionaryInsights,
    radarData,
    recommendations: {
      romance: { score: romanceScore, label: romanceLabel, description: "Evaluates emotional safety, intimate desires, and spiritual alignment (Soul Urge & Life Path heavily weighted)." },
      friendship: { score: friendshipScore, label: friendshipLabel, description: "Evaluates lifestyle rhythm, social expression, and shared long-term directions (Life Path & Expression heavily weighted)." },
      business: { score: businessScore, label: businessLabel, description: "Evaluates practical execution, work ethic, and material goals (Expression & Destiny heavily weighted)." }
    },
    matchDetails: {
      lifePath: lpMatchText,
      soulUrge: suMatchText,
      expression: exMatchText,
      destiny: deMatchText,
      karmic: karmicMatchText
    },
    mirrorEffectAlert,
    karmicBalance: {
      score: karmicBalanceScore,
      connectionType,
      lessons: karmicBalanceLessons,
      description: connectionDesc
    }
  };
}
