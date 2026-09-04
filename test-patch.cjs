const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

code = code.replace(
  /const handleMapClick = \(e: any\) => \{\n\s*if \(\!e\.detail\.latLng\) return;\n\s*setMarkerPosition\(e\.detail\.latLng\);\n\s*\};/,
  `const handleMapClick = (e: any) => {
    if (!e.detail.latLng) return;
    const lat = typeof e.detail.latLng.lat === 'function' ? e.detail.latLng.lat() : e.detail.latLng.lat;
    const lng = typeof e.detail.latLng.lng === 'function' ? e.detail.latLng.lng() : e.detail.latLng.lng;
    setMarkerPosition({ lat, lng });
  };`
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
console.log("Patched Map Click");
