const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');
code = code.replace(
  "import { Mic, MicOff, Plus, Package, Banknote, Tag, Bell, Search, Image as ImageIcon, Camera, TrendingUp, Edit2, Trash2, X } from 'lucide-react';",
  "import { Mic, MicOff, Plus, Package, Banknote, Tag, Bell, Search, Image as ImageIcon, Camera, TrendingUp, Edit2, Trash2, X, Menu, LayoutDashboard } from 'lucide-react';"
);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
