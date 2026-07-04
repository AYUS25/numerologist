export type ApiStats = {
  healthy: boolean;
  successfulRequests: number;
  failedRequests: number;
  remainingQuota: string | number;
};

let stats: ApiStats = {
  healthy: true,
  successfulRequests: 0,
  failedRequests: 0,
  remainingQuota: 'Unknown'
};

const listeners = new Set<(stats: ApiStats) => void>();

export function subscribeApiStats(listener: (stats: ApiStats) => void) {
  listeners.add(listener);
  listener(stats);
  return () => { listeners.delete(listener); };
}

function updateStats(updates: Partial<ApiStats>) {
  stats = { ...stats, ...updates };
  listeners.forEach(l => l(stats));
}

// Generates fallback responses
function generateFallback(url: string, body: any): any {
  if (url === '/api/numerology/chat') {
    return {
      reply: "The cosmic energies are recalibrating. My connection to the higher planes is temporarily clouded by interference, but remember that your numbers hold steady. Take a moment to breathe and recenter."
    };
  }
  
  if (url === '/api/numerology/daily-forecast') {
    const report = body?.report;
    const lp = report?.metrics?.lifePath?.number || 1;
    return {
      forecast: `The lunar forces are currently in a brief void-of-course state, masking deeper insights. For a Life Path ${lp}, today calls for grounding and patience. Focus on immediate, practical tasks and avoid initiating major emotional confrontations until the energetic static clears.`
    };
  }
  
  if (url === '/api/numerology/life-sectors') {
    const report = body?.report;
    const m = report?.metrics;
    const lp = m?.lifePath?.number || 1;
    const ex = m?.expression?.number || 1;
    const su = m?.soulUrge?.number || 1;
    const ps = m?.personality?.number || 5;
    const mt = m?.maturity?.number || 7;
    
    return {
      sectors: {
        scores: [
          { category: "Career & Ambition", value: Math.min(95, 50 + lp*4), analysis: `Your Life Path ${lp} and Expression ${ex} drive a need for independence and structure. You excel when given autonomy.` },
          { category: "Wealth & Money", value: Math.min(95, 45 + ex*5), analysis: `You have strong potential for manifesting wealth when you align with your authentic values.` },
          { category: "Marriage & Relationships", value: Math.min(95, 50 + su*5), analysis: `Your Soul Urge ${su} desires profound connections. Boundaries are essential for your relational harmony.` },
          { category: "Health & Vitality", value: Math.min(95, 55 + ps*3), analysis: `Your Personality ${ps} dictates how you hold tension. Regular grounding exercises are highly recommended.` },
          { category: "Study & Intellect", value: Math.min(95, 60 + mt*3), analysis: `Operating with Maturity ${mt}, you are naturally inclined toward continuous, deep learning.` },
          { category: "Property & Assets", value: Math.min(95, 40 + lp*6), analysis: `Long-term structured investments will yield the most stable material foundations.` }
        ],
        cautions: [
          { title: "Careers to Avoid", description: "Avoid highly rigid or micro-managed roles." },
          { title: "Toxic Partnerships", description: "Stay away from individuals who drain your energetic boundaries." },
          { title: "Vulnerable Timelines", description: "Transitional years may bring abrupt shifts." },
          { title: "Karmic Traps", description: "Over-extending yourself for others without self-care." }
        ]
      },
      isFallback: true
    };
  }
  
  return {};
}

type Task = {
  url: string;
  options: RequestInit;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  retries: number;
};

const queue: Task[] = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  
  while (queue.length > 0) {
    const task = queue.shift()!;
    
    try {
      const response = await fetch(task.url, task.options);
      
      if (response.status === 429) {
        updateStats({ healthy: false, failedRequests: stats.failedRequests + 1 });
        const data = await response.json().catch(() => ({}));
        const retryAfter = data.retryAfter || 10;
        
        if (task.retries < 3) {
          console.warn(`Rate limited (429). Retrying in ${retryAfter}s...`);
          // Put back in queue after delay
          setTimeout(() => {
            task.retries++;
            queue.push(task);
            processQueue();
          }, retryAfter * 1000);
        } else {
          console.warn("Max retries reached after 429. Using fallback generator.");
          const body = task.options.body ? JSON.parse(task.options.body as string) : {};
          task.resolve(generateFallback(task.url, body));
        }
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      updateStats({ healthy: true, successfulRequests: stats.successfulRequests + 1 });
      const json = await response.json();
      task.resolve(json);
      
    } catch (err: any) {
      updateStats({ healthy: false, failedRequests: stats.failedRequests + 1 });
      
      if (task.retries < 2) {
        const delay = Math.pow(2, task.retries) * 2000; // 2s, 4s backoff
        setTimeout(() => {
          task.retries++;
          queue.push(task);
          processQueue();
        }, delay);
      } else {
        console.warn("API completely failed, triggering rich local fallback generator.");
        const body = task.options.body ? JSON.parse(task.options.body as string) : {};
        task.resolve(generateFallback(task.url, body));
      }
    }
  }
  
  isProcessing = false;
}

export function fetchWithRetry(url: string, options: RequestInit = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    queue.push({
      url,
      options,
      resolve,
      reject,
      retries: 0
    });
    processQueue();
  });
}
