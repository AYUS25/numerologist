const fs = require('fs');
let form = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');

form = form.replace(
  "import { Calendar, User, Sparkles, AlertCircle, Clock, MapPin } from 'lucide-react';",
  "import { Calendar, User, Sparkles, AlertCircle, Clock, MapPin, Phone } from 'lucide-react';"
);

fs.writeFileSync('src/components/IntakeForm.tsx', form);
console.log("Fixed Phone import");
