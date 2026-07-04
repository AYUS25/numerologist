const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
// Basic cache maps
const chatCache = new Map<string, { reply: string, expiresAt: number }>();
const dailyForecastCache = new Map<string, { forecast: string, expiresAt: number }>();
const lifeSectorsCache = new Map<string, { sectors: any, expiresAt: number }>();

app.post("/api/numerology/chat", async (req, res) => {
  const { message, history, report } = req.body;
  if (!message || !report) return res.status(400).json({ error: "Missing required fields." });
  
  try {
    const m = report.metrics;
    let systemInstruction = \`You are 'Aetheria', an elite Master Numerologist AI.
You are guiding a user whose Life Path is \${m.lifePath.number} (\${m.lifePath.label}).
Their Expression is \${m.expression.number} and Soul Urge is \${m.soulUrge.number}.
Keep responses deep, highly insightful, slightly mystical but practical, and concise.\`;

    const chatHistory = history || [];
    let contents = chatHistory.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));
    contents.push({ role: "user", parts: [{ text: message }] });
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    
    return res.json({ reply: response.text || "The cosmos are silent." });
  } catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/numerology/daily-forecast", async (req, res) => {
  const { report } = req.body;
  if (!report) return res.status(400).json({ error: "Missing report." });
  
  const name = report.input?.fullName || "unknown";
  const dob = report.input?.dateOfBirth || "unknown";
  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = \`\${name}-\${dob}-\${todayStr}\`;
  
  const cached = dailyForecastCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return res.json({ forecast: cached.forecast, cached: true });
  }

  try {
    const m = report.metrics;
    const systemInstruction = \`You are an elite numerologist providing a daily planetary and numerological transit reading.
The user is a Life Path \${m.lifePath.number} (\${m.lifePath.label}).
Their Personal Year is \${m.personalYear.number} and Personal Day is \${m.personalDay.number}.
Provide a 2-3 sentence deeply insightful forecast for today. Be poetic but grounded.\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: "Provide my daily forecast." }] }],
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    
    const forecast = response.text || "The energies are resting today.";
    
    dailyForecastCache.set(cacheKey, {
      forecast,
      expiresAt: Date.now() + 12 * 60 * 60 * 1000
    });
    
    return res.json({ forecast });
  } catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/numerology/life-sectors", async (req, res) => {
  const { report } = req.body;
  if (!report) return res.status(400).json({ error: "Missing report." });
  
  const name = report.input?.fullName || "unknown";
  const dob = report.input?.dateOfBirth || "unknown";
  const cacheKey = \`\${name}-\${dob}\`;
  
  const cached = lifeSectorsCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return res.json({ sectors: cached.sectors, cached: true });
  }

  try {
    const m = report.metrics;
    const systemInstruction = \`You are an Elite Master Numerologist providing a BLUNT, UNCENSORED, highly realistic real-world analysis of the user's life sectors based on their numerology.
Do NOT sugarcoat. Point out exactly where they will struggle, what they must avoid, and their actual potentials.
User's Life Path: \${m.lifePath.number} (\${m.lifePath.label})
User's Expression: \${m.expression.number}
Soul Urge: \${m.soulUrge.number}
Personality: \${m.personality?.number || m.personality?.value || 5}
Maturity: \${m.maturity?.number || m.maturity?.value || 7}

Return the response EXACTLY as a JSON object with this structure (no markdown tags):
{
  "scores": [
    { "category": "Career & Ambition", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Wealth & Money", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Marriage & Relationships", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Health & Vitality", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Study & Intellect", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" },
    { "category": "Property & Assets", "value": (1-100 score), "analysis": "(Blunt 2-3 sentence analysis)" }
  ],
  "cautions": [
    { "title": "Careers to Avoid", "description": "(List of careers to avoid)" },
    { "title": "Toxic Partnerships", "description": "(Types of people to avoid)" },
    { "title": "Vulnerable Years / Timelines", "description": "(Specific personal years where they face friction)" },
    { "title": "Karmic Traps", "description": "(Specific behavioral traps)" }
  ]
}\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: "Generate the sectoral analysis JSON." }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });
    
    const result = JSON.parse(response.text || "{}");
    
    lifeSectorsCache.set(cacheKey, {
      sectors: result,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    
    return res.json({ sectors: result });
  } catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});
`;

code = code.replace("// Start Express server", endpoints + "\n// Start Express server");

fs.writeFileSync('server.ts', code);
