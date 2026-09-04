require('dotenv').config({ path: '.env' });
const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
    console.log("No API Key found");
    process.exit(0);
}

fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
  },
  body: JSON.stringify({
    origin: {
      location: {
        latLng: {
          latitude: 5.6037,
          longitude: -0.1870
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: 5.6537,
          longitude: -0.1570
        }
      }
    },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  })
}).then(res => res.json()).then(data => {
  console.log(JSON.stringify(data, null, 2));
}).catch(err => {
  console.error(err);
});
