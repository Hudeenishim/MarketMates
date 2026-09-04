const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  'className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-4 mb-24 relative min-h-[80vh]"',
  'className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-32 relative min-h-[80vh]"'
);

code = code.replace(
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex flex-col gap-8 overflow-visible"',
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 md:pb-12 flex flex-col gap-8 overflow-visible mb-20 md:mb-0"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
