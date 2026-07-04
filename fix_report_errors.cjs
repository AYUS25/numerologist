const fs = require('fs');

// 1. Fix ReportView.tsx
let report = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Remove local ZodiacConstellation
report = report.replace(
  /const ZodiacConstellation = \(\{\s*sign\s*\}\: \{ sign: string \}\) => \{[\s\S]*?<\/svg>\n    <\/div>\n  \);\n\};/,
  ""
);

// Fix multiple attributes
report = report.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} /g, "onMouseEnter={() => playHoverTick()} ");
// Wait, actually I just need to remove the duplicates if any. Let's just strip out all added attributes and redo it correctly, or find the duplicated ones.
// The error was "JSX elements cannot have multiple attributes with the same name."
// This means there is `onMouseEnter` or `onTouchMove` twice.
// Let's replace `onMouseEnter={() => playHoverTick()} onMouseEnter={() => playHoverTick()}` with single.
report = report.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\}\s*onMouseEnter=\{\(\) => playHoverTick\(\)\}/g, "onMouseEnter={() => playHoverTick()}");
report = report.replace(/onTouchMove=\{\(\) => playHoverTick\(\)\}\s*onTouchMove=\{\(\) => playHoverTick\(\)\}/g, "onTouchMove={() => playHoverTick()}");

// If it already had an onMouseEnter, my patch added another one. Let's just fix it by replacing the first one.
// Let's just remove all `onMouseEnter={() => playHoverTick()} ` that appear before `onMouseEnter=`
report = report.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} \s*(<button.*?onMouseEnter=)/g, "$1");
report = report.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\} \s*onTouchMove=\{\(\) => playHoverTick\(\)\} \s*onMouseEnter/g, "onTouchMove={() => playHoverTick()} onMouseEnter");
// Actually, let's use a regex to clean up any element with multiple onMouseEnters.
// Let's just remove ALL my added hover ticks and let's add them back only to `button` tags safely.
report = report.replace(/onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} /g, "");
// And then add it to buttons safely:
report = report.replace(/<button(?![^>]*onMouseEnter)([^>]*)>/g, '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} $1>');


fs.writeFileSync('src/components/ReportView.tsx', report);

// 2. Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  /onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} /g, ""
);
app = app.replace(/<button(?![^>]*onMouseEnter)([^>]*)>/g, '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} $1>');
// Fix systemError
app = app.replace(/\{\s*systemError\s*&&\s*\(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\s*\}/g, "");
app = app.replace(/systemError/g, "toast"); // This is a bit brute-force, let's just remove any remaining {systemError &&} lines.
// Actually, the error was "Cannot find name 'systemError'." on line 294 and 297.
fs.writeFileSync('src/App.tsx', app);

// 3. Fix IntakeForm.tsx
let form = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');
form = form.replace(
  /onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\} /g, ""
);
form = form.replace(/<button(?![^>]*onMouseEnter)([^>]*)>/g, '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} $1>');

// Make sure Phone is imported properly.
if (!form.includes('Phone')) {
  form = form.replace(/import \{.*?\} from 'lucide-react';/, "import { Calendar, User, MapPin, Clock, Sparkles, AlertCircle, Phone } from 'lucide-react';");
}
fs.writeFileSync('src/components/IntakeForm.tsx', form);

// Update ZodiacConstellation.tsx to accept `sign` or `dateOfBirth`
let zodiac = fs.readFileSync('src/components/ZodiacConstellation.tsx', 'utf8');
zodiac = zodiac.replace(
  "interface Props {\n  dateOfBirth: string;\n}",
  "interface Props {\n  dateOfBirth?: string;\n  sign?: string;\n}"
);
zodiac = zodiac.replace(
  "export default function ZodiacConstellation({ dateOfBirth }: Props) {",
  "export default function ZodiacConstellation({ dateOfBirth, sign: inputSign }: Props) {"
);
zodiac = zodiac.replace(
  "const sign = getZodiacSign(dateOfBirth);",
  "const sign = inputSign || (dateOfBirth ? getZodiacSign(dateOfBirth) : 'Aries');"
);
fs.writeFileSync('src/components/ZodiacConstellation.tsx', zodiac);


console.log('Fixed errors');
