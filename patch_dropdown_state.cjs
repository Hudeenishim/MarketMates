const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const stateStr = `  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);`;

code = code.replace(
  "  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales'>('overview');\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);",
  stateStr
);

// Close dropdown when clicking outside. Add a global click handler in useEffect or just close it on scroll/click
const effectStr = `
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
`;
code = code.replace(
  "  useEffect(() => {",
  effectStr + "\n  useEffect(() => {"
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
