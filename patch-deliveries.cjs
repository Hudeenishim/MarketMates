const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /if \(negId\) \{\n\s*const found = res\.find\(d => d\.negotiation_id === negId\);\n\s*if \(found\) setSelectedDelivery\(found\);\n\s*\}/,
  `if (negId) {
          const found = res.find(d => d.negotiation_id === negId);
          if (found) setSelectedDelivery(found);
        }
        
        setSelectedDelivery(prev => {
          if (!prev) return null;
          const updated = res.find(d => d.id === prev.id);
          return updated || prev;
        });`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log("Patched onSnapshot");
