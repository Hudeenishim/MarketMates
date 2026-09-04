const fs = require('fs');
let code = `import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface MapDirectionsProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onETAUpdate?: (eta: string, distance: string) => void;
}

export const MapDirections: React.FC<MapDirectionsProps> = ({ origin, destination, onETAUpdate }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const geometryLibrary = useMapsLibrary('geometry');
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;
    const newPolyline = new google.maps.Polyline({
      map,
      strokeColor: '#10B981',
      strokeWeight: 6,
      strokeOpacity: 0.8,
    });
    setPolyline(newPolyline);
    
    return () => {
      newPolyline.setMap(null);
    }
  }, [map]);

  useEffect(() => {
    if (!routesLibrary || !geometryLibrary || !polyline || !origin || !destination) {
      if (polyline) polyline.setPath([]);
      return;
    }

    const { Route } = routesLibrary as any;

    if (Route && Route.computeRoutes) {
      Route.computeRoutes({
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: 'DRIVING',
        routingPreference: 'TRAFFIC_AWARE',
        fields: ['durationMillis', 'distanceMeters', 'polyline']
      }).then((response: any) => {
        if (response.routes && response.routes.length > 0) {
           const route = response.routes[0];
           
           if (route.polyline && route.polyline.encodedPolyline) {
             const path = geometryLibrary.encoding.decodePath(route.polyline.encodedPolyline);
             polyline.setPath(path);
           }
           
           if (onETAUpdate) {
             const durationStr = route.durationMillis ? Math.ceil(route.durationMillis / 60000) + ' min' : '';
             const distanceStr = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(1) + ' km' : '';
             onETAUpdate(durationStr, distanceStr);
           }
        } else {
           polyline.setPath([]);
        }
      }).catch((err: any) => {
        console.error('Route.computeRoutes failed:', err);
      });
    }

  }, [routesLibrary, geometryLibrary, polyline, origin, destination, onETAUpdate]);

  return null;
};
`;
fs.writeFileSync('src/components/MapDirections.tsx', code);
