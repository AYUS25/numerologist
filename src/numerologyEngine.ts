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
  CompatibilityResult
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
    lifePredictions: generateLifePredictions(metrics, challenges),
    remedies: generateRemedies(metrics),
    lunarPhase: calculateLunarPhase(new Date()),
    planetaryHour: calculatePlanetaryHour(new Date())
  };
}



function generateRemedies(metrics: NumerologyMetrics): { category: string, advice: string }[] {
  const lp = metrics.lifePath.number;
  const remedies = [];
  
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

function generateLifePredictions(metrics: NumerologyMetrics, challenges: ChallengeCycle[]): any[] {
  const lp = metrics.lifePath.number;
  const ex = metrics.expression.number;
  const su = metrics.soulUrge.number;
  

  // Calculate deterministic but seemingly deep scores based on numerology rules
  let baseCareer = (lp * 7 + ex * 3) % 40 + 60;
  let baseMoney = (lp * 4 + ex * 5) % 40 + 55;
  let baseMarriage = (su * 8 + lp * 2) % 40 + 50;
  let baseHealth = (lp * 5 + su * 3) % 40 + 55;
  let baseProperty = (ex * 6 + lp * 4) % 40 + 50;

  // Apply Karmic Debt Weightings
  const debts = [];
  if (metrics.lifePath.rawBeforeReduction === 13 || metrics.expression.rawBeforeReduction === 13 || metrics.soulUrge.rawBeforeReduction === 13) debts.push(13);
  if (metrics.lifePath.rawBeforeReduction === 14 || metrics.expression.rawBeforeReduction === 14 || metrics.soulUrge.rawBeforeReduction === 14) debts.push(14);
  if (metrics.lifePath.rawBeforeReduction === 16 || metrics.expression.rawBeforeReduction === 16 || metrics.soulUrge.rawBeforeReduction === 16) debts.push(16);
  if (metrics.lifePath.rawBeforeReduction === 19 || metrics.expression.rawBeforeReduction === 19 || metrics.soulUrge.rawBeforeReduction === 19) debts.push(19);

  if (debts.includes(13)) {
    baseCareer = Math.max(10, baseCareer - 15); // Laziness penalty
    baseProperty = Math.max(10, baseProperty - 10);
  }
  if (debts.includes(14)) {
    baseMoney = Math.max(10, baseMoney - 18); // Indulgence/risk penalty
    baseHealth = Math.max(10, baseHealth - 15);
  }
  if (debts.includes(16)) {
    baseMarriage = Math.max(10, baseMarriage - 20); // Ego/isolation penalty
  }
  if (debts.includes(19)) {
    baseCareer = Math.max(10, baseCareer - 12); // Abuse of power / stubbornness
    baseMarriage = Math.max(10, baseMarriage - 10);
  }

  // Cross-reference with Challenge Numbers
  if (challenges && challenges.length > 0) {
    const mainChallenge = challenges[challenges.length - 1].number; // The Main Challenge (4th) is lifelong
    if (mainChallenge === 4 || mainChallenge === 8) {
      baseMoney = Math.max(10, baseMoney - 10); // Constant financial friction
      baseCareer = Math.max(10, baseCareer - 5);
    }
    if (mainChallenge === 2 || mainChallenge === 6) {
      baseMarriage = Math.max(10, baseMarriage - 15); // Constant relationship friction
    }
    if (mainChallenge === 5) {
      baseHealth = Math.max(10, baseHealth - 10); // Nervous system burnout
    }
  }

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

  const propertyPotentials: Record<number, string> = {
    1: "Favorable for acquiring modern, innovative properties or building custom homes from scratch.",
    2: "Excellent intuition for finding harmonious, peaceful homes near water or nature.",
    3: "Drawn to aesthetically beautiful, lively neighborhoods. Great at flipping or decorating for profit.",
    4: "The ultimate builder. Natural talent for acquiring solid land, commercial real estate, and legacy estates.",
    5: "Favorable for owning multiple properties, vacation homes, or highly liquid real estate assets.",
    6: "A magnet for beautiful family homes. You easily turn any house into a highly valued sanctuary.",
    7: "Drawn to secluded retreats, historic homes, or properties with unique architectural mysteries.",
    8: "Massive potential for commercial real estate empires, luxury properties, and high-yield investments.",
    9: "Favorable for acquiring properties abroad, historical estates, or land for community/spiritual use."
  };


  const careerAvoidance: Record<number, string> = {
    1: "Avoid highly bureaucratic environments where seniority outranks innovation, and micromanaging bosses.",
    2: "Avoid ruthlessly competitive sales floors or environments that require stepping on others.",
    3: "Avoid monotonous, highly repetitive data-entry roles that stifle creative input.",
    4: "Avoid fly-by-night startups or chaotic work environments with zero standard operating procedures.",
    5: "Avoid desk jobs with strict 9-to-5 desk-tethering and no travel or social variety.",
    6: "Avoid industries with harsh, cutthroat ethics or environments that conflict with your morals.",
    7: "Avoid roles that require constant small talk, intense networking, or shallow socializing.",
    8: "Avoid dead-end roles with glass ceilings and environments that do not reward heavy output.",
    9: "Avoid corporations solely focused on predatory profit without any philanthropic mission."
  };

  const moneyAvoidance: Record<number, string> = {
    1: "Avoid entering joint ventures where you do not have the majority say or final veto.",
    2: "Avoid aggressive stock day-trading or high-risk speculative crypto investments.",
    3: "Avoid taking on debt for depreciating aesthetic assets or 'keeping up with the Joneses'.",
    4: "Avoid completely locking up all your capital in illiquid assets; keep emergency cash reserves.",
    5: "Avoid gambling, get-rich-quick schemes, or throwing money at every new shiny trend.",
    6: "Avoid co-signing loans for unreliable friends or family members.",
    7: "Avoid ignoring your taxes, bookkeeping, or handing over blind control of your assets to 'experts'.",
    8: "Avoid cutting ethical corners or engaging in aggressive tax loopholes that invite heavy auditing.",
    9: "Avoid giving your wealth away to untvetted charities or people claiming to be 'gurus'."
  };

  const marriageAvoidance: Record<number, string> = {
    1: "Avoid partners who are overly dependent or those who try to dominate and control your schedule.",
    2: "Avoid aggressive, emotionally unavailable partners who dismiss your deep sensitivities.",
    3: "Avoid partners who belittle your dreams or who bring chronic pessimism into your joy.",
    4: "Avoid flaky, financially irresponsible partners who disrupt your carefully built stability.",
    5: "Avoid highly possessive, jealous partners who demand all your free time and restrict your social life.",
    6: "Avoid 'fixer-upper' partners who drain your nurturing energy without giving anything back.",
    7: "Avoid superficial partners who cannot engage in deep, intellectual, or spiritual conversations.",
    8: "Avoid partners who are financially draining or who resent your ambition and work ethic.",
    9: "Avoid emotionally manipulative partners who play the victim to keep you trapped in a 'savior' role."
  };

  const healthAvoidance: Record<number, string> = {
    1: "Avoid bottling up anger and pushing through extreme fatigue without recovery days.",
    2: "Avoid toxic, chaotic environments; your nervous system absorbs the surrounding stress.",
    3: "Avoid suppressing your emotions, as this often manifests quickly as throat or lung issues for you.",
    4: "Avoid extreme dietary rigidity or over-training without stretching (bone and joint issues).",
    5: "Avoid relying on stimulants, excessive caffeine, or thrill-seeking behaviors to mask exhaustion.",
    6: "Avoid emotional overeating or neglecting your own health while caring for sick family members.",
    7: "Avoid isolating yourself completely, which can lead to severe mental health spirals or depression.",
    8: "Avoid prioritizing money over health; missing doctor appointments will backfire on your vitality.",
    9: "Avoid taking on the world's pain; watching the news 24/7 will destroy your immune system."
  };

  const propertyAvoidance: Record<number, string> = {
    1: "Avoid compromising on your vision just to get a deal done quickly; don't settle.",
    2: "Avoid buying property near loud highways, airports, or chaotic industrial zones.",
    3: "Avoid buying properties that look beautiful but have terrible structural inspection reports.",
    4: "Avoid overly risky flips in unproven neighborhoods; stick to solid, appreciating assets.",
    5: "Avoid locking yourself into 30-year mortgages in places you aren't sure you want to stay.",
    6: "Avoid buying homes that require endless, draining renovations that stress the family.",
    7: "Avoid densely packed apartment complexes with thin walls and no privacy.",
    8: "Avoid over-leveraging yourself to buy a 'status' home that strains your cash flow.",
    9: "Avoid purchasing property with ambiguous borders, legal disputes, or negative historical energy."
  };

  const propertySetbacks: Record<number, string> = {
    1: "May rush into buying properties without doing due diligence, leading to structural regrets.",
    2: "Hesitation in negotiations can cause you to miss out on prime real estate opportunities.",
    3: "Overspending on aesthetics and ignoring foundational issues (plumbing, roofing) during purchase.",
    4: "Can get stuck with hard-to-sell assets or face heavy, prolonged renovation burdens.",
    5: "Restlessness may cause you to sell prematurely, missing out on long-term appreciation.",
    6: "Taking on mortgages that are too heavy in order to provide the 'perfect' home for the family.",
    7: "Hidden legal issues or purchasing in overly isolated areas that are difficult to resell.",
    8: "Over-leveraging assets or facing fierce legal/zoning disputes over large commercial acquisitions.",
    9: "Being too trusting in real estate deals, leading to potential fraud or boundary disputes with neighbors."
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
      category: "Wealth & Money",
      score: baseMoney,
      potential: getNumLabel(ex, moneyPotentials),
      setbacks: getNumLabel(lp, moneySetbacks),
      avoidance: getNumLabel(lp, moneyAvoidance)
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
      category: "Property & Assets",
      score: baseProperty,
      potential: getNumLabel(ex, propertyPotentials),
      setbacks: getNumLabel(lp, propertySetbacks),
      avoidance: getNumLabel(lp, propertyAvoidance)
    }
  , 
    {
      category: "Prosperity & Abundance",
      score: Math.min(100, Math.max(10, baseMoney + Math.floor(Math.random()*20 - 10))),
      potential: "Capability to attract resources by aligning personal skills with cosmic timing and karmic flow.",
      setbacks: "Subconscious blockages around receiving wealth or sudden disruptions in accumulation.",
      avoidance: "Hoarding mentality or equating self-worth entirely with material accumulation."
    },
    {
      category: "Emotional Peace",
      score: Math.min(100, Math.max(10, baseHealth + Math.floor(Math.random()*15))),
      potential: "Deep resonance with the spiritual self, bringing mental clarity and emotional equilibrium.",
      setbacks: "Tendency to absorb chaotic frequencies from the environment, leading to existential anxiety.",
      avoidance: "Escapism and spiritual bypassing to avoid dealing with practical earthly matters."
    },
    {
      category: "Spiritual Fulfillment",
      score: Math.min(100, Math.max(10, baseMarriage + 10)),
      potential: "Awakening to higher dimensional truths and dissolving the ego's rigid structures.",
      setbacks: "Getting lost in dogmatic systems or experiencing 'dark night of the soul' periods.",
      avoidance: "Dismissing intuition in favor of pure, rigid materialism."
    }
   ];

}

// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR
export function calculatePartnerCompatibility(
  ownerReport: NumerologyReport,
  partnerName: string,
  partnerDob: string
): CompatibilityResult {
  const pReport = generateNumerologyReport(partnerName, partnerDob);
  
  const oLp = ownerReport.metrics.lifePath.number;
  const pLp = pReport.metrics.lifePath.number;
  
  const oSu = ownerReport.metrics.soulUrge.number;
  const pSu = pReport.metrics.soulUrge.number;
  
  const oEx = ownerReport.metrics.expression.number;
  const pEx = pReport.metrics.expression.number;

  // Let's compare Life Paths
  let lpScore = 50;
  let lpMatchText = "";
  if (oLp === pLp) {
    lpScore = 95;
    lpMatchText = "Identical Paths! You travel the exact same wavelength, understanding each other's core motivations instantly. Highly synergistic but watch for mirroring negative habits.";
  } else {
    // Friendly Triads
    const lpTriads = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
    const sameTriad = lpTriads.some(triad => triad.includes(oLp) && triad.includes(pLp));
    
    if (sameTriad) {
      lpScore = 90;
      lpMatchText = "Triad Harmony! You are in the same element. You express yourselves in compatible, highly supportive ways that form an organic alignment.";
    } else if (Math.abs(oLp - pLp) === 1 || Math.abs(oLp - pLp) === 5) {
      lpScore = 75;
      lpMatchText = "Friendly Vibe. Your Life Paths cooperate easily. One provides structure or fuel, while the other offers perspective. Minimal natural friction.";
    } else {
      lpScore = 60;
      lpMatchText = "Complementary Growth. Your paths are highly diverse, meaning you act as teachers for one another. Mutual adjustments and listening will release major potential.";
    }
  }

  // Compare Soul Urges (Heart's Desire)
  let suScore = 50;
  let suMatchText = "";
  if (oSu === pSu) {
    suScore = 98;
    suMatchText = "Spiritual Soulmates! Your inner longings and emotional hungers are completely identical. You find emotional safety in the exact same environments.";
  } else if ([oSu, pSu].includes(6) || [oSu, pSu].includes(2) || [oSu, pSu].includes(9)) {
    // High empathy numbers
    suScore = 80;
    suMatchText = "Warm resonance. At least one partner carries a high nurturing vibration (2, 6, or 9), creating a highly sympathetic and emotionally safe bond.";
  } else if (Math.abs(oSu - pSu) === 3 || Math.abs(oSu - pSu) === 2) {
    suScore = 70;
    suMatchText = "Adaptive Desire. You are motivated by different dreams, but they balance each other beautifully without colliding.";
  } else {
    suScore = 55;
    suMatchText = "Diverse Motivators. Your private drives and spiritual desires differ. Speak openly about what truly makes you happy to align your core forces.";
  }

  // Compare Expressions (Working/Talents)
  let exScore = 50;
  let exMatchText = "";
  if (oEx === pEx) {
    exScore = 90;
    exMatchText = "Coordinated Execution! You have identical approaches to solving daily challenges and managing work. You make an incredibly fast-paced, effective business or project team.";
  } else {
    const businessTriad = [2, 4, 8];
    if (businessTriad.includes(oEx) && businessTriad.includes(pEx)) {
      exScore = 85;
      exMatchText = "Master Builders together! Both carry natural practical discipline, organizational strength, or financial leadership. Amazing team dynamics.";
    } else if (Math.abs(oEx - pEx) <= 2) {
      exScore = 75;
      exMatchText = "Easy Collaboration. Your professional styles align easily. You are comfortable sharing tasks and understand each other's communication style.";
    } else {
      exScore = 60;
      exMatchText = "Contrasting Methods. One is highly spontaneous or intellectual, while the other is systematic or emotional. Balance is your power when you divide responsibilities.";
    }
  }

  const overallScore = Math.round((lpScore * 0.5) + (suScore * 0.3) + (exScore * 0.2));

  let overallSynergy = "";
  if (overallScore >= 85) {
    overallSynergy = `A high-vibrational celestial match (${overallScore}% Synergy). Your core blueprints lock together like ancient gears. You share deeply compatible spiritual pathways and emotional blueprints, making this connection exceptionally supportive for both romantic companionship and massive business partnerships.`;
  } else if (overallScore >= 70) {
    overallSynergy = `A highly balanced and cooperative resonance (${overallScore}% Synergy). Your paths are supportive, offering rich balances where one partner's strengths support the other's karmic opportunities. You work excellently together with open and active listening.`;
  } else {
    overallSynergy = `A diverse 'Soul Teacher' relationship (${overallScore}% Synergy). Your vibrational patterns are contrasting. Rather than reflecting each other, you serve to trigger each other's hidden spiritual maturity and force personal growth. With patient, gentle compromise, this forms an incredibly durable, grounded alliance.`;
  }

  return {
    partnerName,
    partnerDob,
    score: overallScore,
    overallSynergy,
    matchDetails: {
      lifePath: lpMatchText,
      soulUrge: suMatchText,
      expression: exMatchText
    }
  };
}
