const fs = require('fs');
let vendorCode = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');
let buyerCode = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

vendorCode = vendorCode.replace(
  'className="bg-slate-50 rounded-3xl p-4 border border-slate-100 group relative"',
  'className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100/50 hover:shadow-md transition-all group relative"'
);

buyerCode = buyerCode.replace(
  'className="bg-slate-50 rounded-3xl p-4 border border-slate-100 group flex flex-col relative"',
  'className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100/50 hover:shadow-md transition-all group flex flex-col relative"'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', vendorCode);
fs.writeFileSync('src/views/BuyerView.tsx', buyerCode);
