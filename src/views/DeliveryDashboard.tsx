import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Package, CheckCircle, Navigation, Search, Store, PhoneCall, Truck } from 'lucide-react';
import { Delivery, Negotiation } from '../types';
import { getDoc } from 'firebase/firestore';

interface RichDelivery extends Delivery {
  otherPartyPhone?: string;
  otherPartyName?: string;
  riderPhone?: string;
  riderName?: string;
}
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

export const DeliveryDashboard: React.FC = () => {
  const { user, profile, demoMode } = useAuth();
  const [searchParams] = useSearchParams();
  const negId = searchParams.get('neg_id');
  
  const [deliveries, setDeliveries] = useState<RichDelivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<RichDelivery | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  const [activeNegotiation, setActiveNegotiation] = useState<Negotiation | null>(null);
  const [etaInfo, setEtaInfo] = useState<{eta: string, distance: string} | null>(null);

  // Accra coordinates as default
  const defaultCenter = { lat: 5.6037, lng: -0.1870 };

  useEffect(() => {
    if (demoMode && !user) {
      const dummyDeliveries: Delivery[] = [
        {
          id: 'demo_delivery_1',
          negotiation_id: 'demo_neg_1',
          vendor_id: 'v1',
          buyer_id: 'demo_buyer',
          status: 'accepted',
          pickup_location: { lat: 5.6037, lng: -0.1870 },
          delivery_location: { lat: 5.6537, lng: -0.1570 },
          current_rider_location: { lat: 5.6200, lng: -0.1700 },
          rider_id: 'r1',
          created_at: Date.now() - 3600000,
          updated_at: Date.now()
        },
        {
          id: 'demo_delivery_2',
          negotiation_id: 'demo_neg_2',
          vendor_id: 'v1',
          buyer_id: 'demo_buyer',
          status: 'pending',
          pickup_location: { lat: 5.5837, lng: -0.1970 },
          delivery_location: { lat: 5.6137, lng: -0.1670 },
          created_at: Date.now() - 7200000,
          updated_at: Date.now()
        }
      ];
      const enrichedDummy = dummyDeliveries.map(d => ({ ...d, otherPartyName: 'Demo User', otherPartyPhone: '+233550000000', riderName: 'Demo Rider', riderPhone: '+233550000001' }));
      setDeliveries(enrichedDummy);
      if (negId) {
        const found = enrichedDummy.find(d => d.negotiation_id === negId);
        if (found) setSelectedDelivery(found);
      }
      return;
    }

    if (!profile) return;
    let field = 'buyer_id';
    if (profile.role === 'vendor') field = 'vendor_id';
    if (profile.role === 'rider') field = 'rider_id';
    const q = query(
      collection(db, 'deliveries'),
      where(field, '==', profile.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const promises = snap.docs.map(async (d) => {
        const del = { ...d.data(), id: d.id } as RichDelivery;
        // Fetch counterparty (Vendor/Buyer)
        const counterId = profile.role === 'vendor' ? del.buyer_id : (profile.role === 'buyer' ? del.vendor_id : null);
        if (counterId) {
          const cDoc = await getDoc(doc(db, 'profiles', counterId));
          if (cDoc.exists()) {
            del.otherPartyName = cDoc.data()?.full_name;
            del.otherPartyPhone = cDoc.data()?.phone_number;
          }
        } else if (profile.role === 'rider') {
           // Rider sees both vendor and buyer
           const vDoc = await getDoc(doc(db, 'profiles', del.vendor_id));
           const bDoc = await getDoc(doc(db, 'profiles', del.buyer_id));
           if (vDoc.exists()) del.otherPartyName = 'Vendor: ' + vDoc.data()?.full_name;
           if (bDoc.exists()) del.riderName = 'Buyer: ' + bDoc.data()?.full_name; // Using riderName as second party for rider
           del.otherPartyPhone = vDoc.data()?.phone_number;
           del.riderPhone = bDoc.data()?.phone_number;
        }
        
        // Fetch rider if exists and not rider
        if (profile.role !== 'rider' && del.rider_id) {
          const rDoc = await getDoc(doc(db, 'profiles', del.rider_id));
          if (rDoc.exists()) {
            del.riderName = rDoc.data()?.full_name;
            del.riderPhone = rDoc.data()?.phone_number;
          }
        }
        return del;
      });
      Promise.all(promises).then(res => {
        setDeliveries(res);
        if (negId) {
          const found = res.find(d => d.negotiation_id === negId);
          if (found) setSelectedDelivery(found);
        }
        
        setSelectedDelivery(prev => {
          if (!prev) return null;
          const updated = res.find(d => d.id === prev.id);
          return updated || prev;
        });
      });
    });
    return unsub;
  }, [profile, negId, demoMode]);

  // If a negId is passed and no delivery exists yet, we should fetch the neg details to allow creation
    useEffect(() => {
    if (!negId) return;
    const existing = deliveries.find(d => d.negotiation_id === negId);
    if (!existing) {
      if (demoMode && !user) {
        setActiveNegotiation({
          id: negId,
          product_id: 'p1',
          vendor_id: 'v1',
          buyer_id: 'demo_buyer',
          original_price_ghs: 100,
          proposed_price_ghs: 80,
          status: 'accepted',
          created_at: Date.now(),
          updated_at: Date.now(),
          last_actor: 'vendor'
        } as Negotiation);
        return;
      }
      if (!profile) return;
      const unsub = onSnapshot(doc(db, 'negotiations', negId), (docSnap) => {
        if (docSnap.exists()) {
          setActiveNegotiation({ ...docSnap.data(), id: docSnap.id } as Negotiation);
        }
      });
      return unsub;
    }
  }, [negId, deliveries, profile, demoMode]);

  const handleMapClick = (e: any) => {
    if (!e.detail.latLng) return;
    const lat = typeof e.detail.latLng.lat === 'function' ? e.detail.latLng.lat() : e.detail.latLng.lat;
    const lng = typeof e.detail.latLng.lng === 'function' ? e.detail.latLng.lng() : e.detail.latLng.lng;
    setMarkerPosition({ lat, lng });
  };

  const handleSaveLocation = async () => {
    if (!markerPosition || (!profile && !demoMode)) return;
    if (!selectedDelivery && !activeNegotiation) {
      alert('Please select a delivery from the list first to update its location.');
      return;
    }
    
    if (demoMode && !user) {
      alert('Location saved successfully! (Demo Mode: changes are not persisted)');
      return;
    }

    try {
      if (selectedDelivery) {
        // Update existing
        const updateData = profile.role === 'buyer' 
          ? { delivery_location: { lat: markerPosition.lat, lng: markerPosition.lng } }
          : { pickup_location: { lat: markerPosition.lat, lng: markerPosition.lng } };
        await updateDoc(doc(db, 'deliveries', selectedDelivery.id), updateData);
        setMarkerPosition(null);
        alert('Location updated successfully!');
      } else if (activeNegotiation) {
        // Create new
        const deliveryId = activeNegotiation.id; // use neg id for simplicity
        const newDelivery: any = {
          negotiation_id: activeNegotiation.id,
          vendor_id: activeNegotiation.vendor_id,
          buyer_id: activeNegotiation.buyer_id,
          status: 'pending',
          created_at: Date.now(),
          updated_at: Date.now()
        };
        if (profile.role === 'buyer') {
          newDelivery.delivery_location = { lat: markerPosition.lat, lng: markerPosition.lng };
        } else {
          newDelivery.pickup_location = { lat: markerPosition.lat, lng: markerPosition.lng };
        }
        await setDoc(doc(db, 'deliveries', deliveryId), newDelivery);
        setActiveNegotiation(null);
        alert('Delivery initiated and location set!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving location');
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 gap-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Delivery Management</h2>
        <p className="text-slate-500">Track and manage your deliveries.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[700px]">
        {/* List side */}
        <div className="w-full lg:w-1/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-y-auto p-4 flex-none">
          <h3 className="font-bold text-lg mb-4 px-2">Your Deliveries</h3>
          {activeNegotiation && !deliveries.find(d => d.negotiation_id === negId) && (
            <div className="p-4 bg-emerald-50 rounded-xl mb-4 cursor-pointer border-2 border-emerald-500">
              <div className="font-bold text-emerald-900">New Delivery Setup</div>
              <div className="text-sm text-emerald-700">Set your location on the map to start</div>
            </div>
          )}
          {deliveries.map(d => (
            <div 
              key={d.id} 
              onClick={() => { setSelectedDelivery(d); setEtaInfo(null); }}
              className={`p-4 rounded-xl mb-2 cursor-pointer transition-colors ${selectedDelivery?.id === d.id ? 'bg-slate-100 border-2 border-slate-900' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}`}
            >
              <div className="font-bold text-slate-900">Delivery #{d.id.slice(0,6)}</div>
              <div className="text-sm text-slate-500 capitalize mb-2">Status: {d.status}</div>
              {d.otherPartyPhone && (
                <a href={"tel:" + d.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-1 w-fit hover:bg-emerald-100">
                  <PhoneCall className="w-3 h-3" /> Call {profile?.role === 'rider' ? 'Vendor' : (profile?.role === 'vendor' ? 'Buyer' : 'Vendor')}
                </a>
              )}
              <br/>
              {d.riderPhone && (
                <a href={"tel:" + d.riderPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit hover:bg-blue-100 mt-1">
                  <PhoneCall className="w-3 h-3" /> Call {profile?.role === 'rider' ? 'Buyer' : 'Rider'}
                </a>
              )}
            </div>
          ))}
          {deliveries.length === 0 && !activeNegotiation && (
            <div className="text-center text-slate-400 py-8">No active deliveries</div>
          )}
        </div>

        {/* Map side */}
        <div className="w-full lg:w-2/3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative flex-1 min-h-[400px]">
          
          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY.startsWith('AIza') ? (
            <>

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <MapControls onLocationSelect={(lat, lng) => setMarkerPosition({lat, lng})} />
              <Map
                          mapId="DEMO_MAP_ID"
                          defaultCenter={defaultCenter}
                          defaultZoom={12}
                          gestureHandling="greedy"
                          disableDefaultUI={true}
                          onClick={handleMapClick}
                          className="w-full h-full"
                        >
                          {markerPosition && (
                            <AdvancedMarker position={markerPosition}>
                              <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg">
                                <MapPin className="w-6 h-6" />
                              </div>
                            </AdvancedMarker>
                          )}
                          
                          
                          {selectedDelivery?.current_rider_location && selectedDelivery.status !== 'delivered' && (
                            <AdvancedMarker position={selectedDelivery.current_rider_location}>
                              <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg border-2 border-white relative z-10">
                                <Truck className="w-5 h-5" />
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
              
                          {selectedDelivery?.current_rider_location && (
                            <AdvancedMarker position={selectedDelivery.current_rider_location}>
                              <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                                <Navigation className="w-6 h-6" />
                              </div>
                            </AdvancedMarker>
                          )}
                        
                          {selectedDelivery && (
                            <MapDirections
                              origin={
                                selectedDelivery.status === 'pending' ? selectedDelivery.pickup_location :
                                selectedDelivery.status === 'accepted' ? (selectedDelivery.current_rider_location || selectedDelivery.pickup_location) :
                                selectedDelivery.status === 'picked_up' ? (selectedDelivery.current_rider_location || selectedDelivery.pickup_location) : null
                              }
                              destination={
                                selectedDelivery.status === 'pending' ? selectedDelivery.delivery_location :
                                selectedDelivery.status === 'accepted' ? selectedDelivery.pickup_location :
                                selectedDelivery.status === 'picked_up' ? selectedDelivery.delivery_location : null
                              }
                              onETAUpdate={(eta, distance) => setEtaInfo({ eta, distance })}
                            />
                          )}
                          </Map>

            </APIProvider>
              
              {/* Overlay controls */}
          {selectedDelivery && selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'pending' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 flex flex-col items-center gap-3">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-slate-700">
                <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  {etaInfo ? (
                    <>
                      <span className="text-emerald-400 text-lg">{etaInfo.eta}</span>
                      <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) away</span>
                    </>
                  ) : (
                    <span className="text-slate-300">Calculating Route...</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {selectedDelivery.otherPartyPhone && (
                  <a href={"tel:" + selectedDelivery.otherPartyPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-xl hover:bg-emerald-600 transition-colors font-bold text-sm">
                    <PhoneCall className="w-4 h-4" /> 
                    Call {profile?.role === 'rider' ? 'Vendor' : (profile?.role === 'vendor' ? 'Buyer' : 'Vendor')}
                  </a>
                )}
                {selectedDelivery.riderPhone && (
                  <a href={"tel:" + selectedDelivery.riderPhone} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-xl hover:bg-blue-600 transition-colors font-bold text-sm">
                    <PhoneCall className="w-4 h-4" /> 
                    Call {profile?.role === 'rider' ? 'Buyer' : 'Rider'}
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 border border-slate-200">
            <div className="text-sm font-bold text-slate-700 text-center">
              Click map to set your {profile?.role === 'buyer' ? 'delivery' : 'pickup'} location
            </div>
            <button 
              onClick={handleSaveLocation}
              disabled={!markerPosition || (!selectedDelivery && !activeNegotiation)}
              className="px-6 py-2 bg-[#10B981] text-white rounded-xl font-bold disabled:opacity-50 transition-all hover:bg-emerald-500"
            >
              {(!selectedDelivery && !activeNegotiation) ? 'Select a delivery first' : 'Save My Location'}
            </button>
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
