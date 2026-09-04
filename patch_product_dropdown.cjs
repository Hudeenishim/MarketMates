const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const targetStr = `                      <div className="absolute top-2 left-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>`;

const replaceStr = `                      <div className="absolute top-2 right-2 z-20">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === product.id ? null : product.id); }} 
                          className="bg-white/90 p-1.5 rounded-full shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openDropdownId === product.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); openEditModal(product); }} 
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); setProductToDelete(product); }} 
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
