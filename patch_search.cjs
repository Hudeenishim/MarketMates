const fs = require('fs');

function patchFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Replace MapControls completely
  const regex = /const MapControls: React\.FC<\{[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\};/m;
  
  const newMapControls = `
const MapControls: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      e.preventDefault();
      if (!places) return;
      try {
        const { places: resultPlaces } = await places.Place.searchByText({
          textQuery: query,
          fields: ['displayName', 'location'],
        });
        if (resultPlaces && resultPlaces.length > 0) {
          const loc = resultPlaces[0].location;
          if (loc) {
            const lat = loc.lat();
            const lng = loc.lng();
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
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLocationSelect(lat, lng);
          map?.panTo({ lat, lng });
          map?.setZoom(15);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get current location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200 w-[90%] max-w-md z-10">
      <input 
        type="text" 
        placeholder="Type a location and press Enter..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
      <button 
        onClick={handleCurrentLocation}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        title="Use Current Location"
      >
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
};
`;

  code = code.replace(regex, newMapControls.trim());
  fs.writeFileSync(filename, code);
}

patchFile('src/views/DeliveryDashboard.tsx');
patchFile('src/views/RiderDashboard.tsx');
