const fs = require('fs');

function fix(filepath) {
  let code = fs.readFileSync(filepath, 'utf8');
  code = code.replace(
    /const lat = typeof loc\.lat === 'function' \? loc\.lat\(\) : loc\.lat;/g,
    `const lat = Number(typeof loc.lat === 'function' ? loc.lat() : loc.lat);`
  );
  code = code.replace(
    /const lng = typeof loc\.lng === 'function' \? loc\.lng\(\) : loc\.lng;/g,
    `const lng = Number(typeof loc.lng === 'function' ? loc.lng() : loc.lng);`
  );
  fs.writeFileSync(filepath, code);
  console.log("Patched", filepath);
}

fix('src/views/DeliveryDashboard.tsx');
fix('src/views/RiderDashboard.tsx');
