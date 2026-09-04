const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// 1. Add recharts imports
code = code.replace(
  "import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon, Camera } from 'lucide-react';",
  "import { Mic, MicOff, Plus, Package, DollarSign, Tag, Bell, Search, Image as ImageIcon, Camera, TrendingUp } from 'lucide-react';\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
);

// 2. Add sales data generation just before return (
const salesDataLogic = `  const salesData = React.useMemo(() => {
    if (demoMode || myNegotiations.length === 0) {
      const data = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
          name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: Math.floor(Math.random() * 800) + 200
        });
      }
      return data;
    }
    
    const salesByDate = {};
    myNegotiations.filter(n => n.status === 'accepted').forEach(n => {
      const d = new Date(n.updated_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesByDate[key] = (salesByDate[key] || 0) + n.current_offer;
    });

    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data.push({
        name: key,
        sales: salesByDate[key] || 0
      });
    }
    return data;
  }, [demoMode, myNegotiations]);

  return (`;

code = code.replace("  return (", salesDataLogic);

// 3. Insert the chart widget
const chartWidget = `      {/* Sales Trend Chart */}
      <div className="flex-shrink-0 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sales Trends (Last 30 Days)</h2>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={10} 
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickFormatter={(val) => \`₵\${val}\`} 
                dx={-10} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [\`₵\${Number(value).toFixed(2)}\`, 'Sales']}
                labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Voice Record Card */}`;

code = code.replace("{/* Voice Record Card */}", chartWidget);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
