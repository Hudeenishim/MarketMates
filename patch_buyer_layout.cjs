const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

const stateStr = `  const [activeTab, setActiveTab] = useState<'map' | 'products'>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendorsInMarket, setVendorsInMarket] = useState<string[]>([]);`;

code = code.replace(
  "  const [vendorsInMarket, setVendorsInMarket] = useState<string[]>([]);",
  stateStr
);

const currentReturn = `  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 min-h-full">
      
      {/* Market Map Section */}
      <div className="flex-shrink-0 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row h-[350px] md:h-[250px] lg:h-[300px]">`;

const newReturn = `  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 min-h-[80vh] pb-4 relative">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab === 'map' ? 'Market Map' : 'Products'}</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:text-slate-900">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={\`flex-col w-full md:w-64 shrink-0 gap-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-4 transition-all duration-300 \${isSidebarOpen ? 'flex' : 'hidden md:flex'}\`}>
        <button 
          onClick={() => { setActiveTab('map'); setIsSidebarOpen(false); }}
          className={\`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors \${activeTab === 'map' ? 'bg-[#A7F3D0] text-emerald-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}\`}
        >
          <Map className="w-5 h-5" />
          Market Map
        </button>
        <button 
          onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
          className={\`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors \${activeTab === 'products' ? 'bg-[#A7F3D0] text-emerald-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}\`}
        >
          <Package className="w-5 h-5" />
          Products
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">

      {activeTab === 'map' && (<>
      {/* Market Map Section */}
      <div className="flex-shrink-0 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row h-[500px]">`;

code = code.replace(currentReturn, newReturn);

// Also wrap the product list
code = code.replace(
  "{/* Product Catalog */}",
  "</>)}\n\n      {activeTab === 'products' && (<>\n      {/* Product Catalog */}"
);

// Close the main content area wrapper at the very end
code = code.replace(
  "    </div>\n  );\n};\n",
  "      </>)}\n      </div>\n    </div>\n  );\n};\n"
);

fs.writeFileSync('src/views/BuyerView.tsx', code);
