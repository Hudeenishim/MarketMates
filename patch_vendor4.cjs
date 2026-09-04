const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 overflow-visible"',
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex-shrink-0 overflow-visible"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
