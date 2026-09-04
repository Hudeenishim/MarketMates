const fs = require('fs');
let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

// First product
const oldProd1 = `<div className="w-full h-20 bg-orange-100 rounded-xl mb-2 flex items-center justify-center"><Store className="text-orange-400 w-6 h-6" /></div>
          <div className="flex justify-between items-start">
            <div className="font-bold text-sm text-slate-800">Organic Yams</div>
            <div className="flex gap-1">
              <Edit2 className="w-3 h-3 text-slate-400" />
              <Trash2 className="w-3 h-3 text-slate-400" />
            </div>
          </div>`;

const newProd1 = `<div className="w-full h-20 bg-orange-100 rounded-xl mb-2 flex items-center justify-center relative">
            <div className="absolute top-1 left-1 bg-white/90 p-1 rounded-full text-slate-500 shadow-sm"><Edit2 className="w-3 h-3" /></div>
            <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-slate-500 shadow-sm"><Trash2 className="w-3 h-3" /></div>
            <Store className="text-orange-400 w-6 h-6" />
          </div>
          <div className="font-bold text-sm text-slate-800">Organic Yams</div>`;

code = code.replace(oldProd1, newProd1);

// Second product
const oldProd2 = `<div className="w-full h-20 bg-red-50 rounded-xl mb-2 flex items-center justify-center">
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex justify-between items-start">
            <div className="font-bold text-sm text-slate-900 leading-tight">Fresh Tomatoes</div>
            <div className="flex gap-1">
              <Edit2 className="w-3 h-3 text-emerald-500" />
              <Trash2 className="w-3 h-3 text-emerald-500" />
            </div>
          </div>`;

const newProd2 = `<div className="w-full h-20 bg-red-50 rounded-xl mb-2 flex items-center justify-center relative">
            <div className="absolute top-1 left-1 bg-white/90 p-1 rounded-full text-emerald-600 shadow-sm"><Edit2 className="w-3 h-3" /></div>
            <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 shadow-sm"><Trash2 className="w-3 h-3" /></div>
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <div className="font-bold text-sm text-slate-900 leading-tight">Fresh Tomatoes</div>`;

code = code.replace(oldProd2, newProd2);

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
