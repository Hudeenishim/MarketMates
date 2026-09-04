const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const targetStr = `        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sales Trends (Last 30 Days)</h2>
        </div>`;

const replaceStr = `        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sales Trends (Last 30 Days)</h2>
          </div>
          <button
            onClick={exportSalesToCSV}
            disabled={salesData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
