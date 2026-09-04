const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  /const handleUpdateProduct = async \(e: React\.FormEvent\) => \{([\s\S]*?)const docRef = await addDoc\(collection\(db, 'products'\), newProduct\);\n/m,
  `const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    let finalImageUrl = editProductImageUrl;
    if (editProductImageUrl === '') {
       setIsGeneratingImage(true);
       finalImageUrl = await generateImage(editProductName);
       setIsGeneratingImage(false);
    }
    
    if (demoMode) {
      setProducts(products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: editProductName,
            price_ghs: parseFloat(editProductPrice),
            stock_quantity: parseInt(editProductStockQuantity),
            category: editProductCategory,
            unit: editProductUnit,
            image_url: finalImageUrl,
            updated_at: Date.now()
          };
        }
        return p;
      }));
    } else {
      try {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          name: editProductName,
          price_ghs: parseFloat(editProductPrice),
          stock_quantity: parseInt(editProductStockQuantity),
          category: editProductCategory,
          unit: editProductUnit,
          image_url: finalImageUrl,
          updated_at: Date.now()
        });
`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched update syntax error");
