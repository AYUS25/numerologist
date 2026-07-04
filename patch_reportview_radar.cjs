const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!code.includes('import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer }')) {
  code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/, 
    "import { motion, AnimatePresence } from 'motion/react';\nimport { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';");
}

const cautionaryInsightsJSX = `
                      {compatResult.cautionaryInsights && compatResult.cautionaryInsights.length > 0 && (
                         <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-2">
                           <div className="flex items-center gap-2 text-orange-400 text-xs uppercase font-bold tracking-wider font-serif">
                             <AlertTriangle className="w-4 h-4" />
                             <span>Cautionary Insight: Karmic Dissonance</span>
                           </div>
                           <ul className="list-disc pl-5 space-y-1">
                             {compatResult.cautionaryInsights.map((w: string, i: number) => (
                               <li key={i} className="text-xs text-orange-200/80 leading-relaxed font-sans">{w}</li>
                             ))}
                           </ul>
                         </div>
                      )}
`;

const radarChartJSX = `
                      {/* Radar Chart for 5 Dimensions */}
                      {compatResult.radarData && compatResult.radarData.length > 0 && (
                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center">
                          <span className="text-xs uppercase font-bold text-blue-500 tracking-wider font-serif mb-4 block w-full text-center">
                            Multi-Dimensional Synergy Map
                          </span>
                          <div className="w-full h-[250px] sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={compatResult.radarData}>
                                <PolarGrid stroke="#3f3f46" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'sans-serif' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Synergy" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
`;

// Insert after the score circle div
const scoreCircleRegex = /<div className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6">[\s\S]*?<\/div>\s*<\/div>/;

const match = scoreCircleRegex.exec(code);
if (match) {
  code = code.substring(0, match.index) + cautionaryInsightsJSX + match[0] + radarChartJSX + code.substring(match.index + match[0].length);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log('ReportView.tsx updated with radar chart and cautionary insights');
} else {
  console.log('Regex did not match score circle');
}

