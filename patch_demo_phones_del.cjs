const fs = require('fs');
let delCode = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');
delCode = delCode.replace(
  "setDeliveries(dummyDeliveries);",
  "const enrichedDummy = dummyDeliveries.map(d => ({ ...d, otherPartyName: 'Demo User', otherPartyPhone: '+233550000000', riderName: 'Demo Rider', riderPhone: '+233550000001' }));\n      setDeliveries(enrichedDummy);"
);
delCode = delCode.replace(
  "const found = dummyDeliveries.find(d => d.negotiation_id === negId);",
  "const found = enrichedDummy.find(d => d.negotiation_id === negId);"
);
fs.writeFileSync('src/views/DeliveryDashboard.tsx', delCode);
