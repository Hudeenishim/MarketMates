const fs = require('fs');

let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col lg:flex-row gap-6 h-[600px]">',
  '<div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[700px]">'
);

code = code.replace(
  '<div className="w-full lg:w-1/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-y-auto p-4">',
  '<div className="w-full lg:w-1/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-y-auto p-4 flex-none">'
);

code = code.replace(
  '<div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">',
  '<div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative flex-1 min-h-[400px]">'
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log("Patched DeliveryDashboard.tsx");
