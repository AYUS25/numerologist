const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Find the Astrological Blueprint box and add Vedic info if possible.
// Actually, it's fine as long as we're utilizing the Chaldean in NameAnalysis, which we are.
// I will just add the Vedic Psychic/Destiny text to the Astrological list.
const vedicItem = `
                          <li className="flex justify-between pt-2 mt-2 border-t border-white/[0.08]">
                            <span className="text-zinc-400">Vedic Psychic No.</span>
                            <span className="text-blue-500 font-semibold">{parseInt(input.dateOfBirth.split('-')[2]) > 9 ? parseInt(input.dateOfBirth.split('-')[2]) % 9 || 9 : parseInt(input.dateOfBirth.split('-')[2])}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Vedic Destiny No.</span>
                            <span className="text-blue-500 font-semibold">{metrics.lifePath.number}</span>
                          </li>
`;
code = code.replace(
  /<\/ul>\s*<\/div>\s*\)\}\s*<\/div>/,
  vedicItem + "\n                        </ul>\n                      </div>\n                    )}\n                  </div>"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Added Vedic display to ReportView");
