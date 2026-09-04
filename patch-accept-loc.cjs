const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

const replacement = `const handleAcceptDelivery = async (delivery: Delivery) => {
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
  };`;

code = code.replace(
  /const handleAcceptDelivery = async \(delivery: Delivery\) => \{[\s\S]*?setSelectedDelivery\(prev => prev \? \{ \.\.\.prev, status: 'accepted', rider_id: profile\.id \} : null\);\n\s*\};/g,
  replacement
);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard location on accept");
