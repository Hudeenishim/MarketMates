const fs = require('fs');
let code = fs.readFileSync('src/components/MapDirections.tsx', 'utf8');

code = code.replace(
  /if \(route\.path\) \{\n\s*polyline\.setPath\(route\.path\);\n\s*\}/,
  `if (route.path) {
             const mappedPath = route.path.map((p: any) => ({ lat: typeof p.lat === 'function' ? p.lat() : p.lat, lng: typeof p.lng === 'function' ? p.lng() : p.lng }));
             polyline.setPath(mappedPath);
           }`
);

fs.writeFileSync('src/components/MapDirections.tsx', code);
console.log("Patched route.path mapping");
