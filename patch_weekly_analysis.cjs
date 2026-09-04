const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// 1. Add weeklyAnalysis useMemo after salesData
const weeklyAnalysisCode = `
  const weeklyAnalysis = React.useMemo(() => {
    if (salesData.length < 28) return null;
    
    // Group into 4 weeks (7 days each)
    // week 1 is oldest (days 0-6), week 4 is newest (days 21-27)
    // We have 30 days of data. Let's just take the last 28 days for 4 even weeks.
    const recent28 = salesData.slice(-28);
    
    const w1 = recent28.slice(0, 7).reduce((sum, d) => sum + d.sales, 0);
    const w2 = recent28.slice(7, 14).reduce((sum, d) => sum + d.sales, 0);
    const w3 = recent28.slice(14, 21).reduce((sum, d) => sum + d.sales, 0);
    const w4 = recent28.slice(21, 28).reduce((sum, d) => sum + d.sales, 0);

    let trendText = "Your sales have remained relatively stable this month.";
    if (w4 > w3 * 1.1) {
      trendText = "Excellent progress! Your sales this week are up significantly compared to last week.";
    } else if (w4 < w3 * 0.9) {
      trendText = "Notice: Sales have dipped a bit this week. Consider reviewing your inventory or offers.";
    } else if (w4 > 0 && w3 > 0) {
      trendText = "Steady performance! You're matching last week's sales pace.";
    } else if (w4 === 0 && w3 === 0 && w2 === 0 && w1 === 0) {
      trendText = "No sales recorded in the last 28 days. Add some products and start accepting offers!";
    }

    return { w1, w2, w3, w4, trendText };
  }, [salesData]);
`;

code = code.replace(
  "  }, [demoMode, myNegotiations]);",
  "  }, [demoMode, myNegotiations]);\n" + weeklyAnalysisCode
);

// 2. Add the UI below the chart
const chartEndStr = `          </ResponsiveContainer>
        </div>`;
const analysisUI = `          </ResponsiveContainer>
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
        )}`;

code = code.replace(chartEndStr, analysisUI);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
