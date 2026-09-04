const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /if \(!profile\) return;\n\s*\/\/ Available deliveries/g,
  `if (demoMode && !user) {\n      const dummyPending = [\n        {\n          id: 'demo_del_1',\n          negotiation_id: 'n1',\n          vendor_id: 'v1',\n          buyer_id: 'b1',\n          status: 'pending',\n          pickup_location: { lat: 5.5837, lng: -0.1970 },\n          delivery_location: { lat: 5.6137, lng: -0.1670 },\n          created_at: Date.now(),\n          updated_at: Date.now()\n        }\n      ];\n      setAvailableDeliveries(dummyPending);\n      setMyDeliveries([]);\n      return;\n    }\n\n    if (!profile) return;\n       \n    // Available deliveries`
);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard dummy data");
