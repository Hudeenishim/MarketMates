const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  // Replace {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? ... with checking for AIza
  const search1 = /{import.meta.env.VITE_GOOGLE_MAPS_API_KEY \? \(/;
  const search2 = /{import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith\('AIza'\) \? \(/;
  
  if (code.includes(search1.source.replace(/\\/g, ''))) {
    code = code.replace(
      /\{import\.meta\.env\.VITE_GOOGLE_MAPS_API_KEY \? \(/,
      `{import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith('AIza') ? (`
    );
  }

  fs.writeFileSync(filename, code);
}

patchFile('src/views/DeliveryDashboard.tsx');
patchFile('src/views/RiderDashboard.tsx');
