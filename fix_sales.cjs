const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const badBlock = `    const salesData = React.useMemo(() => {
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

  return () => {`;

code = code.replace(badBlock, "    return () => {");

const newSalesLogic = `  const actionableNegotiations = myNegotiations.filter(n => n.status === 'open' && n.last_actor !== 'vendor');

  const salesData = React.useMemo(() => {
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
    
    const salesByDate: Record<string, number> = {};
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

code = code.replace("  const actionableNegotiations = myNegotiations.filter(n => n.status === 'open' && n.last_actor !== 'vendor');\n\n  return (", newSalesLogic);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
