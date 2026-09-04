const fs = require('fs');

let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

// 1. Add Motorbike import
code = code.replace(
  "import { Play, X, Mic, MessageSquare, Truck, Search, Store, Package, CheckCircle, Pause, Edit2, Trash2, PhoneCall } from 'lucide-react';",
  "import { Play, X, Mic, MessageSquare, Motorbike, Search, Store, Package, CheckCircle, Pause, Edit2, Trash2, PhoneCall } from 'lucide-react';"
);

// 2. Replace <Truck with <Motorbike
code = code.replace(/<Truck /g, '<Motorbike ');

// 3. Optional: we can change the subtitle to explicitly mention Riders:
// subtitle: 'Live map tracking and dynamic ETAs guide riders from pickup to dropoff.'
// -> subtitle: 'Dedicated Rider dashboards with live map tracking from pickup to dropoff.'

code = code.replace(
  "subtitle: 'Live map tracking and dynamic ETAs guide riders from pickup to dropoff.'",
  "subtitle: 'Dedicated Rider dashboards with live map tracking from pickup to dropoff.'"
);

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
console.log("Patched TutorialOverlay.tsx");
