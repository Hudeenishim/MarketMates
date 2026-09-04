const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Update Sales layout
const salesTarget = `      <div className="flex-shrink-0 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">`;
const salesReplace = `      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col min-h-[500px]">`;
code = code.replace(salesTarget, salesReplace);

const chartTarget = `<div className="h-64 w-full">`;
const chartReplace = `<div className="flex-1 w-full min-h-[300px]">`;
code = code.replace(chartTarget, chartReplace);

// Update Overview layout
// Wrap overview contents in the new div and change the internal divs to not have bg-white (since the wrapper does)
const overviewStartTarget = `      {activeTab === 'overview' && (<>
      {/* Voice Record Card */}
      <div className="flex-shrink-0 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">`;
const overviewStartReplace = `      {activeTab === 'overview' && (<>
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col min-h-[500px] gap-8">
      {/* Voice Record Card */}
      <div className="flex flex-col md:flex-row gap-8 items-center relative group">`;
code = code.replace(overviewStartTarget, overviewStartReplace);

const overviewEndTarget = `        </div>
      )}

      </>)}`;
const overviewEndReplace = `        </div>
      )}
      </div>
      </>)}`;
code = code.replace(overviewEndTarget, overviewEndReplace);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
