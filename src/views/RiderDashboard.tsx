import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Navigation, Search, Store, Package, CheckCircle, Truck } from 'lucide-react';
import { Delivery } from '../types';
import { MapDirections } from '../components/MapDirections';


const MapControls: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const [query, setQuery] = useState('');

  const performSearch = async () => {
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
          const lat = Number(typeof loc.lat === 'function' ? loc.lat() : loc.lat);
          const lng = Number(typeof loc.lng === 'function' ? loc.lng() : loc.lng);
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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200 w-[90%] max-w-md z-10">
      <input 
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
        onClick={handleCurrentLocation}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        title="Use Current Location"
      >
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
};

export const RiderDashboard: React.FC = () => {
  const { user, profile, demoMode } = useAuth();
  
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>({ lat: 5.6037, lng: -0.1870 }); // Default Accra
  const [etaInfo, setEtaInfo] = useState<{eta: string, distance: string} | null>(null);

  const defaultCenter = { lat: 5.6037, lng: -0.1870 }; // Accra

  useEffect(() => {
    if (demoMode && !user) {
      const dummyPending = [
        {
          id: 'demo_del_1',
          negotiation_id: 'n1',
          vendor_id: 'v1',
          buyer_id: 'b1',
          status: 'pending',
          pickup_location: { lat: 5.5837, lng: -0.1970 },
          delivery_location: { lat: 5.6137, lng: -0.1670 },
          created_at: Date.now(),
          updated_at: Date.now(), payment_timing: 'on_delivery', payment_status: 'pending', amount: 120
        }
      ];
      setAvailableDeliveries(dummyPending);
      setMyDeliveries([]);
      return;
    }

    if (!profile) return;
       
    // Available deliveries (pending, no rider yet)
    const qAvailable = query(
      collection(db, 'deliveries'),
      where('status', '==', 'pending')
    );
    const unsubAv = onSnapshot(qAvailable, (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Delivery));
      // filter out ones missing locations
      const filtered = data.filter(d => d.pickup_location && d.delivery_location);
      setAvailableDeliveries(filtered);
      setSelectedDelivery(prev => {
        if (!prev) return null;
        const updated = filtered.find(d => d.id === prev.id);
        // We don't overwrite with prev if it's not found in available, 
        // because it might have moved to myDeliveries, which handles its own update.
        return prev;
      });
    });

    // My active deliveries
    const qMine = query(
      collection(db, 'deliveries'),
      where('rider_id', '==', profile.id)
    );
    const unsubMine = onSnapshot(qMine, (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Delivery));
      setMyDeliveries(data);
      setSelectedDelivery(prev => {
        if (!prev) return null;
        const updated = data.find(d => d.id === prev.id);
        return updated || prev;
      });
    });

    return () => {
      unsubAv();
      unsubMine();
    };
  }, [profile]);

    const handleMapClick = async (e: any) => {
    if (!e.detail.latLng) return;
    const lat = typeof e.detail.latLng.lat === 'function' ? e.detail.latLng.lat() : e.detail.latLng.lat;
    const lng = typeof e.detail.latLng.lng === 'function' ? e.detail.latLng.lng() : e.detail.latLng.lng;
    const loc = { lat, lng };
    setMyLocation(loc);

    if (demoMode && !user) return; // Skip DB update in demo mode

    // If I have an active delivery selected, update my location there for realtime tracking
    if (selectedDelivery && selectedDelivery.rider_id === profile?.id) {
      await updateDoc(doc(db, 'deliveries', selectedDelivery.id), {
        current_rider_location: { lat: loc.lat, lng: loc.lng }
      });
    }
  };

    const handleAcceptDelivery = async (delivery: Delivery) => {
    let riderLoc = myLocation;
    if (!riderLoc) {
        riderLoc = { lat: 5.6037, lng: -0.1870 }; // default Accra
        setMyLocation(riderLoc);
    }
    
    if (demoMode && !user) {
      alert('Delivery accepted! (Demo Mode)');
      setSelectedDelivery(prev => prev ? { ...prev, status: 'accepted', rider_id: profile?.id || 'demo_rider', current_rider_location: riderLoc } : null);
      return;
    }
    if (!profile) return;
    
    const updateData: any = {
      status: 'accepted',
      rider_id: profile.id
    };
    if (riderLoc) {
      updateData.current_rider_location = riderLoc;
    }
    await updateDoc(doc(db, 'deliveries', delivery.id), updateData);
    setSelectedDelivery(prev => prev ? { ...prev, status: 'accepted', rider_id: profile.id, current_rider_location: riderLoc } : null);
  };

    const handleUpdateStatus = async (status: 'picked_up' | 'delivered') => {
    if (demoMode && !user) {
      alert('Status updated to ' + status + '! (Demo Mode)');
      setSelectedDelivery(prev => prev ? { ...prev, status } : null);
      return;
    }
    if (!selectedDelivery || !profile) return;
    await updateDoc(doc(db, 'deliveries', selectedDelivery.id), {
      status
    });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 gap-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <Truck className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Rider Dashboard</h2>
          <p className="text-slate-500 text-sm">Accept jobs and broadcast your live location</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[700px]">
        {/* List side */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 flex-none">
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-y-auto p-4 flex flex-col">
            <h3 className="font-bold text-lg mb-4 px-2">My Active Deliveries</h3>
            {myDeliveries.map(d => (
              <div 
                key={d.id} 
                onClick={() => { setSelectedDelivery(d); setEtaInfo(null); }}
                className={`p-4 rounded-xl mb-2 cursor-pointer transition-colors ${selectedDelivery?.id === d.id ? 'bg-amber-50 border-2 border-amber-500' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}`}
              >
                <div className="font-bold text-slate-900">Delivery #{d.id.slice(0,6)}</div>
                <div className="text-sm font-bold text-amber-600 uppercase mt-1">{d.status}</div>
              </div>
            ))}
            {myDeliveries.length === 0 && (
              <div className="text-center text-slate-400 py-4 text-sm">No active deliveries</div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-y-auto p-4 flex flex-col">
            <h3 className="font-bold text-lg mb-4 px-2">Available Jobs</h3>
            {availableDeliveries.map(d => (
              <div 
                key={d.id} 
                onClick={() => { setSelectedDelivery(d); setEtaInfo(null); }}
                className={`p-4 rounded-xl mb-2 cursor-pointer transition-colors ${selectedDelivery?.id === d.id ? 'bg-slate-100 border-2 border-slate-900' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}`}
              >
                <div className="font-bold text-slate-900">Job #{d.id.slice(0,6)}</div>
                <div className="text-sm text-slate-500 mt-1">Status: {d.status}</div>
              </div>
            ))}
            {availableDeliveries.length === 0 && (
              <div className="text-center text-slate-400 py-4 text-sm">No pending jobs</div>
            )}
          </div>
        </div>

        {/* Map side */}
        <div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative flex-1 min-h-[400px]">
          
          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith('AIza') ? (
            <>

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <MapControls onLocationSelect={(lat, lng) => handleMapClick({ detail: { latLng: { lat, lng } } })} />
              <Map
                          mapId="DEMO_MAP_ID"
                          defaultCenter={defaultCenter}
                          defaultZoom={12}
                          gestureHandling="greedy"
                          disableDefaultUI={true}
                          onClick={handleMapClick}
                          className="w-full h-full"
                        >
                          {myLocation && (
                            <AdvancedMarker position={myLocation}>
                              <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg">
                                <Navigation className="w-6 h-6" />
                              </div>
                            </AdvancedMarker>
                          )}
                          
                          {selectedDelivery?.pickup_location && (
                            <AdvancedMarker position={selectedDelivery.pickup_location}>
                              <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                <Store className="w-5 h-5" />
                              </div>
                            </AdvancedMarker>
                          )}
              
                          {selectedDelivery?.delivery_location && (
                            <AdvancedMarker position={selectedDelivery.delivery_location}>
                              <div className="bg-emerald-600 text-white p-2 rounded-full shadow-lg">
                                <Package className="w-5 h-5" />
                              </div>
                            </AdvancedMarker>
                          )}
                        
                          {selectedDelivery && (
                            <MapDirections
                              origin={myLocation}
                              destination={selectedDelivery.status === 'accepted' ? selectedDelivery.pickup_location : selectedDelivery.delivery_location}
                              onETAUpdate={(eta, distance) => setEtaInfo({ eta, distance })}
                            />
                          )}
                          </Map>

            </APIProvider>
              
              {/* Overlay controls */}
          {selectedDelivery && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-4 font-bold border border-slate-700">
              <Truck className="w-5 h-5 text-emerald-400" />
              <div>
                {etaInfo ? (
                   <>
                     <span className="text-emerald-400">{etaInfo.eta}</span>
                     <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) to {selectedDelivery.status === 'accepted' ? 'Pickup' : 'Dropoff'}</span>
                   </>
                ) : (
                   <span className="text-slate-300">Calculating Route...</span>
                )}
              </div>
            </div>
          )}
          {false && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-10 animate-in slide-in-from-top-4 font-bold border border-slate-700">
              <Truck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-emerald-400">{etaInfo.eta}</span>
                <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) to {selectedDelivery.status === 'accepted' ? 'Pickup' : 'Dropoff'}</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-slate-200 min-w-[250px]">
            <div className="text-sm font-bold text-slate-700 text-center">
              Click map to set / update your live location
            </div>
            
            {selectedDelivery && selectedDelivery.rider_id !== profile?.id && (
               <button 
                onClick={() => handleAcceptDelivery(selectedDelivery)}
                className="w-full px-6 py-2 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-slate-800"
              >
                Accept Job
              </button>
            )}

            {selectedDelivery && selectedDelivery.rider_id === profile?.id && (
               <div className="w-full flex gap-2">
                 <button 
                  onClick={() => handleUpdateStatus('picked_up')}
                  disabled={selectedDelivery.status === 'picked_up' || selectedDelivery.status === 'delivered'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 transition-all hover:bg-blue-700 text-xs"
                >
                  Picked Up
                </button>
                <button 
                  onClick={() => handleUpdateStatus('delivered')}
                  disabled={selectedDelivery.status === 'delivered'}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 transition-all hover:bg-emerald-700 text-xs"
                >
                  Delivered
                </button>
               </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-6 text-center">
          <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="font-bold text-lg text-slate-700 mb-2">Map Preview Disabled</h3>
          <p className="text-sm max-w-sm">To enable the map, add a valid Google Maps API Key (starts with 'AIza') to VITE_GOOGLE_MAPS_API_KEY in your AI Studio settings.</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
