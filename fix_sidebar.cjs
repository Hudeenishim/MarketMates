const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  "md:flex flex-col w-full md:w-64 shrink-0 gap-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-4 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}",
  "flex-col w-full md:w-64 shrink-0 gap-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-4 transition-all duration-300 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}"
);

// I should also rename "Current Inventory" to "Inventory" in the UI.
code = code.replace(
  '<h2 className="text-xl font-bold text-slate-900">Current Inventory</h2>',
  '<h2 className="text-xl font-bold text-slate-900">Inventory</h2>'
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
