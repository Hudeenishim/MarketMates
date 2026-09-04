const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const stateInsertion = `  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
`;
code = code.replace(
  "export const VendorDashboard: React.FC = () => {\\n  const { user, demoMode } = useAuth();\\n",
  "export const VendorDashboard: React.FC = () => {\\n  const { user, demoMode } = useAuth();\\n" + stateInsertion
);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
