const fs = require('fs');

const file = `import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface MapDirectionsProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onETAUpdate?: (eta: string, distance: string) => void;
}

export const MapDirections: React.FC<MapDirectionsProps> = ({ origin, destination, onETAUpdate }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
  }, [routesLibrary, map]);

  const onETAUpdateRef = React.useRef(onETAUpdate);
  useEffect(() => {
    onETAUpdateRef.current = onETAUpdate;
  }, [onETAUpdate]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) {
      if (directionsRenderer) directionsRenderer.setDirections({ routes: [] } as any);
      return;
    }

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          directionsRenderer.setDirections(response);
          if (onETAUpdateRef.current) {
            const route = response.routes[0];
            if (route && route.legs && route.legs.length > 0) {
              const leg = route.legs[0];
              onETAUpdateRef.current(leg.duration?.text || '', leg.distance?.text || '');
            }
          }
        } else {
          console.error('Directions request failed due to ' + status);
          directionsRenderer.setDirections({ routes: [] } as any);
        }
      }
    );
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
};
`;

fs.writeFileSync('src/components/MapDirections.tsx', file);
console.log('updated');
