const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const regex = /                  \)\}\n                <\/div><\/div>\n              <\/div>\n            <\/motion\.div>\n          \)\}\n\n          \{\/\* Tab 6: Forecast \*\/\}/;

code = code.replace(regex, 
`                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 6: Forecast */}`);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Fixed extra div again');
