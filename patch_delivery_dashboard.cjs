const fs = require('fs');

let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

// 1. Add useMapsLibrary, useMap to imports
code = code.replace(
  "import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';",
  "import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';"
);

// 2. Add the inner component MapControls above DeliveryDashboard
const mapControlsCode = `
const MapControls: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ['geometry', 'name', 'formatted_address'] };
    setAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onLocationSelect(lat, lng);
        map?.panTo({ lat, lng });
        map?.setZoom(15);
      }
    });
  }, [autocomplete, map, onLocationSelect]);

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
          alert("Could not get current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200 w-[90%] max-w-md z-10">
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="Search for a location..." 
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

code = code.replace(
  "export const DeliveryDashboard: React.FC = () => {",
  mapControlsCode + "\nexport const DeliveryDashboard: React.FC = () => {"
);

// 3. Add <MapControls /> inside <APIProvider>
code = code.replace(
  /{import\.meta\.env\.VITE_GOOGLE_MAPS_API_KEY && import\.meta\.env\.VITE_GOOGLE_MAPS_API_KEY\.startsWith\('AIza'\) \? \([\s\S]*?<Map/m,
  (match) => match.replace("<Map", "<MapControls onLocationSelect={(lat, lng) => setMarkerPosition({lat, lng})} />\n              <Map")
);

fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
