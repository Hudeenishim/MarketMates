const fs = require('fs');

function patchDelivery() {
  let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');
  
  // 1. Add demoMode to useAuth
  code = code.replace(
    "const { user, profile } = useAuth();",
    "const { user, profile, demoMode } = useAuth();"
  );

  // 2. Mock deliveries in useEffect
  const originalUseEffect = `  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, 'deliveries'),
      where(profile.role === 'vendor' ? 'vendor_id' : 'buyer_id', '==', profile.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Delivery));
      setDeliveries(data);
      if (negId) {
        const found = data.find(d => d.negotiation_id === negId);
        if (found) setSelectedDelivery(found);
      }
    });
    return unsub;
  }, [profile, negId]);`;

  const newUseEffect = `  useEffect(() => {
    if (demoMode) {
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
      setDeliveries(dummyDeliveries);
      if (negId) {
        const found = dummyDeliveries.find(d => d.negotiation_id === negId);
        if (found) setSelectedDelivery(found);
      }
      return;
    }

    if (!profile) return;
    const q = query(
      collection(db, 'deliveries'),
      where(profile.role === 'vendor' ? 'vendor_id' : 'buyer_id', '==', profile.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Delivery));
      setDeliveries(data);
      if (negId) {
        const found = data.find(d => d.negotiation_id === negId);
        if (found) setSelectedDelivery(found);
      }
    });
    return unsub;
  }, [profile, negId, demoMode]);`;

  code = code.replace(originalUseEffect, newUseEffect);

  // 3. Prevent DB updates in handleSaveLocation
  const handleSaveRegex = /const handleSaveLocation \= async \(\) \=\> \{\n    if \(\!markerPosition \|\| \!profile\) return;\n    if \(\!selectedDelivery \&\& \!activeNegotiation\) \{\n      alert\('Please select a delivery from the list first to update its location\.'\);\n      return;\n    \}\n    \n    try \{/m;
  const newHandleSave = `const handleSaveLocation = async () => {
    if (!markerPosition || (!profile && !demoMode)) return;
    if (!selectedDelivery && !activeNegotiation) {
      alert('Please select a delivery from the list first to update its location.');
      return;
    }
    
    if (demoMode) {
      alert('Location saved successfully! (Demo Mode: changes are not persisted)');
      return;
    }

    try {`;
  code = code.replace(handleSaveRegex, newHandleSave);

  // 4. Mock negotiations
  const negUseEffectRegex = /useEffect\(\(\) \=\> \{\n    if \(\!negId \|\| \!profile\) return;\n    const existing \= deliveries\.find\(d \=\> d\.negotiation_id \=\=\= negId\);\n    if \(\!existing\) \{\n      const unsub \= onSnapshot\(doc\(db, 'negotiations', negId\), \(docSnap\) \=\> \{\n        if \(docSnap\.exists\(\)\) \{\n          setActiveNegotiation\(\{ \.\.\.docSnap\.data\(\), id: docSnap\.id \} as Negotiation\);\n        \}\n      \}\);\n      return unsub;\n    \}\n  \}, \[negId, deliveries, profile\]\);/m;
  const newNegUseEffect = `  useEffect(() => {
    if (!negId) return;
    const existing = deliveries.find(d => d.negotiation_id === negId);
    if (!existing) {
      if (demoMode) {
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
  }, [negId, deliveries, profile, demoMode]);`;
  
  code = code.replace(negUseEffectRegex, newNegUseEffect);

  fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
}

function patchRider() {
  let code = fs.readFileSync('src/views/RiderDashboard.tsx', 'utf8');
  
  code = code.replace(
    "const { user, profile } = useAuth();",
    "const { user, profile, demoMode } = useAuth();"
  );

  const riderUseEffectRegex = /useEffect\(\(\) \=\> \{\n    if \(\!profile\) return;\n        \n    \/\/ Available deliveries \(pending, no rider yet\)\n    const qAvailable \= query\([\s\S]*?\n  \}, \[profile\]\);/m;
  
  const newRiderUseEffect = `  useEffect(() => {
    if (demoMode) {
      const available: Delivery[] = [
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
      const mine: Delivery[] = [
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
        }
      ];
      setAvailableDeliveries(available);
      setMyDeliveries(mine);
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
      setAvailableDeliveries(data.filter(d => d.pickup_location && d.delivery_location));
    });

    // My active deliveries
    const qMine = query(
      collection(db, 'deliveries'),
      where('rider_id', '==', profile.id)
    );
    const unsubMine = onSnapshot(qMine, (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Delivery));
      setMyDeliveries(data);
    });

    return () => {
      unsubAv();
      unsubMine();
    };
  }, [profile, demoMode]);`;
  
  code = code.replace(riderUseEffectRegex, newRiderUseEffect);

  const handleMapClickRegex = /const handleMapClick \= async \(e: any\) \=\> \{\n    if \(\!e\.detail\.latLng\) return;\n    const loc \= e\.detail\.latLng;\n    setMyLocation\(loc\);\n\n    \/\/ If I have an active delivery selected, update my location there for realtime tracking\n    if \(selectedDelivery \&\& selectedDelivery\.rider_id \=\=\= profile\?\.id\) \{\n      await updateDoc\(doc\(db, 'deliveries', selectedDelivery\.id\), \{\n        current_rider_location: \{ lat: loc\.lat, lng: loc\.lng \}\n      \}\);\n    \}\n  \};/m;
  const newHandleMapClick = `  const handleMapClick = async (e: any) => {
    if (!e.detail.latLng) return;
    const loc = e.detail.latLng;
    setMyLocation(loc);

    if (demoMode) return; // Skip DB update in demo mode

    // If I have an active delivery selected, update my location there for realtime tracking
    if (selectedDelivery && selectedDelivery.rider_id === profile?.id) {
      await updateDoc(doc(db, 'deliveries', selectedDelivery.id), {
        current_rider_location: { lat: loc.lat, lng: loc.lng }
      });
    }
  };`;
  code = code.replace(handleMapClickRegex, newHandleMapClick);

  const handleAcceptRegex = /const handleAcceptDelivery \= async \(delivery: Delivery\) \=\> \{\n    if \(\!profile\) return;\n    await updateDoc\(doc\(db, 'deliveries', delivery\.id\), \{\n      status: 'accepted',\n      rider_id: profile\.id\n    \}\);\n    setSelectedDelivery\(null\); \/\/ Deselect from available list\n  \};/m;
  const newHandleAccept = `  const handleAcceptDelivery = async (delivery: Delivery) => {
    if (demoMode) {
      alert('Delivery accepted! (Demo Mode)');
      setSelectedDelivery(null);
      return;
    }
    if (!profile) return;
    await updateDoc(doc(db, 'deliveries', delivery.id), {
      status: 'accepted',
      rider_id: profile.id
    });
    setSelectedDelivery(null); // Deselect from available list
  };`;
  code = code.replace(handleAcceptRegex, newHandleAccept);

  const handleUpdateRegex = /const handleUpdateStatus \= async \(status: 'picked_up' \| 'delivered'\) \=\> \{\n    if \(\!selectedDelivery \|\| \!profile\) return;\n    await updateDoc\(doc\(db, 'deliveries', selectedDelivery\.id\), \{\n      status\n    \}\);\n  \};/m;
  const newHandleUpdate = `  const handleUpdateStatus = async (status: 'picked_up' | 'delivered') => {
    if (demoMode) {
      alert('Status updated to ' + status + '! (Demo Mode)');
      return;
    }
    if (!selectedDelivery || !profile) return;
    await updateDoc(doc(db, 'deliveries', selectedDelivery.id), {
      status
    });
  };`;
  code = code.replace(handleUpdateRegex, newHandleUpdate);

  fs.writeFileSync('src/views/RiderDashboard.tsx', code);
}

patchDelivery();
patchRider();

