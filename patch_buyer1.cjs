const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

code = code.replace(
  "Only {product.stock_quantity} left",
  "Only {product.stock_quantity} {product.unit || 'pcs'} left"
);

// We should probably also display the quantity if > 5. Let's check the code around line 374.
fs.writeFileSync('src/views/BuyerView.tsx', code);
