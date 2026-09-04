const fs = require('fs');
let code = fs.readFileSync('src/views/AboutView.tsx', 'utf8');

code = code.replace(
  "} from 'lucide-react';",
  ", Motorbike, MapPin, Truck } from 'lucide-react';"
);

fs.writeFileSync('src/views/AboutView.tsx', code);
console.log("Patched imports");
