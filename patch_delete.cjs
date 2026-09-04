const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// 1. Add state
const stateInsertion = `  const [editProductImageUrl, setEditProductImageUrl] = useState('');
  const [cameraMode, setCameraMode] = useState<'add' | 'edit'>('add');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);`;
code = code.replace(`  const [editProductImageUrl, setEditProductImageUrl] = useState('');
  const [cameraMode, setCameraMode] = useState<'add' | 'edit'>('add');`, stateInsertion);

// 2. Modify handleDeleteProduct
const oldHandleDelete = `  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    if (demoMode) {
      setProducts(products.filter(p => p.id !== product.id));
    } else {
      try {
        await deleteDoc(doc(db, 'products', product.id));
      } catch (err) {
        console.error("Error deleting product", err);
      }
    }
  };`;

const newHandleDelete = `  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    if (demoMode) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } else {
      try {
        await deleteDoc(doc(db, 'products', productToDelete.id));
      } catch (err) {
        console.error("Error deleting product", err);
      }
    }
    setProductToDelete(null);
  };`;
code = code.replace(oldHandleDelete, newHandleDelete);

// 3. Update button
const oldButton = `<button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors">`;
const newButton = `<button onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }} className="bg-white/90 p-2 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors">`;
code = code.replace(oldButton, newButton);

// 4. Add Modal
const modalCode = `
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Product</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProduct} 
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}`;
code = code.replace(`{/* Edit Product Modal */}`, modalCode);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
