const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const editModal = `
      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-lg text-slate-900">Edit Product</h3>
              <button onClick={closeEditModal} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input
                    type="text"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Price (₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProductPrice}
                      onChange={(e) => setEditProductPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Quantity</label>
                    <input
                      type="number"
                      value={editProductStockQuantity}
                      onChange={(e) => setEditProductStockQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select
                      value={editProductCategory}
                      onChange={(e) => setEditProductCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium appearance-none"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains & Cereals">Grains & Cereals</option>
                      <option value="Meat & Poultry">Meat & Poultry</option>
                      <option value="Fish & Seafood">Fish & Seafood</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Spices & Herbs">Spices & Herbs</option>
                      <option value="Oils & Fats">Oils & Fats</option>
                      <option value="Tubers & Roots">Tubers & Roots</option>
                      <option value="Prepared Foods">Prepared Foods</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Unit</label>
                    <select
                      value={editProductUnit}
                      onChange={(e) => setEditProductUnit(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium appearance-none"
                    >
                      <option value="pieces">pieces</option>
                      <option value="kg">kg</option>
                      <option value="liters">liters</option>
                      <option value="bags">bags</option>
                      <option value="boxes">boxes</option>
                      <option value="bunches">bunches</option>
                      <option value="baskets">baskets</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Image</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={editProductImageUrl}
                        onChange={(e) => setEditProductImageUrl(e.target.value)}
                        className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                        placeholder="Image URL or leave empty for AI generation"
                      />
                      {editProductImageUrl && editProductImageUrl.startsWith('data:') && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none bg-slate-50 rounded-r-2xl pl-2">
                          <span className="text-xs text-emerald-600 font-bold">Image selected</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => startCamera('edit')}
                      className="relative w-12 h-[50px] shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors"
                      title="Take Photo"
                    >
                      <Camera className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}`;

code = code.replace('{/* Camera Modal */}', editModal);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
