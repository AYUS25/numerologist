export interface NumerologyInput {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  phoneNumber?: string;
}

export interface PlaneOfExpression {
  count: number;
  percentage: number;
  intensity: 'Low' | 'Balanced' | 'High';
  letters: string[];
}

export interface KarmicLesson {
  number: number;
  description: string;
}

export interface KarmicStrength {
  number: number;
  count: number;
  description: string;
}

export interface PinnacleCycle {
  stage: number;
  number: number;
  ageRange: string;
  label: string;
  description: string;
}

export interface ChallengeCycle {
  stage: number;
  number: number;
  ageRange: string;
  label: string;
  description: string;
}

export interface KarmicDebt {
  metricName: string; // e.g., "Life Path", "Expression", "Soul Urge", "Personality", "Birthday"
  debtNumber: number; // 13, 14, 16, or 19
  reducedNumber: number; // 4, 5, 7, or 1
  label: string;
  description: string;
}

export interface CompatibilityResult {
  partnerName: string;
  partnerDob: string;
  score: number;
  synergyIndex: number;
  overallSynergy: string;
  verdict: 'Excellent' | 'Good' | 'Neutral' | 'Challenging' | 'Warning';
  recommendations: {
    romance: { score: number; label: string; description: string };
    friendship: { score: number; label: string; description: string };
    business: { score: number; label: string; description: string };
  };
  warnings: string[];
  cautionaryInsights: string[];
  radarData: { subject: string; score: number; fullMark: number; explanation?: string }[];
  matchDetails: {
    lifePath: string;
    soulUrge: string;
    expression: string;
    destiny: string;
    karmic: string;
  };
  mirrorEffectAlert?: {
    challengeNumber: number;
    title: string;
    description: string;
  } | null;
  karmicBalance?: {
    score: number;
    connectionType: 'Soulmate' | 'Karmic Teacher' | 'Twin Flame' | 'Catalyst' | 'Neutral';
    lessons: string[];
    description: string;
  };
}


export interface NumerologyMetrics {
  rootNumber: number;
  lifePath: {
    number: number;
    rawBeforeReduction: number; // Used to detect Karmic Debts
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  expression: {
    number: number;
    rawBeforeReduction: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  soulUrge: {
    number: number;
    rawBeforeReduction: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  personality: {
    number: number;
    rawBeforeReduction: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  birthday: {
    number: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  attitude: {
    number: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  maturity: {
    number: number;
    isMaster: boolean;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  hiddenPassion: {
    number: number | number[]; // Can be multiple if tied
    label: string;
    description: string;
  };
  subconsciousSelf: {
    number: number;
    label: string;
    description: string;
  };
  balance: {
    number: number;
    isMaster: boolean;
    label: string;
    description: string;
  };
  rationalThought: {
    number: number;
    isMaster: boolean;
    label: string;
    description: string;
  };
  personalYear: {
    number: number;
    year: number;
    label: string;
    description: string;
    calculationSteps: string[];
  };
  personalMonth: {
    number: number;
    month: number;
    label: string;
    description: string;
  };
  personalDay: {
    number: number;
    day: number;
    label: string;
    description: string;
  };
}


export interface LifePredictionSector {
  category: string;
  score: number;
  potential: string;
  setbacks: string;
  avoidance: string;
  karmicIntegration?: string;
  luckyPillars?: {
    numbers: number[];
    colors: string[];
    days: string[];
    gemstone: string;
  };
  lifecycleForecast?: {
    phase: string;
    ageRange: string;
    vibe: string;
    rulingNumber: number;
    challengeNumber: number;
    guidance: string;
  }[];
}


export interface LunarPhase {
  phase: string;
  illumination: number;
  insight: string;
}

export interface PlanetaryHour {
  planet: string;
  energy: string;
}

export interface PhoneAnalysis {
  number: string;
  vibration: number;
  insight: string;
  suggestion: string;
}

export interface NameAnalysis {
  currentExpression: number;
  insight: string;
  suggestion: string;
  chaldeanSum?: number;
  chaldeanMeaning?: string;
  cornerstone?: string;
  cornerstoneMeaning?: string;
  capstone?: string;
  capstoneMeaning?: string;
  firstVowel?: string;
  firstVowelMeaning?: string;
  vowelSum?: number;
  consonantSum?: number;
}

export interface LifecyclePhase {
  stage: string;
  ageRange: string;
  theme: string;
  pinnacle: number;
  challenge: number;
}

export interface MasterCrystal {
  name: string;
  benefits: string;
  methodOfUse: string;
}

export interface NumerologyReport {
  peaceIndex?: number;
  prosperityPotential?: number;
  phoneAnalysis?: PhoneAnalysis;
  nameAnalysis?: NameAnalysis;
  lifecyclePhases?: LifecyclePhase[];
  input: NumerologyInput;
  metrics: NumerologyMetrics;
  planesOfExpression: {
    physical: PlaneOfExpression;
    mental: PlaneOfExpression;
    emotional: PlaneOfExpression;
    intuitive: PlaneOfExpression;
  };
  karmicLessons: KarmicLesson[];
  karmicStrengths: KarmicStrength[];
  pinnacles: PinnacleCycle[];
  challenges: ChallengeCycle[];
  karmicDebts: KarmicDebt[];
  remedies: { category: string; advice: string }[];
  inclusionTable: Record<number, number>; // Maps 1-9 to count of letters
  astrology: {
    sign: string;
    rulingPlanet: string;
    element: string;
    quality: string;
    compatibility: string[];
  };
  analysisSummary: string;
  lunarPhase?: LunarPhase;
  planetaryHour?: PlanetaryHour; // High-level overall profile synthesis
  lifePredictions?: LifePredictionSector[];
  spiritualRemedies?: SpiritualRemedySection[];
  masterCrystals?: MasterCrystal[];
}

export interface SpiritualRemedySection {
  sector: string;
  alignmentScore: number;
  challengeText: string;
  colorRemedy: {
    color: string;
    vibration: string;
    practice: string;
  };
  sacredPractice: {
    title: string;
    frequency: string;
    instructions: string;
  };
  mantra: {
    sanskrit: string;
    englishTranslation: string;
    benefits: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
