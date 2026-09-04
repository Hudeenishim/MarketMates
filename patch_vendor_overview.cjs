const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const chartCode = `      {/* Sales Trend Chart */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex-shrink-0 overflow-visible mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
        </div>
        <div className="w-full h-64 sm:h-80 lg:h-96 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 12, fill: '#64748b' }}
                 dy={10}
                 minTickGap={30}
              />
              <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 12, fill: '#64748b' }}
                 tickFormatter={(val) => \`₵\${val}\`}
                 dx={-10} 
               />
              <Tooltip 
                 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [\`₵\${Number(value).toFixed(2)}\`, 'Sales']}
                labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
              />
              <Line 
                 type="monotone" 
                 dataKey="sales" 
                 stroke="#10B981" 
                 strokeWidth={3} 
                 dot={false} 
                 activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                 animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {weeklyAnalysis && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex-shrink-0">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Weekly Analysis (Last 28 Days)</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 1</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w1.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 2</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w2.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Week 3</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w3.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">This Week</div>
                <div className="text-lg font-bold text-slate-900">₵{weeklyAnalysis.w4.toFixed(2)}</div>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-800">{weeklyAnalysis.trendText}</p>
            </div>
          </div>
        )}
      </div>`;

// Let's insert the chart into the overview tab
const targetString = `{activeTab === 'overview' && (<>
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex flex-col gap-8 overflow-visible">`;

if (code.includes(targetString)) {
  code = code.replace(targetString, `{activeTab === 'overview' && (<>\n${chartCode}\n      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-auto min-h-fit pb-12 flex flex-col gap-8 overflow-visible">`);
  fs.writeFileSync('src/views/VendorDashboard.tsx', code);
  console.log('Successfully added chart to overview tab');
} else {
  console.log('Could not find target string');
}
