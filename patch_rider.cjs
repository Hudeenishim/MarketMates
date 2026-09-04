const fs = require('fs');

let code = fs.readFileSync('src/views/RiderDashboard.tsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col lg:flex-row gap-6 h-[600px]">',
  '<div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[700px]">'
);

code = code.replace(
  '<div className="w-full lg:w-1/3 flex flex-col gap-6">',
  '<div className="w-full lg:w-1/3 flex flex-col gap-6 flex-none">'
);

code = code.replace(
  '<div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">',
  '<div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative flex-1 min-h-[400px]">'
);

fs.writeFileSync('src/views/RiderDashboard.tsx', code);
console.log("Patched RiderDashboard.tsx");
