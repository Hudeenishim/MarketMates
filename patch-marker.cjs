const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /await updateDoc\(doc\(db, 'deliveries', selectedDelivery\.id\), updateData\);\n\s*alert\('Location updated successfully!'\);/g,
  `await updateDoc(doc(db, 'deliveries', selectedDelivery.id), updateData);
        setMarkerPosition(null);
        alert('Location updated successfully!');`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log("Patched marker nulling");
