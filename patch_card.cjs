const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const target = `<div key={product.id} className="bg-slate-50 rounded-3xl p-4 border border-slate-100 group relative">
                      <div className="absolute top-2 left-2 z-10 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {activeNeg && (
                          <div className="absolute top-2 right-2 z-10">`;

const replacement = `<div key={product.id} className="bg-slate-50 rounded-3xl p-4 border border-slate-100 group relative">
                      <div className="absolute top-2 left-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {activeNeg && (
                          <div className="absolute top-12 right-2 z-10">`;

code = code.replace(target, replacement);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
