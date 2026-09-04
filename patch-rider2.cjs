const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

// Update my deliveries snapshot to sync selectedDelivery
code = code.replace(
  /setMyDeliveries\(data\);\n\s*\}\);/,
  `setMyDeliveries(data);\n      setSelectedDelivery(prev => {\n        if (!prev) return null;\n        const updated = data.find(d => d.id === prev.id);\n        return updated || prev;\n      });\n    });`
);

// Update available deliveries snapshot to sync selectedDelivery
code = code.replace(
  /setAvailableDeliveries\(data\.filter\(d => d\.pickup_location && d\.delivery_location\)\);\n\s*\}\);/,
  `const filtered = data.filter(d => d.pickup_location && d.delivery_location);\n      setAvailableDeliveries(filtered);\n      setSelectedDelivery(prev => {\n        if (!prev) return null;\n        const updated = filtered.find(d => d.id === prev.id);\n        // We don't overwrite with prev if it's not found in available, \n        // because it might have moved to myDeliveries, which handles its own update.\n        return prev;\n      });\n    });`
);

// Change handleAcceptDelivery so it doesn't nullify
code = code.replace(
  /setSelectedDelivery\(null\); \/\/ Deselect from available list/g,
  `setSelectedDelivery(prev => prev ? { ...prev, status: 'accepted', rider_id: profile.id } : null);`
);

code = code.replace(
  /setSelectedDelivery\(null\);\n\s*return;\n\s*\}/g,
  `setSelectedDelivery(prev => prev ? { ...prev, status: 'accepted', rider_id: profile?.id || 'demo_rider' } : null);\n      return;\n    }`
);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard again");
