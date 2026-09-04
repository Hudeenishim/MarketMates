const fs = require('fs');
let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { Play, X, Mic, MessageSquare, Truck, Search, Store, Package, CheckCircle, Pause } from 'lucide-react';",
  "import { Play, X, Mic, MessageSquare, Truck, Search, Store, Package, CheckCircle, Pause, Edit2, Trash2, PhoneCall } from 'lucide-react';"
);

// Add edit/delete icons to SceneVoiceListing products
const oldVoiceListingProduct1 = `<div className="font-bold text-sm text-slate-800">Organic Yams</div>
          <div className="text-slate-500 text-xs mt-auto">30 GHS</div>`;
const newVoiceListingProduct1 = `<div className="flex justify-between items-start">
            <div className="font-bold text-sm text-slate-800">Organic Yams</div>
            <div className="flex gap-1">
              <Edit2 className="w-3 h-3 text-slate-400" />
              <Trash2 className="w-3 h-3 text-slate-400" />
            </div>
          </div>
          <div className="text-slate-500 text-xs mt-auto">30 GHS</div>`;
code = code.replace(oldVoiceListingProduct1, newVoiceListingProduct1);

const oldVoiceListingProduct2 = `<div className="font-bold text-sm text-slate-900 leading-tight">Fresh Tomatoes</div>
          <div className="text-emerald-600 font-bold text-sm mt-1">50 GHS</div>`;
const newVoiceListingProduct2 = `<div className="flex justify-between items-start">
            <div className="font-bold text-sm text-slate-900 leading-tight">Fresh Tomatoes</div>
            <div className="flex gap-1">
              <Edit2 className="w-3 h-3 text-emerald-500" />
              <Trash2 className="w-3 h-3 text-emerald-500" />
            </div>
          </div>
          <div className="text-emerald-600 font-bold text-sm mt-1">50 GHS</div>`;
code = code.replace(oldVoiceListingProduct2, newVoiceListingProduct2);


// Add call button to SceneNegotiation
const oldNegotiationHeader = `<div className="bg-slate-900 text-white p-3 shadow-md flex items-center gap-3 shrink-0 z-10">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
        <MessageSquare className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-bold text-sm">AI Assistant</div>
        <div className="text-xs text-blue-300">Negotiating Tomatoes</div>
      </div>
    </div>`;
const newNegotiationHeader = `<div className="bg-slate-900 text-white p-3 shadow-md flex justify-between items-center shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm">AI Assistant</div>
          <div className="text-xs text-blue-300">Negotiating Tomatoes</div>
        </div>
      </div>
      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
        <PhoneCall className="w-4 h-4" />
      </div>
    </div>`;
code = code.replace(oldNegotiationHeader, newNegotiationHeader);

// Add call button to SceneDelivery floating status card
const oldDeliveryStatusCard = `<div className="bg-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col gap-1 border border-slate-200">
           <div className="font-bold text-slate-900">Delivery in Progress</div>
           <div className="text-slate-500 text-sm">Rider is picking up your order</div>
        </div>`;
const newDeliveryStatusCard = `<div className="bg-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col gap-2 border border-slate-200 w-full">
           <div>
             <div className="font-bold text-slate-900">Delivery in Progress</div>
             <div className="text-slate-500 text-sm">Rider is picking up your order</div>
           </div>
           <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 w-fit">
             <PhoneCall className="w-3 h-3" /> Call Rider
           </div>
        </div>`;
code = code.replace(oldDeliveryStatusCard, newDeliveryStatusCard);

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
