const fs = require('fs');
let code = fs.readFileSync('src/views/RiderDashboard.tsx', 'utf8');

code = code.replace(
  /const handleMapClick = async \(e: any\) => \{\n\s*if \(\!e\.detail\.latLng\) return;\n\s*const loc = e\.detail\.latLng;\n\s*setMyLocation\(loc\);/,
  `const handleMapClick = async (e: any) => {
    if (!e.detail.latLng) return;
    const lat = typeof e.detail.latLng.lat === 'function' ? e.detail.latLng.lat() : e.detail.latLng.lat;
    const lng = typeof e.detail.latLng.lng === 'function' ? e.detail.latLng.lng() : e.detail.latLng.lng;
    const loc = { lat, lng };
    setMyLocation(loc);`
);

fs.writeFileSync('src/views/RiderDashboard.tsx', code);
console.log("Patched Map Click Rider");
