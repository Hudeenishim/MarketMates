const fs = require('fs');

let code = fs.readFileSync('src/views/AboutView.tsx', 'utf8');

// 1. Add Motorbike import
code = code.replace(
  "import { Store, ShoppingBag, MessageCircle, Info, Mic, LayoutDashboard, Package, TrendingUp, Handshake, Search, HelpCircle, CheckCircle2 } from 'lucide-react';",
  "import { Store, ShoppingBag, MessageCircle, Info, Mic, LayoutDashboard, Package, TrendingUp, Handshake, Search, HelpCircle, CheckCircle2, Motorbike, MapPin, Truck } from 'lucide-react';"
);

// 2. Add 'rider' to role toggle
code = code.replace(
  'I\'m a Vendor\n          </button>',
  `I\'m a Vendor
          </button>
          <button
            onClick={() => setActiveTab('rider')}
            className={\`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all \${
              activeTab === 'rider' 
                ? 'bg-[#10B981] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }\`}
          >
            <Motorbike className="w-5 h-5" />
            I'm a Rider
          </button>`
);

// 3. Add rider instructions
code = code.replace(
  '        )}',
  `        )}

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
        )}`
);

// 4. Add Rider icons to glossary
code = code.replace(
  '<IconMeaning icon={<CheckCircle2 className="w-5 h-5 text-slate-600" />} name="Accept" desc="Confirm a deal or offer" />',
  `<IconMeaning icon={<CheckCircle2 className="w-5 h-5 text-slate-600" />} name="Accept" desc="Confirm a deal or offer" />
          <IconMeaning icon={<Motorbike className="w-5 h-5 text-slate-600" />} name="Rider" desc="Rider dashboard" />
          <IconMeaning icon={<MapPin className="w-5 h-5 text-slate-600" />} name="Location" desc="Pickup / Dropoff map" />`
);

fs.writeFileSync('src/views/AboutView.tsx', code);
console.log("Patched AboutView.tsx");
