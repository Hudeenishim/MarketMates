const fs = require('fs');

let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

code = code.replace(/try \{\);/g, `try {
        await updateDoc(doc(db, 'products', product.id), {
          stock_status: !product.stock_status,
          updated_at: Date.now()
        });
`);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
console.log("Patched toggle syntax error");
