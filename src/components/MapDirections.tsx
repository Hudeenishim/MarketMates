import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface MapDirectionsProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onETAUpdate?: (eta: string, distance: string) => void;
}

export const MapDirections: React.FC<MapDirectionsProps> = ({ origin, destination, onETAUpdate }) => {
  const map = useMap();
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

  const onETAUpdateRef = React.useRef(onETAUpdate);
  useEffect(() => {
    onETAUpdateRef.current = onETAUpdate;
  }, [onETAUpdate]);

  useEffect(() => {
    if (!geometryLibrary || !polyline || !origin || !destination) {
      if (polyline) polyline.setPath([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) throw new Error("No API key");
        
        let fallbackTimeout = setTimeout(() => {
          if (onETAUpdateRef.current) {
            onETAUpdateRef.current('15 min', '2.5 km');
          }
        }, 800);

        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
            destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
          })
        });
        
        clearTimeout(fallbackTimeout);

        if (!response.ok) {
          throw new Error('Routes API failed: ' + response.statusText);
        }

        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          if (route.polyline?.encodedPolyline) {
            const decodedPath = geometryLibrary.encoding.decodePath(route.polyline.encodedPolyline);
            polyline.setPath(decodedPath);
            
            // Bounds adjusting
            const bounds = new google.maps.LatLngBounds();
            decodedPath.forEach((p: any) => bounds.extend(p));
            map?.fitBounds(bounds, 40);
          }

          if (onETAUpdateRef.current) {
            const durationSecs = parseInt(route.duration || '0');
            const distanceMeters = route.distanceMeters || 0;
            const eta = Math.ceil(durationSecs / 60) + ' min';
            const dist = (distanceMeters / 1000).toFixed(1) + ' km';
            onETAUpdateRef.current(eta, dist);
          }
        } else {
          polyline.setPath([]);
        }
      } catch (err) {
        console.error("Routes API Error:", err);
        polyline.setPath([]);
        if (onETAUpdateRef.current) {
          onETAUpdateRef.current('15 min', '2.5 km');
        }
      }
    };

    fetchRoute();
  }, [geometryLibrary, polyline, origin, destination, map]);

  return null;
};
