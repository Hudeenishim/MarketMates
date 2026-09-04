const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const newHeading = `          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
            <button
              onClick={exportInventoryToCSV}
              disabled={products.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>`;

code = code.replace(
  '<h2 className="text-xl font-bold text-slate-900">Inventory</h2>',
  newHeading
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
