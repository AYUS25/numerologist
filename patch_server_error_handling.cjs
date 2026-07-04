const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace chat fallback
code = code.replace(/\} catch \(err: any\) \{[\s\S]*?return res\.json\(\{ reply: fallbackReply \}\);\n\s*\}/, 
`} catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }`);

// Replace daily forecast fallback
code = code.replace(/\} catch \(err: any\) \{[\s\S]*?return res\.json\(\{ forecast: fallbackForecast, isFallback: true \}\);\n\s*\}/,
`} catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }`);

// Replace life sectors fallback
code = code.replace(/\} catch \(err: any\) \{[\s\S]*?return res\.json\(\{ sectors: result, isFallback: true \}\);\n\s*\}/,
`} catch (err: any) {
    let retryAfter = 60;
    if (err.status === 429 || (err.message && err.message.includes("429")) || err.status === "RESOURCE_EXHAUSTED" || (err.message && err.message.includes("quota"))) {
      const match = err.message?.match(/retry in ([\\d\\.]+)s/);
      if (match) retryAfter = Math.ceil(parseFloat(match[1]));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    }
    return res.status(500).json({ error: "Internal server error" });
  }`);

fs.writeFileSync('server.ts', code);
