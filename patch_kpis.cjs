const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const kpiCode = `      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Banknote className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Total Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">
              ₵{salesData.reduce((acc, curr) => acc + curr.sales, 0).toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Products</p>
            <h3 className="text-2xl font-bold text-slate-900">{products.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Active Offers</p>
            <h3 className="text-2xl font-bold text-slate-900">{actionableNegotiations.length}</h3>
          </div>
        </div>
      </div>\n`;

const targetString2 = `{activeTab === 'overview' && (<>\n      {/* Sales Trend Chart */}`;

if (code.includes(targetString2)) {
  code = code.replace(targetString2, `{activeTab === 'overview' && (<>\n${kpiCode}      {/* Sales Trend Chart */}`);
  fs.writeFileSync('src/views/VendorDashboard.tsx', code);
  console.log('Added KPIs');
} else {
  console.log('Could not find target');
}
