const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(
  "const [newProductCategory, setNewProductCategory] = useState('Product');",
  "const [newProductCategory, setNewProductCategory] = useState('Vegetables');\n  const [newProductUnit, setNewProductUnit] = useState('pieces');"
);

// We need to pass the unit to the new product object
code = code.replace(
  "stock_quantity: Number(newProductStockQuantity),",
  "stock_quantity: Number(newProductStockQuantity),\n        unit: newProductUnit,"
);

code = code.replace(
  "stock_quantity: Number(newProductStockQuantity),",
  "stock_quantity: Number(newProductStockQuantity),\n          unit: newProductUnit,"
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
