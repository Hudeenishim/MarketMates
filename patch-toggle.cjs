const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  /const toggleStock = async \(product: Product\) => \{([\s\S]*?)if \(demoMode\) \{([\s\S]*?)\} else \{([\s\S]*?)try \{([\s\S]*?)\}/,
  `const toggleStock = async (product: Product) => {
    if (demoMode) {
      setProducts(products.map(p => p.id === product.id ? { ...p, stock_status: !p.stock_status } : p));
    } else {
      try {`
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched toggle");
