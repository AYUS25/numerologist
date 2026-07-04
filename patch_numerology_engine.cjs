const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const lifePredictionsLogic = `
function generateLifePredictions(metrics: NumerologyMetrics): any[] {
  const lp = metrics.lifePath.number;
  const ex = metrics.expression.number;
  const su = metrics.soulUrge.number;
  
  // Calculate deterministic but seemingly deep scores based on numerology rules
  const baseCareer = (lp * 7 + ex * 3) % 40 + 60;
  const baseMoney = (lp * 4 + ex * 5) % 40 + 55;
  const baseMarriage = (su * 8 + lp * 2) % 40 + 50;
  const baseHealth = (lp * 5 + su * 3) % 40 + 55;
  const baseProperty = (ex * 6 + lp * 4) % 40 + 50;
  
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
      setbacks: getNumLabel(ex, careerSetbacks)
    },
    {
      category: "Wealth & Money",
      score: baseMoney,
      potential: getNumLabel(ex, moneyPotentials),
      setbacks: getNumLabel(lp, moneySetbacks)
    },
    {
      category: "Marriage & Relationships",
      score: baseMarriage,
      potential: getNumLabel(su, marriagePotentials),
      setbacks: getNumLabel(lp, marriageSetbacks)
    },
    {
      category: "Health & Vitality",
      score: baseHealth,
      potential: getNumLabel(lp, healthPotentials),
      setbacks: getNumLabel(su, healthSetbacks)
    },
    {
      category: "Property & Assets",
      score: baseProperty,
      potential: getNumLabel(ex, propertyPotentials),
      setbacks: getNumLabel(lp, propertySetbacks)
    }
  ];
}
`;

code = code.replace(
  '// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR',
  lifePredictionsLogic + '\n// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR'
);

code = code.replace(
  '    astrology,\n    analysisSummary\n  };\n}',
  '    astrology,\n    analysisSummary,\n    lifePredictions: generateLifePredictions(metrics)\n  };\n}'
);

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log("Patched numerology engine with life predictions");
