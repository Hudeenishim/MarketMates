const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  code = code.replace(
    /navigator\.geolocation\.getCurrentPosition\(\n\s*\(position\) => \{([\s\S]*?)\},\n\s*\(error\) => \{([\s\S]*?)\}\n\s*\);/m,
    `navigator.geolocation.getCurrentPosition(
        (position) => {$1},
        (error) => {$2},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );`
  );
  
  fs.writeFileSync(filename, code);
  console.log("Patched geolocation in " + filename);
}

patchFile('src/views/DeliveryDashboard.tsx');
patchFile('src/views/RiderDashboard.tsx');

