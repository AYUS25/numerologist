const fs = require('fs');
let content = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const targetStr = "{idx === 0 ? 'Primary Resonance' : 'Secondary Resonance'}";
const replacementStr = "{idx === 0 ? 'Career Resonance' : idx === 1 ? 'Relational Resonance' : idx === 2 ? 'Vitality Resonance' : idx === 3 ? 'Wealth Resonance' : idx === 4 ? 'Spiritual Resonance' : idx === 5 ? 'Active Phase Resonance' : 'Karmic Resonance'}";

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/ReportView.tsx', content, 'utf8');
    console.log("Updated Crystal UI Labels");
} else {
    console.log("Could not find Crystal UI target string");
}
