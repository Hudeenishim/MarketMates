const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

code = code.replace(
  '<div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">\n              <div>\n                <h3 className="text-2xl font-bold text-slate-900">{selectedNeg.product?.name}</h3>\n                <p className="text-slate-500 text-sm mt-1">Negotiating with {selectedNeg.otherPartyName}</p>\n              </div>\n              <div className="text-right">\n                <div className="text-[10px] uppercase font-bold text-slate-400">Listed Price</div>\n                <div className="text-xl font-bold text-slate-900">₵{selectedNeg.product?.price_ghs}</div>\n              </div>\n            </div>',
  `<div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{selectedNeg.product?.name}</h3>
                <p className="text-slate-500 text-base sm:text-lg">Negotiating with {selectedNeg.otherPartyName}</p>
              </div>
              <div className="text-right flex flex-col justify-center">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Listed Price</div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">₵{selectedNeg.product?.price_ghs}</div>
              </div>
            </div>`
);

fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
