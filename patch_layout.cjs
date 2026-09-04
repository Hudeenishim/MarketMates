const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Fix KPI Cards Grid
code = code.replace(
  'className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0 mb-6"',
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-shrink-0 mb-6"'
);

// Fix Voice Record Card layout
code = code.replace(
  'className="flex flex-col md:flex-row gap-8 items-center relative group"',
  'className="flex flex-col lg:flex-row gap-8 items-center relative group"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Updated VendorDashboard.tsx");
