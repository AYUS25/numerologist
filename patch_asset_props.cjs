const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, `interface Props {\n  lifePathNumber: number;\n  rootNumber: number;\n}`);
code = code.replace(/export default function AssetAnalyzer\(\{ lifePathNumber \}: Props\) \{/, `export default function AssetAnalyzer({ lifePathNumber, rootNumber }: Props) {`);

fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
