const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');
code = code.replace(
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col min-h-[500px]"',
  'className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 min-h-[500px]"'
);
code = code.replace(
  'className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 flex-shrink-0 gap-4"',
  'className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4"'
);
code = code.replace(
  'className="pb-12 flex flex-col gap-8"',
  'className="pb-12 space-y-8"'
);
fs.writeFileSync('src/views/BuyerView.tsx', code);
