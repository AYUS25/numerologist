const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(/                <\/div><\/div>\n              <\/div>\n            <\/motion\.div>/g, 
`                </div>
              </div>
            </motion.div>`);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Fixed extra div');
