const fs = require('fs');
let code = fs.readFileSync('src/views/DeliveryDashboard.tsx', 'utf8');

const oldOverlay = `          {selectedDelivery && etaInfo && selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'pending' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-10 animate-in slide-in-from-top-4 font-bold border border-slate-700">
              <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-emerald-400 text-lg">{etaInfo.eta}</span>
                <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) away</span>
              </div>
            </div>
          )}`;

const newOverlay = `          {selectedDelivery && etaInfo && selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'pending' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top-4 flex flex-col items-center gap-3">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-slate-700">
                <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-emerald-400 text-lg">{etaInfo.eta}</span>
                  <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) away</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {selectedDelivery.otherPartyPhone && (
                  <a href={"tel:" + selectedDelivery.otherPartyPhone} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-xl hover:bg-emerald-600 transition-colors font-bold text-sm">
                    <PhoneCall className="w-4 h-4" /> 
                    Call {profile?.role === 'rider' ? 'Vendor' : (profile?.role === 'vendor' ? 'Buyer' : 'Vendor')}
                  </a>
                )}
                {selectedDelivery.riderPhone && (
                  <a href={"tel:" + selectedDelivery.riderPhone} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-xl hover:bg-blue-600 transition-colors font-bold text-sm">
                    <PhoneCall className="w-4 h-4" /> 
                    Call {profile?.role === 'rider' ? 'Buyer' : 'Rider'}
                  </a>
                )}
              </div>
            </div>
          )}`;

if (code.includes('top-24 left-1/2')) {
    code = code.replace(oldOverlay, newOverlay);
    fs.writeFileSync('src/views/DeliveryDashboard.tsx', code);
    console.log("Successfully patched DeliveryDashboard.tsx");
} else {
    console.log("Could not find the target string to replace in DeliveryDashboard.tsx");
}
