const fs = require('fs');
const path = 'src/views/DeliveryDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

// The mess started here:
const brokenStart = code.indexOf('{selectedDelivery && selectedDelivery.status !== \'delivered\' && selectedDelivery.status !== \'pending\' && (');
const brokenEnd = code.indexOf('{false && (', brokenStart);

// Let's just find the exact block and replace it.
if (brokenStart > -1 && brokenEnd > -1) {
    code = code.replace(
`{selectedDelivery && selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'pending' && (
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
          )}
          {false && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top-4 flex flex-col items-center gap-3">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold border border-slate-700">
                <Truck className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-emerald-400 text-lg">{etaInfo.eta}</span>
                  <span className="text-slate-400 text-sm ml-2 font-normal">({etaInfo.distance}) away</span>
                </div>
              </div>`,
`{selectedDelivery && selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'pending' && (
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
              </div>`
    );
    fs.writeFileSync(path, code);
    console.log("Fixed DeliveryDashboard");
} else {
    console.log("Could not find the broken block");
}
