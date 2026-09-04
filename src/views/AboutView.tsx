import React, { useState } from 'react';
import { 
  Info, ShoppingBag, Store, Mic, MessageCircle, TrendingUp, Handshake, CheckCircle2,
  Package, LayoutDashboard, HelpCircle, Search
, Motorbike, MapPin, Truck } from 'lucide-react';

export const AboutView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'vendor' | 'rider'>('buyer');

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-500 min-h-full pb-8 px-2 sm:px-0">
      
      {/* Top Header - Purely centered text */}
      <div className="w-full flex flex-col items-center justify-center text-center pt-8 sm:pt-16 pb-10">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-6 shadow-sm">
          <Info className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">How to Use</h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed px-4">
          MarketMates brings the traditional market negotiation experience online. Whether you are looking to buy local goods at a fair price or sell your inventory with ease, our platform makes it simple.
        </p>
      </div>

      {/* Role Toggle - Centered */}
      <div className="w-full flex justify-center mb-12">
        <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all ${
              activeTab === 'buyer' 
                ? 'bg-[#10B981] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            I'm a Buyer
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all ${
              activeTab === 'vendor' 
                ? 'bg-[#10B981] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Store className="w-5 h-5" />
            I'm a Vendor
          </button>
          <button
            onClick={() => setActiveTab('rider')}
            className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all ${
              activeTab === 'rider' 
                ? 'bg-[#10B981] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Motorbike className="w-5 h-5" />
            I'm a Rider
          </button>
        </div>
      </div>

      {/* Instructions Grid */}
      <div className="flex flex-col gap-6 w-full">
        {activeTab === 'buyer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <GuideCard 
              icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
              bgColor="bg-blue-50"
              title="1. Browse the Market"
              description="Scroll through the Buyer Market to see products available from local vendors. You'll see their asking prices and stock levels."
            />
            <GuideCard 
              icon={<Handshake className="w-6 h-6 text-emerald-600" />}
              bgColor="bg-emerald-50"
              title="2. Make an Offer"
              description="Think the price is a bit high? Click 'Make Offer' and propose your own price. It's just like negotiating at a physical market stall."
            />
            <GuideCard 
              icon={<MessageCircle className="w-6 h-6 text-purple-600" />}
              bgColor="bg-purple-50"
              title="3. Check Your Chats"
              description="Head to the 'Chats' or 'Negotiations' tab to track your offers. The vendor might accept, reject, or send you a counter-offer!"
            />
            <GuideCard 
              icon={<CheckCircle2 className="w-6 h-6 text-amber-600" />}
              bgColor="bg-amber-50"
              title="4. Seal the Deal"
              description="Once an offer is accepted, the status turns green. You can then arrange payment and pickup directly with the vendor."
            />
          </div>
        )}

        {activeTab === 'rider' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <GuideCard 
              icon={<Search className="w-6 h-6 text-blue-600" />}
              bgColor="bg-blue-50"
              title="1. Find Deliveries"
              description="Check the Rider Dashboard for a list of pending deliveries waiting for a driver."
            />
            <GuideCard 
              icon={<Handshake className="w-6 h-6 text-emerald-600" />}
              bgColor="bg-emerald-50"
              title="2. Accept a Run"
              description="Review the pickup and drop-off locations, then accept the delivery to claim it."
            />
            <GuideCard 
              icon={<MapPin className="w-6 h-6 text-purple-600" />}
              bgColor="bg-purple-50"
              title="3. Navigate & Pick Up"
              description="Use the built-in map to navigate to the vendor's location, collect the items, and mark as 'Picked Up'."
            />
            <GuideCard 
              icon={<CheckCircle2 className="w-6 h-6 text-amber-600" />}
              bgColor="bg-amber-50"
              title="4. Deliver & Complete"
              description="Head to the buyer's destination, drop off the goods, and confirm the delivery is complete!"
            />
          </div>
        )}

        {activeTab === 'vendor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <GuideCard 
              icon={<Mic className="w-6 h-6 text-blue-600" />}
              bgColor="bg-blue-50"
              title="1. Quick Add Products"
              description="Go to your Vendor Hub. You can type in product details, or just tap the microphone and say 'Add 5 bags of rice for 50 cedis' to use AI voice addition!"
            />
            <GuideCard 
              icon={<Store className="w-6 h-6 text-amber-600" />}
              bgColor="bg-amber-50"
              title="2. Manage Inventory"
              description="Check the 'Inventory' tab to update prices, restock items, or remove things you've sold out of."
            />
            <GuideCard 
              icon={<MessageCircle className="w-6 h-6 text-emerald-600" />}
              bgColor="bg-emerald-50"
              title="3. Handle Negotiations"
              description="When buyers make offers, they appear in your 'Chats'. You can accept their price, reject it, or type a counter-offer to haggle."
            />
            <GuideCard 
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              bgColor="bg-purple-50"
              title="4. Track Your Sales"
              description="Visit the 'Sales Trend' tab in your hub. See beautiful charts of your last 30 days and read your AI-generated weekly performance analysis."
            />
          </div>
        )}
      </div>

      {/* Icon Glossary */}
      <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 mt-12 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">App Icon Guide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          <IconMeaning icon={<Store className="w-5 h-5 text-slate-600" />} name="Hub / Vendor" desc="Vendor dashboard & management" />
          <IconMeaning icon={<ShoppingBag className="w-5 h-5 text-slate-600" />} name="Market" desc="Browse products & buy" />
          <IconMeaning icon={<MessageCircle className="w-5 h-5 text-slate-600" />} name="Chats" desc="Active negotiations" />
          <IconMeaning icon={<Mic className="w-5 h-5 text-slate-600" />} name="Voice Add" desc="Use AI to add products" />
          
          <IconMeaning icon={<LayoutDashboard className="w-5 h-5 text-slate-600" />} name="Overview" desc="Main dashboard view" />
          <IconMeaning icon={<Package className="w-5 h-5 text-slate-600" />} name="Inventory" desc="Manage stock levels" />
          <IconMeaning icon={<TrendingUp className="w-5 h-5 text-slate-600" />} name="Sales Trend" desc="View performance charts" />
          <IconMeaning icon={<Handshake className="w-5 h-5 text-slate-600" />} name="Offer" desc="Make or manage an offer" />
          
          <IconMeaning icon={<Search className="w-5 h-5 text-slate-600" />} name="Search" desc="Find specific items" />
          <IconMeaning icon={<Info className="w-5 h-5 text-slate-600" />} name="About" desc="User guide & platform info" />
          <IconMeaning icon={<HelpCircle className="w-5 h-5 text-slate-600" />} name="Support" desc="Customer service" />
          <IconMeaning icon={<CheckCircle2 className="w-5 h-5 text-slate-600" />} name="Accept" desc="Confirm a deal or offer" />
          <IconMeaning icon={<Motorbike className="w-5 h-5 text-slate-600" />} name="Rider" desc="Rider dashboard" />
          <IconMeaning icon={<MapPin className="w-5 h-5 text-slate-600" />} name="Location" desc="Pickup / Dropoff map" />
        </div>
      </div>
    </div>
  );
};

const GuideCard = ({ icon, bgColor, title, description }: { icon: React.ReactNode, bgColor: string, title: string, description: string }) => (
  <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const IconMeaning = ({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) => (
  <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full">
    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-1 shrink-0">
      {icon}
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <h4 className="font-bold text-sm text-slate-900 leading-none">{name}</h4>
      <p className="text-xs text-slate-500 leading-tight">{desc}</p>
    </div>
  </div>
);
