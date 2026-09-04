const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  // Add Search icon import if not present
  if (!code.includes('Search,')) {
    code = code.replace(/import {([^}]*Navigation[^}]*)} from 'lucide-react';/, (match, group) => {
      if (!group.includes('Search')) {
         return match.replace('Navigation', 'Navigation, Search');
      }
      return match;
    });
  }
  
  // Refactor handleSearch
  code = code.replace(
    /const handleSearch = async \(e: React\.KeyboardEvent<HTMLInputElement>\) => {([\s\S]*?)};\n\n\s*const handleCurrentLocation/m,
    `const performSearch = async () => {
    if (query.trim() === '') return;
    if (!places) {
      alert('Places library not loaded yet.');
      return;
    }
    try {
      const { places: resultPlaces } = await places.Place.searchByText({
        textQuery: query,
        fields: ['displayName', 'location'],
      });
      if (resultPlaces && resultPlaces.length > 0) {
        const loc = resultPlaces[0].location;
        if (loc) {
          const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
          const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
          onLocationSelect(lat, lng);
          map?.panTo({ lat, lng });
          map?.setZoom(15);
        }
      } else {
        alert('No results found for that location.');
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to search location.');
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleCurrentLocation`
  );

  // Update JSX
  code = code.replace(
    /<input \n\s*type="text"([\s\S]*?)className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"\n\s*\/>\n\s*<button \n\s*onClick=\{handleCurrentLocation\}/m,
    `<input 
        type="text" 
        placeholder="Type a location..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
      <button
        onClick={performSearch}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>
      <button 
        onClick={handleCurrentLocation}`
  );
  
  fs.writeFileSync(filename, code);
  console.log("Patched " + filename);
}

patchFile('src/views/DeliveryDashboard.tsx');
patchFile('src/views/RiderDashboard.tsx');

