const fs = require('fs');
let code = fs.readFileSync('src/views/AboutView.tsx', 'utf8');

code = code.replace(
  '<h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">How to Use MarketMates</h1>',
  '<h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 text-center w-full flex justify-center items-center">How to Use</h1>'
);

code = code.replace(
  '<div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center text-center">',
  '<div className="bg-white rounded-[2rem] p-8 sm:p-16 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[40vh] w-full">'
);

fs.writeFileSync('src/views/AboutView.tsx', code);
