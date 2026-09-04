const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// Patch handleAddProduct to work correctly in demo mode
code = code.replace(
  /const handleAddProduct = async \(e: React\.FormEvent\) => \{([\s\S]*?)if \(demoMode\) \{([\s\S]*?)\} else \{([\s\S]*?)try \{([\s\S]*?)\}/,
  `const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile && !demoMode) return;

    let finalImageUrl = newProductImageUrl;
    if (newProductImageUrl === '') {
       setIsGeneratingImage(true);
       finalImageUrl = await generateImage(newProductName);
       setIsGeneratingImage(false);
    }
    
    if (demoMode) {
      const newProduct = {
        id: 'demo_' + Date.now(),
        vendor_id: 'demo_user',
        name: newProductName,
        price_ghs: parseFloat(newProductPrice),
        stock_quantity: parseInt(newProductStockQuantity) || 0,
        category: newProductCategory,
        unit: newProductUnit,
        image_url: finalImageUrl,
        description: '',
        stock_status: true,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      setProducts([newProduct, ...products]);
    } else {
      try {`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched add product demo mode");
