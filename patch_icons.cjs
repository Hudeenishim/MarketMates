const fs = require('fs');

// Patch LoginView.tsx
let loginCode = fs.readFileSync('src/views/LoginView.tsx', 'utf8');
loginCode = loginCode.replace(
  "import { Store, ShoppingBag, Eye, EyeOff } from 'lucide-react';",
  "import { Store, ShoppingBag, Eye, EyeOff, Motorbike } from 'lucide-react';"
);

loginCode = loginCode.replace(
  /<svg className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600".*?<\/svg>/s,
  '<Motorbike className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />'
);
fs.writeFileSync('src/views/LoginView.tsx', loginCode);

// Patch Navbar.tsx
let navCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navCode = navCode.replace(
  "import { LogOut, User, Store, ShoppingBag, MessageCircle, Info, HelpCircle, Phone, X } from 'lucide-react';",
  "import { LogOut, User, Store, ShoppingBag, MessageCircle, Info, HelpCircle, Phone, X, Motorbike } from 'lucide-react';"
);

navCode = navCode.replace(
  /<svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">.*?<\/svg>/s,
  '<Motorbike className="w-6 h-6 mb-1" />'
);
fs.writeFileSync('src/components/Navbar.tsx', navCode);

console.log("Updated icons");
