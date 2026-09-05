const fs = require('fs');
let code = fs.readFileSync('src/views/RiderDashboard.tsx', 'utf8');

const oldDeliveryCardBlock = `                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-slate-900 block truncate">Delivery #{del.id.slice(0, 5)}</span>
                    <span className="text-sm text-slate-500">From: Vendor • To: Buyer</span>
                  </div>
                  <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap \${
                    del.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    del.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    del.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }\`}>
                    {del.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(del.created_at).toLocaleString()}
                </div>`;

const newDeliveryCardBlock = `                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-slate-900 block truncate">Delivery #{del.id.slice(0, 5)}</span>
                    <span className="text-sm text-slate-500">From: Vendor • To: Buyer</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap \${
                      del.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      del.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      del.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }\`}>
                      {del.status.replace('_', ' ')}
                    </span>
                    {del.payment_timing === 'on_delivery' && del.payment_status !== 'paid' ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        Collect ₵{del.amount || 0}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Pre-paid
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {new Date(del.created_at).toLocaleString()}
                </div>`;

// Replace both occurrences (available and mine)
code = code.split(oldDeliveryCardBlock).join(newDeliveryCardBlock);

// For the active delivery panel:
const oldActiveDeliveryHeader = `                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Active Delivery</h3>
                <div className="text-slate-500 font-medium">#{selectedDelivery.id}</div>`;

const newActiveDeliveryHeader = `                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Active Delivery</h3>
                <div className="text-slate-500 font-medium mb-4">#{selectedDelivery.id}</div>
                {selectedDelivery.payment_timing === 'on_delivery' && selectedDelivery.payment_status !== 'paid' ? (
                   <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-4 font-bold flex flex-col items-center">
                     <span className="text-sm uppercase tracking-wider opacity-80 mb-1">Payment Required on Delivery</span>
                     <span className="text-3xl">₵{selectedDelivery.amount || 0}</span>
                   </div>
                ) : (
                   <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl mb-4 font-bold text-center">
                     Pre-paid (No Cash Collection Needed)
                   </div>
                )}`;

code = code.replace(oldActiveDeliveryHeader, newActiveDeliveryHeader);

// In demo mode dummy, ensure we add payment_timing and amount
code = code.replace(
  /updated_at: Date.now\(\)/g,
  "updated_at: Date.now(), payment_timing: 'on_delivery', payment_status: 'pending', amount: 120"
);

fs.writeFileSync('src/views/RiderDashboard.tsx', code);
console.log('patched rider dashboard');
