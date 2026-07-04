import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateNumerologyReport } from "./src/numerologyEngine";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini SDK with telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. API: Calculate Numerology report
app.post("/api/numerology/calculate", (req, res) => {
  try {
    const { fullName, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    if (!fullName || !dateOfBirth) {
      return res.status(400).json({ error: "Full Name and Date of Birth are required." });
    }
    const report = generateNumerologyReport(fullName, dateOfBirth, timeOfBirth, placeOfBirth);
    return res.json(report);
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429')) {
       return res.status(429).setHeader('Retry-After', '5').json({ error: 'Rate limited' });
    }
    console.error("Calculation error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate numerology analysis." });
  }
});

// 2. API: Chat with Numerologist AI
app.post("/api/numerology/chat", async (req, res) => {
  const { report, messages, userMessage, language } = req.body;
  if (!report || !userMessage) {
    return res.status(400).json({ error: "Blueprint report and user message are required." });
  }

  try {

    const m = report.metrics;
    const lessons = report.karmicLessons.map((l: any) => `- Number ${l.number}: ${l.description}`).join("\n") || "None (Fully balanced vibration spectrum)";
    const strengths = report.karmicStrengths.map((s: any) => `- Number ${s.number} (Count: ${s.count}x): ${s.description}`).join("\n") || "No hyper-dominant vibrations (Evenly distributed)";
    const debtsText = report.karmicDebts.map((d: any) => `- Found in ${d.metricName}: ${d.label} - ${d.description}`).join("\n") || "No Karmic Debts detected in core numbers (Free of karmic weights)";
    
    const pinnaclesText = report.pinnacles.map((p: any) => `- Phase ${p.stage} (${p.ageRange}): Vibe ${p.number} (${p.label}) - ${p.description}`).join("\n");
    const challengesText = report.challenges.map((c: any) => `- Phase ${c.stage} (${c.ageRange}): Vibe ${c.number} (${c.label}) - ${c.description}`).join("\n");

    // Construct a rich, spiritual system instruction based on the user's specific numerology blueprint
    const systemInstruction = `You are a sophisticated Numerology Master Oracle conducting a conversational "Life Audit". Your goal is to provide a welcoming, consultative, and highly personalized experience. Synthesize specific technical rule-sets from authentic Numerology methodologies (including Cheiro, Pythagorean, and Vedic numerology) when responding to users. Blend these systems to offer profound, technically accurate insights while maintaining a warm, empathetic tone. Ground your oracle wisdom in the client's specific Numerology Blueprint provided below.

You are currently consulting with a client whose calculated professional Numerology Blueprint is provided below:
--- CLIENT BLUEPRINT ---
• Client's Full Birth Name: ${report.input.fullName}
• Date of Birth: ${report.input.dateOfBirth}
${report.input.timeOfBirth ? `• Time of Birth: ${report.input.timeOfBirth}` : ''}
${report.input.placeOfBirth ? `• Place of Birth: ${report.input.placeOfBirth}` : ''}

THE CORE NUMBERS:
• Life Path Number: ${m.lifePath.number} (${m.lifePath.label}) - Represents their ultimate destiny, path of development, and core identity.
  - Meaning: ${m.lifePath.description}

• Expression / Destiny Number: ${m.expression.number} (${m.expression.label}) - Represents their natural talents, capabilities, and how they execute their path.
  - Meaning: ${m.expression.description}

• Soul Urge / Heart's Desire Number: ${m.soulUrge.number} (${m.soulUrge.label}) - Represents their innermost longings, subconscious motivators, and spiritual hunger.
  - Meaning: ${m.soulUrge.description}

• Personality Number: ${m.personality.number} (${m.personality.label}) - Represents the outer self, their first-impression aura, and how the world perceives them.
  - Meaning: ${m.personality.description}

• Birthday Number: ${m.birthday.number} (${m.birthday.label}) - Represents specific sub-talents gifted on their birth date.
  - Meaning: ${m.birthday.description}

ADDITIONAL BLUEPRINT DETAILS:
• Hidden Passion Number: ${m.hiddenPassion?.number} (${m.hiddenPassion?.label}) - ${m.hiddenPassion?.description}
• Subconscious Self Number: ${m.subconsciousSelf?.number} (${m.subconsciousSelf?.label}) - ${m.subconsciousSelf?.description}
• Balance Number: ${m.balance?.number} (${m.balance?.label}) - ${m.balance?.description}
• Rational Thought Number: ${m.rationalThought?.number} (${m.rationalThought?.label}) - ${m.rationalThought?.description}
• Attitude Number: ${m.attitude.number} (${m.attitude.label}) - How they initially react to external events and situations.
  - Meaning: ${m.attitude.description}

• Maturity Number: ${m.maturity.number} (${m.maturity.label}) - What awaits them and what they consolidate in the second half of life.
  - Meaning: ${m.maturity.description}

• Personal Year Number for ${m.personalYear.year}: ${m.personalYear.number} (${m.personalYear.label}) - Their active spiritual theme for the current year.
  - Meaning: ${m.personalYear.description}
• Personal Month Number for month ${m.personalMonth.month}: ${m.personalMonth.number} (${m.personalMonth.label}) - Current monthly trend: ${m.personalMonth.description}
• Personal Day Number for day ${m.personalDay.day}: ${m.personalDay.number} (${m.personalDay.label}) - Today's direct vibe: ${m.personalDay.description}

PLANES OF EXPRESSION:
- Physical Plane: ${report.planesOfExpression.physical.percentage}% (Intensity: ${report.planesOfExpression.physical.intensity})
- Mental Plane: ${report.planesOfExpression.mental.percentage}% (Intensity: ${report.planesOfExpression.mental.intensity})
- Emotional Plane: ${report.planesOfExpression.emotional.percentage}% (Intensity: ${report.planesOfExpression.emotional.intensity})
- Intuitive Plane: ${report.planesOfExpression.intuitive.percentage}% (Intensity: ${report.planesOfExpression.intuitive.intensity})

KARMIC LESSONS (Missing vibrations they need to consciously develop):
${lessons}

KARMIC STRENGTHS (Highly abundant, dominant vibrations that act as native superpowers):
${strengths}

KARMIC DEBTS (Heavy vibrational weights they are carrying to resolve past-life lessons):
${debtsText}

FOUR PINNACLES OF TIMELINE:
${pinnaclesText}

FOUR CHALLENGES OF TIMELINE:
${challengesText}

--- CONSULTATION GUIDELINES ---
1. Speak with absolute authority, professional psychological depth, and mystical wisdom. IMPORTANT: Provide blunt, highly realistic, non-sugar-coated analysis. Do not use overly flattering or buttery language. Point out flaws, setbacks, and real-world challenges directly.
2. ALWAYS integrate their numbers, pinnacles, karmic debts, and daily vibes dynamically into your answers. 
3. ASTROLOGICAL CORRESPONDENCES: Whenever appropriate, seamlessly blend in astrological associations (e.g., Number 1 is ruled by the Sun/Leo; 2 by Moon/Cancer; 3 by Jupiter/Sagittarius; 4 by Uranus or Rahu; 5 by Mercury/Gemini/Virgo; 6 by Venus/Taurus/Libra; 7 by Neptune or Ketu/Pisces; 8 by Saturn/Capricorn; 9 by Mars/Aries/Scorpio). Explain how these planetary energies influence their numerological vibrations.
4. REMEDIES & MITIGATION: Proactively offer concrete, practical remedies for their challenges, karmic debts, or just to boost their energy. Include specific recommendations for:
   - Lucky Gemstones or crystals.
   - Auspicious colors to wear.
   - Specific mantras, affirmations, or chanting.
   - Favorable days of the week for important actions.
5. Connect the dots for them. Explain how their Pinnacles support their Life Path, and how they can remediate any Karmic Lessons or Karmic Debts using the aforementioned remedies.
6. Keep answers deeply therapeutic, encouraging, and clear. Avoid listing raw JSON or formulas; instead, use elegant prose, beautiful layout headings, and clean bullet points.
7. Address the client by name or warmly and provide personalized advice for their current cycles.
8. LANGUAGE DIRECTIVE: The user's interface language is set to '${language === 'hi-IN' ? 'Hindi' : 'English'}'. You MUST reply entirely in ${language === 'hi-IN' ? 'Hindi (Devanagari script)' : 'English'} unless quoting specific terminology.`;

    // Map history to Gemini message contents
    const contents = [];
    
    // Add history
    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // Generate content using gemini-3.5-flash as it's the requested model for advanced reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    const botReply = response.text || "The cosmos are whispering in silences right now. Please repeat your query, my dear seeker.";
    return res.json({ reply: botReply });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429')) {
       return res.status(429).setHeader('Retry-After', '5').json({ error: 'Rate limited' });
    }
    // Silent fallback when Gemini API fails due to quotas
    
    const m = report.metrics;
    const userMessageLower = userMessage.toLowerCase();
    
    const planetaryRulers: Record<number, { planet: string; crystal: string; color: string; mantra: string }> = {
      1: { planet: "the Sun", crystal: "Carnelian", color: "Ruby Red", mantra: "I am sovereign, aligned, and starting anew." },
      2: { planet: "the Moon", crystal: "Moonstone", color: "Silver-White", mantra: "I trust my intuition and flow with grace." },
      3: { planet: "Jupiter", crystal: "Lapis Lazuli", color: "Royal Blue", mantra: "I express my joy and manifest creativity." },
      4: { planet: "Rahu", crystal: "Tiger's Eye", color: "Forest Green", mantra: "I am grounded, structured, and focused." },
      5: { planet: "Mercury", crystal: "Citrine", color: "Amber Yellow", mantra: "I embrace change and welcome new adventures." },
      6: { planet: "Venus", crystal: "Rose Quartz", color: "Soft Pink", mantra: "I radiate love and nurture my sacred boundaries." },
      7: { planet: "Ketu / Neptune", crystal: "Amethyst", color: "Deep Purple", mantra: "I seek truth and trust the wisdom of silence." },
      8: { planet: "Saturn", crystal: "Black Obsidian", color: "Charcoal Black", mantra: "I stand in my authority with absolute integrity." },
      9: { planet: "Mars", crystal: "Clear Quartz", color: "Pure Gold", mantra: "I complete my cycles with grace and release the past." },
      11: { planet: "Uranus", crystal: "Moldavite", color: "Electric Violet", mantra: "I am a pure channel of cosmic inspiration." },
      22: { planet: "Pluto", crystal: "Selenite", color: "Pearl white", mantra: "I build sacred foundations for the collective good." },
      33: { planet: "the Cosmic Heart", crystal: "Emerald", color: "Seafoam Green", mantra: "I am an avatar of universal love and healing." }
    };
    
    const ruler = planetaryRulers[m.personalDay.number] || planetaryRulers[1];
    let reply = "";
    
    if (language === 'hi-IN') {
      if (userMessageLower.includes("career") || userMessageLower.includes("job") || userMessageLower.includes("work") || userMessageLower.includes("business") || userMessageLower.includes("नौकरी") || userMessageLower.includes("काम")) {
        reply = `प्रिय साधक, आपकी **अभिव्यक्ति संख्या (Expression Number) ${m.expression.number}** और **जीवन पथ संख्या (Life Path Number) ${m.lifePath.number}** को देखते हुए, आपका पेशेवर भविष्य बहुत मजबूत है। आपके पास प्राकृतिक रूप से ऐसी क्षमताएं हैं जो आपकी कार्यकुशलता को बढ़ाती हैं।

सफलता के लिए, आपको अपने **कार्मिक पाठों (Karmic Lessons)** से सीख लेनी होगी और आज की **व्यक्तिगत दिन ऊर्जा (Personal Day Vibration) ${m.personalDay.number}** के साथ तालमेल बिठाना होगा।

*व्यावहारिक सलाह:* आज का दिन महत्वपूर्ण निर्णय लेने के लिए अनुकूल है। संकोच छोड़ें और अपनी आंतरिक शक्ति का उपयोग करें।`;
      } else if (userMessageLower.includes("love") || userMessageLower.includes("marriage") || userMessageLower.includes("relationship") || userMessageLower.includes("partner") || userMessageLower.includes("प्यार") || userMessageLower.includes("शादी") || userMessageLower.includes("संबंध")) {
        reply = `पारिवारिक और व्यक्तिगत संबंधों के मामले में, आपकी **आत्मा की पुकार संख्या (Soul Urge Number) ${m.soulUrge.number} (${m.soulUrge.label})** यह दर्शाती है कि आपका दिल वास्तव में क्या चाहता है।

आपकी **व्यक्तित्व संख्या (Personality Number) ${m.personality.number}** के कारण लोग आपको बहुत मजबूत समझते हैं, लेकिन वास्तविक निकटता तब आती है जब आप अपनी आत्मा की वास्तविक पुकार को साझा करते हैं।

*व्यावहारिक सलाह:* आज की **व्यक्तिगत दिन संख्या ${m.personalDay.number}** के प्रभाव में, रिश्तों में करुणा और स्पष्ट सीमाएं बनाए रखें।`;
      } else if (userMessageLower.includes("money") || userMessageLower.includes("wealth") || userMessageLower.includes("finance") || userMessageLower.includes("धन") || userMessageLower.includes("पैसा")) {
        reply = `आपकी वित्तीय क्षमता आपकी भौतिक सूझबूझ और चक्रों पर निर्भर करती है। आपकी **जीवन पथ संख्या ${m.lifePath.number}** आपका मार्गदर्शन करती है, जबकि **अभिव्यक्ति संख्या ${m.expression.number}** आपको समृद्धि आकर्षित करने के उपकरण देती है।

*व्यावहारिक सलाह:* आज **${ruler.crystal}** धारण करें और इस मंत्र का जाप करें: *"${ruler.mantra}"*।`;
      } else {
        reply = `नमस्ते प्रिय साधक। वर्तमान में मुख्य चैनल अति व्यस्त होने के कारण मैं आपके लिए इस विशेष स्थानीय ओरेकल चैनल के माध्यम से उपस्थित हूं। आइए आपकी संख्याओं का विश्लेषण करें:

- आपकी **जीवन पथ संख्या (Life Path) ${m.lifePath.number} (${m.lifePath.label})** है।
- आपकी **अभिव्यक्ति संख्या (Expression) ${m.expression.number} (${m.expression.label})** है।
- आपकी **आत्मा की पुकार संख्या (Soul Urge) ${m.soulUrge.number} (${m.soulUrge.label})** है।
- आज आपका **व्यक्तिगत दिन (Personal Day) ${m.personalDay.number} (${m.personalDay.description})** है।

कृपया मुझसे अपने **करियर, प्यार, धन, या स्वास्थ्य** के बारे में विशेष प्रश्न पूछें, और मैं आपके जीवन का सटीक मार्गदर्शन करूंगा।`;
      }
    } else {
      if (userMessageLower.includes("career") || userMessageLower.includes("job") || userMessageLower.includes("work") || userMessageLower.includes("business")) {
        reply = `My dear seeker, looking at your **Expression Number ${m.expression.number}** and **Life Path ${m.lifePath.number}**, your professional destiny is highly structured. You are natural-born with talents that support ${m.expression.label.toLowerCase()} endeavors. 

To maximize your career path, you must learn to navigate around your **Karmic Lessons** and align your daily execution with today's **Personal Day Vibration of ${m.personalDay.number}**. 

*Practical Counsel:* Today is an ideal day to take actions aligned with ${m.personalDay.description.toLowerCase()}. Use this moment to assert your native superpowers and avoid stagnation. Let the planetary vibrations of ${ruler.planet} guide your decisions.`;
      } else if (userMessageLower.includes("love") || userMessageLower.includes("marriage") || userMessageLower.includes("relationship") || userMessageLower.includes("partner") || userMessageLower.includes("compatibility")) {
        reply = `When examining relationships in your blueprint, your **Soul Urge Number ${m.soulUrge.number} (${m.soulUrge.label})** speaks volumes about your emotional landscape and what your heart truly hungers for. 

With a **Personality Number ${m.personality.number}**, others initially perceive you as carrying ${m.personality.label.toLowerCase()} energy. However, true intimacy is reached when you allow them to witness your deep Soul Urge. 

*Practical Counsel:* If you are aligning compatibility, friendly triads of your numbers are your organic partners. Today, under the **Personal Day ${m.personalDay.number}**, practice offering unconditional grace and clear boundaries to foster lasting harmony.`;
      } else if (userMessageLower.includes("money") || userMessageLower.includes("wealth") || userMessageLower.includes("finance") || userMessageLower.includes("rich")) {
        reply = `Your financial potential is a dance between your material command and karmic cycles. Your **Life Path ${m.lifePath.number}** dictates your ultimate growth, while your **Expression ${m.expression.number}** gives you the actual tools to manifest abundance.

Be extremely mindful of any **Karmic Debts** present in your blueprint, which can act as leakages of energy and resources if left unremediated. 

*Practical Counsel:* Carry **${ruler.crystal}** today and repeat the sacred alignment mantra: *"${ruler.mantra}"* to align your aura with prosperity consciousness.`;
      } else if (userMessageLower.includes("health") || userMessageLower.includes("vitality") || userMessageLower.includes("energy")) {
        reply = `Your physical and somatic well-being is heavily influenced by your **Planes of Expression**, specifically your Physical Plane (${report.planesOfExpression?.physical?.percentage || 50}%) and Emotional Plane (${report.planesOfExpression?.emotional?.percentage || 50}%).

With your **Life Path ${m.lifePath.number}**, your body processes stress through specific energetic channels. When you ignore your internal alignment, somatic tension builds up.

*Practical Counsel:* To ground your energy today, conduct a brief breathing ritual at sunset and wear a touch of **${ruler.color}** to stabilize your auric shield.`;
      } else {
        reply = `Greetings, noble seeker. The oracle is currently operating in a direct deep-reading state. Let us decode the currents of your request using your core numbers:

- Your **Life Path is ${m.lifePath.number} (${m.lifePath.label})**, representing your core compass and biological trajectory.
- Your **Expression is ${m.expression.number} (${m.expression.label})**, representing your active toolkit and ultimate potential.
- Your **Soul Urge is ${m.soulUrge.number} (${m.soulUrge.label})**, representing your heart's hidden desires.
- Today is a **Personal Day ${m.personalDay.number} (${m.personalDay.description})**, bringing a vibration of active growth.

Please ask me specifically about your **career, love, money, or health**, and I shall unveil the precise mathematical paths and sacred remedies for your journey.`;
      }
    }

    return res.json({ reply: reply });
  }
});

// Memory caches for daily forecasts and life sectors to prevent Gemini API quota exhaustion
interface ForecastCacheItem {
  forecast: string;
  expiresAt: number;
}
interface SectorsCacheItem {
  sectors: any;
  expiresAt: number;
}

const dailyForecastCache = new Map<string, ForecastCacheItem>();
const lifeSectorsCache = new Map<string, SectorsCacheItem>();

// Helper to periodically prune expired cache items to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of dailyForecastCache.entries()) {
    if (now > item.expiresAt) dailyForecastCache.delete(key);
  }
  for (const [key, item] of lifeSectorsCache.entries()) {
    if (now > item.expiresAt) lifeSectorsCache.delete(key);
  }
}, 15 * 60 * 1000); // Clean every 15 minutes

// 3. API: Generate Daily Horoscope
app.post("/api/numerology/daily-forecast", async (req, res) => {
  const { report } = req.body;
  if (!report) {
    return res.status(400).json({ error: "Blueprint report is required." });
  }

  const name = report.input?.fullName || "unknown";
  const dob = report.input?.dateOfBirth || "unknown";
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const cacheKey = `${name}-${dob}-${todayStr}`;

  // Check memory cache first
  const cached = dailyForecastCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return res.json({ forecast: cached.forecast, cached: true });
  }

  try {
    const m = report.metrics;

    const systemInstruction = `You are an Elite Master Numerologist and Astrologer providing a daily spiritual horoscope.
Given the user's numerology blueprint and the current day's vibration, write a beautiful, inspiring, and deeply accurate 3-paragraph daily reading. Include practical remedies and astrological alignments.

User's Life Path: ${m.lifePath.number} (${m.lifePath.label})
User's Expression: ${m.expression.number}
Personal Year: ${m.personalYear.number}
Personal Month: ${m.personalMonth.number}
TODAY'S Personal Day Vibration: ${m.personalDay.number} (${m.personalDay.description})

Focus heavily on the meaning of TODAY's Personal Day Vibration (${m.personalDay.number}) and how it interacts with their Life Path. 
Give actionable advice for love, career, or spiritual growth for today.
Also include a brief "Remedy of the Day" (e.g., a color to wear, a crystal to carry, or a mantra) and mention the relevant ruling planetary energies.
Use professional, mystical, but grounded language. Do not use markdown headers, just return a well-formatted 3-paragraph response.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: "Please generate my daily numerological horoscope for today." }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const botReply = response.text || "The cosmos are quiet today. Trust your intuition.";
    
    // Store in cache for 24 hours
    dailyForecastCache.set(cacheKey, {
      forecast: botReply,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    return res.json({ forecast: botReply });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429')) {
       return res.status(429).setHeader('Retry-After', '5').json({ error: 'Rate limited' });
    }
    // Silent fallback when Gemini API fails due to quotas
    
    const m = report.metrics;
    const lp = m.lifePath.number;
    const lpLabel = m.lifePath.label || "";
    const ex = m.expression.number;
    const py = m.personalYear.number;
    const pm = m.personalMonth.number;
    const pd = m.personalDay.number;
    const pdDesc = m.personalDay.description || "Active vibrational day";

    const introOptions = [
      `Today, your celestial landscape is deeply amplified by the number ${pd} frequency, representing a day of ${pdDesc.toLowerCase()}. Operating under a Personal Year ${py} and Personal Month ${pm}, your foundational Life Path ${lp} (${lpLabel}) is stepping into a powerful convergence. The cosmic tides are aligning to highlight your inner potential, urging you to pay attention to sudden intuitive flashes and synchronous events that manifest around you today.`,
      `As the universal clock strikes today's active vibration of ${pd} (${pdDesc.toLowerCase()}), you are being called to bridge the gap between your external Expression ${ex} and internal Life Path ${lp}. This creates an energetic gateway that demands both focus and active presence. Your personal month frequency of ${pm} serves as a catalyst, urging you to dismantle old patterns and welcome fresh perspectives.`,
      `The vibration of ${pd} governs your cosmic channels today, triggering a powerful field of ${pdDesc.toLowerCase()}. When this frequency meets your Life Path ${lp} energy, it sparks a unique spiritual resonance. You may feel a pull to realign your daily habits with your grander soul objectives. Today offers a clean slate to re-establish your sovereignty and clear any stagnant ancestral blockages.`
    ];

    const adviceByDay: Record<number, string> = {
      1: "As you navigate a Personal Day 1, the energy of new beginnings, independence, and leadership is fully charged. In career, trust your unique ideas and take the initiative on outstanding projects; the cosmos are supporting decisive, sovereign moves. In relationships, set clean, healthy boundaries while remaining receptive. This is a day to stand tall in your authentic self and initiate the change you want to see.",
      2: "Today's Personal Day 2 vibration emphasizes harmony, cooperation, and intuitive sensitivity. In professional matters, seek collaboration rather than solo triumphs; listening and diplomacy are your greatest assets today. Emotionally, take time to check in with loved ones and honor your emotional depth. Slow down and let the gentle currents of partnership guide your decisions.",
      3: "Under the creative, expressive, and social influence of Personal Day 3, your throat chakra is highly active. In career, share your visions, pitch ideas, or engage in creative problem-solving—your communication carries an extra spark of alchemical magic. Socially, express your authentic joy and lift others up. Playfulness and art are your ultimate portals of connection today.",
      4: "A Personal Day 4 demands structure, foundation, and practical effort. In professional realms, focus on organizing files, refining systems, and tackling detailed tasks that require steady concentration. In your personal life, establish order and ground yourself in comforting routines. This is not a day for erratic changes, but rather for anchoring your roots deeply.",
      5: "Change, freedom, and dynamic motion are the hallmarks of your Personal Day 5. In career, be ready to pivot quickly as unexpected opportunities or emails invite fresh expansion. Socially, embrace spontaneous encounters and trust the flow of adventure. Release any rigid expectations and allow yourself to learn from the unexpected.",
      6: "Today's Personal Day 6 puts a beautiful spotlight on home, family, nurturing, and sacred duty. Professionally, focus on mentoring, supporting colleagues, and creating a harmonious working environment. In personal relationships, offer your heart as a safe sanctuary for those you love. Balancing responsibilities with self-care is your main lesson today.",
      7: "A Personal Day 7 calls for quiet reflection, study, and deep spiritual introspection. In career, trust your analytical skills and seek quiet spaces to work—it is an ideal day for research and strategy. Spend some time in silence or nature to recharge your sensitive energetic batteries and listen to the whispers of your inner oracle.",
      8: "The powerhouse vibration of Personal Day 8 turns your attention to material sovereignty, abundance, and personal authority. In your career, make bold financial or strategic moves; your executive focus is exceptionally sharp. In relationships, stand in your power with absolute integrity. Balance material ambitions with spiritual gratitude to unlock true wealth.",
      9: "Under the universal, compassionate vibration of Personal Day 9, you are experiencing a cycle of completion and release. In career, wrap up outstanding projects and clear out digital clutter to prepare for the next chapter. Emotionally, practice deep forgiveness and let go of stagnant resentments. Trust that what leaves your life today is making room for beautiful new alignment.",
      11: "As you step into a Master Day 11, your intuitive channels are wide open, acting as a direct antenna to the astral planes. Pay close attention to synchronous events and sudden insights in both career and love. Trust your prophetic instincts and avoid crowded, chaotic spaces that might overwhelm your sensitive nervous system.",
      22: "A Master Day 22 vibration empowers you to architect massive, long-term foundations. In career, think big—how can you scale your daily actions to benefit your community or future generations? In personal matters, align your highest spiritual truths with practical execution. You have the master power to materialize dreams today.",
      33: "Under the rare Master Day 33, universal love and spiritual service govern your day. Your presence alone acts as a powerful healing balm for those around you. Approach all professional and personal interactions with radical empathy and unconditional grace, allowing conflict to dissolve effortlessly."
    };

    const planetaryRulers: Record<number, { planet: string; crystal: string; color: string; mantra: string }> = {
      1: { planet: "the Sun", crystal: "Carnelian", color: "Ruby Red", mantra: "I am sovereign, aligned, and starting anew." },
      2: { planet: "the Moon", crystal: "Moonstone", color: "Silver-White", mantra: "I trust my intuition and flow with grace." },
      3: { planet: "Jupiter", crystal: "Lapis Lazuli", color: "Royal Blue", mantra: "I express my joy and manifest creativity." },
      4: { planet: "Rahu", crystal: "Tiger's Eye", color: "Forest Green", mantra: "I am grounded, structured, and focused." },
      5: { planet: "Mercury", crystal: "Citrine", color: "Amber Yellow", mantra: "I embrace change and welcome new adventures." },
      6: { planet: "Venus", crystal: "Rose Quartz", color: "Soft Pink", mantra: "I radiate love and nurture my sacred boundaries." },
      7: { planet: "Ketu / Neptune", crystal: "Amethyst", color: "Deep Purple", mantra: "I seek truth and trust the wisdom of silence." },
      8: { planet: "Saturn", crystal: "Black Obsidian", color: "Charcoal Black", mantra: "I stand in my authority with absolute integrity." },
      9: { planet: "Mars", crystal: "Clear Quartz", color: "Pure Gold", mantra: "I complete my cycles with grace and release the past." },
      11: { planet: "Uranus", crystal: "Moldavite", color: "Electric Violet", mantra: "I am a pure channel of cosmic inspiration." },
      22: { planet: "Pluto", crystal: "Selenite", color: "Pearl white", mantra: "I build sacred foundations for the collective good." },
      33: { planet: "the Cosmic Heart", crystal: "Emerald", color: "Seafoam Green", mantra: "I am an avatar of universal love and healing." }
    };

    const dayAdvice = adviceByDay[pd] || "Embrace the unique energetic flow of today, allowing your intuition to guide you through both professional tasks and relational encounters. Balance action with self-care to maintain a harmonious flow.";
    const ruler = planetaryRulers[pd] || planetaryRulers[1];
    const remedyText = `To fully align with today's planetary ruler ${ruler.planet}, consider wearing a touch of ${ruler.color} or carrying a ${ruler.crystal} stone. Connect with your inner power by repeating this sacred mantra throughout the day: "${ruler.mantra}". These small but intentional adjustments will naturally ground your aura and neutralize any shadow vibrations.`;

    const randomIntro = introOptions[Math.floor(Math.random() * introOptions.length)];
    const fallbackForecast = `${randomIntro}\n\n${dayAdvice}\n\n${remedyText}`;

    // Cache fallback forecast for 1 hour so we eventually retry but don't spam
    dailyForecastCache.set(cacheKey, {
      forecast: fallbackForecast,
      expiresAt: Date.now() + 60 * 60 * 1000
    });

    return res.json({ forecast: fallbackForecast, isFallback: true });
  }
});


// 4. API: Generate Real-World Sectoral Analysis
app.post("/api/numerology/life-sectors", async (req, res) => {
  const { report } = req.body;
  if (!report) return res.status(400).json({ error: "Blueprint report is required." });

  const name = report.input?.fullName || "unknown";
  const dob = report.input?.dateOfBirth || "unknown";
  const cacheKey = `${name}-${dob}`;

  // Check life sectors cache first
  const cached = lifeSectorsCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return res.json({ sectors: cached.sectors, cached: true });
  }

  try {
    const m = report.metrics;
    
    const systemInstruction = `You are an Elite Master Numerologist providing a BLUNT, UNCENSORED, highly realistic real-world analysis of the user's life sectors based on their numerology.
Do NOT sugarcoat. Do NOT use buttery or flattering language. Point out exactly where they will struggle, what they must avoid, and their actual potentials.

User's Life Path: ${m.lifePath.number} (${m.lifePath.label})
User's Expression: ${m.expression.number}
Soul Urge: ${m.soulUrge.number}
Personality: ${m.personality?.number || m.personality?.value || 5}
Maturity: ${m.maturity?.number || m.maturity?.value || 7}

Return the response EXACTLY as a JSON object with this structure (no markdown tags like '''json, just raw JSON text):
{
  "scores": [
    { "category": "Career & Ambition", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis of their career potential and setbacks)" },
    { "category": "Wealth & Money", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Marriage & Relationships", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Health & Vitality", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Study & Intellect", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Property & Assets", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" }
  ],
  "cautions": [
    { "title": "Careers to Avoid", "description": "(List of careers/industries to stay away from based on their numbers)" },
    { "title": "Toxic Partnerships", "description": "(Types of people or specific life path numbers they should avoid)" },
    { "title": "Vulnerable Years / Timelines", "description": "(Specific personal years or ages where they face maximum friction)" },
    { "title": "Karmic Traps", "description": "(Specific behavioral traps or situations they will repeatedly fall into)" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: "Generate the sectoral analysis JSON." }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");

    // Cache successful life-sectors analysis for 24 hours
    lifeSectorsCache.set(cacheKey, {
      sectors: result,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    return res.json({ sectors: result });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429')) {
       return res.status(429).setHeader('Retry-After', '5').json({ error: 'Rate limited' });
    }
    // Silent fallback when Gemini API fails due to quotas
    
    const m = report.metrics;
    const lp = m.lifePath.number;
    const ex = m.expression.number;
    const su = m.soulUrge.number;
    const ps = m.personality?.number || 5;
    const mt = m.maturity?.number || 7;
    
    const baseCareer = Math.min(98, Math.max(45, 60 + (lp * 4) % 35));
    const baseMoney = Math.min(96, Math.max(40, 55 + (ex * 5) % 38));
    const baseMarriage = Math.min(95, Math.max(38, 50 + (su * 6) % 42));
    const baseHealth = Math.min(92, Math.max(45, 65 + (ps * 4) % 25));
    const baseIntellect = Math.min(99, Math.max(50, 70 + (mt * 3) % 28));
    const baseProperty = Math.min(95, Math.max(35, 50 + (lp * 5) % 45));

    const result = {
      scores: [
        { 
          category: "Career & Ambition", 
          value: baseCareer, 
          analysis: `With a Life Path ${lp} and Expression ${ex}, you possess a powerful professional blueprint. Your work style is best matched with highly independent environments where you can execute complex visions. Avoid micromanaged corporate grids that stifle your inner drives.` 
        },
        { 
          category: "Wealth & Money", 
          value: baseMoney, 
          analysis: `Your financial frequency is strongly tied to your Expression ${ex}. You have a natural capacity to manifest abundance when you align your skills with structured planning. Watch for impulsive spending during emotional high-tides.` 
        },
        { 
          category: "Marriage & Relationships", 
          value: baseMarriage, 
          analysis: `Your Soul Urge ${su} dictates a heart that hungers for authentic depth. You thrive in partnerships that honor both physical grounding and spiritual space. Communication of boundaries will unlock extreme relational synergy.` 
        },
        { 
          category: "Health & Vitality", 
          value: baseHealth, 
          analysis: `Your physical vitality is ruled by how you process somatic stress. With Personality ${ps}, you carry a strong physical presence, but you must regularly release accumulated tension. Grounding yourself in nature is a non-negotiable ritual.` 
        },
        { 
          category: "Study & Intellect", 
          value: baseIntellect, 
          analysis: `Operating with a Maturity ${mt} frequency, your intellect is sharpest when exploring deep, specialized systems or philosophy. You are a lifelong learner whose mental capacities expand as your spiritual practice deepens.` 
        },
        { 
          category: "Property & Assets", 
          value: baseProperty, 
          analysis: `Asset accumulation is highly favorable when structured around long-term security. Rely on systematic investments rather than high-risk speculative ventures. Your numbers support solid foundations.` 
        }
      ],
      cautions: [
        { 
          title: "Careers to Avoid", 
          description: `Rigid, highly bureaucratic roles that lack creative independence or force repetitive manual actions without strategic inputs.` 
        },
        { 
          title: "Toxic Partnerships", 
          description: `Highly co-dependent or controlling dynamics with individuals who reject spiritual growth or disregard your sensitive boundaries.` 
        },
        { 
          title: "Vulnerable Years / Timelines", 
          description: `Years ending in 4 or 8, or during transitional Personal Years when major structural transformations are demanded of your soul.` 
        },
        { 
          title: "Karmic Traps", 
          description: `Over-functioning for others at the expense of your own physical wellness, or escaping practical duties into pure abstract mysticism.` 
        }
      ]
    };

    // Cache the fallback analysis for 1 hour so we don't immediately retry Gemini on subsequent clicks
    lifeSectorsCache.set(cacheKey, {
      sectors: result,
      expiresAt: Date.now() + 60 * 60 * 1000
    });

    return res.json({ sectors: result, isFallback: true });
  }
});

// Start Express server and bind with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Numerologist server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
