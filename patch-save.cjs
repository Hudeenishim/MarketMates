const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /await setDoc\(doc\(db, 'deliveries', deliveryId\), newDelivery\);\n\s*alert\('Delivery initiated and location set!'\);/g,
  `await setDoc(doc(db, 'deliveries', deliveryId), newDelivery);
        setActiveNegotiation(null);
        alert('Delivery initiated and location set!');`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log("Patched save");
