const fs = require('fs');

// Patch NegotiationCenter.tsx
let negCode = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');
negCode = negCode.replace(
  "otherPartyName: isVendor ? 'Demo Buyer' : 'Demo Vendor'",
  "otherPartyName: isVendor ? 'Demo Buyer' : 'Demo Vendor',\n        otherPartyPhone: '+233550000000'"
);
fs.writeFileSync('src/views/NegotiationCenter.tsx', negCode);

// Patch DeliveryDashboard.tsx
let delCode = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');
delCode = delCode.replace(
  "setDeliveries(dummyDeliveries as any);",
  "setDeliveries(dummyDeliveries.map(d => ({...d, otherPartyName: 'Demo User', otherPartyPhone: '+233550000000', riderName: 'Demo Rider', riderPhone: '+233550000001'})) as any);"
);
// wait, how is setDeliveries called in demoMode? Let's check first!
