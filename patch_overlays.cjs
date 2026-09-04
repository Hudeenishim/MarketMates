const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  const hasValidCheck = `{import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith('AIza') ? (`;
  
  if (code.includes(hasValidCheck)) {
    // 1. Change the ternary to wrap the APIProvider and the Overlay
    code = code.replace(
      hasValidCheck,
      `{import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith('AIza') ? (\n            <>\n`
    );

    // 2. We need to find where the APIProvider ends and where the overlay ends.
    // In both files, the structure is:
    // </APIProvider>
    // ) : (
    // ... disabled div ...
    // )}
    // {/* Overlay controls */}
    // <div className="absolute ..."> ... </div>
    // </div>
    // </div>

    // It's easier to use a regex to grab the APIProvider block, disabled block, and overlay block and re-arrange them.
    const regex = /(<APIProvider apiKey=\{import\.meta\.env\.VITE_GOOGLE_MAPS_API_KEY\}>[\s\S]*?<\/APIProvider>)\s*\)\s*:\s*\(([\s\S]*?Map Preview Disabled[\s\S]*?<\/div>)\s*\)\}\s*(\{\/\* Overlay controls \*\/\}[\s\S]*?<\/div>\s*<\/div>)/;
    
    code = code.replace(regex, (match, provider, disabled, overlay) => {
      // The original code had:
      // {cond ? ( provider ) : ( disabled )} overlay
      // We want:
      // {cond ? ( <> provider overlay </> ) : ( disabled )}
      return `${provider}\n              ${overlay}\n            </>\n          ) : (\n${disabled}\n          )}`;
    });

    fs.writeFileSync(filename, code);
  }
}

patchFile('src/views/DeliveryDashboard.tsx');
patchFile('src/views/RiderDashboard.tsx');
