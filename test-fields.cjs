const fs = require('fs');
let code = fs.readFileSync('src/components/MapDirections.tsx', 'utf8');

code = code.replace(
  /fields: \['durationMillis', 'distanceMeters', 'polyline'\]/,
  "fields: ['durationMillis', 'distanceMeters', 'path']"
);

code = code.replace(
  /if \(route\.polyline && route\.polyline\.encodedPolyline\) \{\n\s*const path = geometryLibrary\.encoding\.decodePath\(route\.polyline\.encodedPolyline\);\n\s*polyline\.setPath\(path\);\n\s*\}/,
  `if (route.path) {
             polyline.setPath(route.path);
           }`
);

fs.writeFileSync('src/components/MapDirections.tsx', code);
console.log("Patched fields");
