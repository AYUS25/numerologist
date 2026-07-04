const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Insert the Recharts horizontal BarChart for Sectors
const sectorsSubtabsRegex = /\{\/\* Sub-navigation for sectors \*\/\}/;

const chartCode = `
              {/* Visual Scaling Component via Recharts */}
              <div className="glass-panel p-6 rounded-2xl mb-8">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-widest font-sans mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Life Sectors Intensity Scaling
                </h4>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.lifePredictions}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#8e8e93" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis dataKey="category" type="category" stroke="#8e8e93" fontSize={11} tickLine={false} axisLine={false} width={100} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#2c2c2e', borderRadius: '12px', fontSize: '12px', color: '#f5f5f7' }}
                        itemStyle={{ color: '#0a84ff' }}
                        cursor={{fill: '#2c2c2e', opacity: 0.4}}
                      />
                      <Bar dataKey="score" fill="#0a84ff" radius={[0, 4, 4, 0]} barSize={16}>
                         {
                           report.lifePredictions.map((entry: any, index: number) => (
                             <Cell key={\`cell-\${index}\`} fill={entry.score > 75 ? '#32d74b' : entry.score > 50 ? '#0a84ff' : '#ff9f0a'} />
                           ))
                         }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sub-navigation for sectors */}`;

// Also need to make sure `Cell` is imported from recharts.
if (!code.includes("Cell,")) {
  code = code.replace("BarChart, Bar } from 'recharts';", "BarChart, Bar, Cell } from 'recharts';");
}

code = code.replace(sectorsSubtabsRegex, chartCode);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Sectors Chart");
