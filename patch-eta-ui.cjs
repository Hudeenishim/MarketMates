const fs = require('fs');
const path = 'src/views/RiderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /\{selectedDelivery && etaInfo && \(/g,
  `{selectedDelivery && (
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
          {false && (`
);

fs.writeFileSync(path, code);
console.log("Patched RiderDashboard ETA UI");
