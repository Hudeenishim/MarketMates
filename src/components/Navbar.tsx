import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Store, ShoppingBag, MessageCircle, Info, HelpCircle, Phone, X, Motorbike } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, profile, demoMode, setDemoMode, setDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone_number || '');
  
  const handleUpdatePhone = async () => {
    if (!profile) return;
    try {
      await updateDoc(doc(db, 'profiles', profile.id), { phone_number: phoneNumber });
      setShowProfileModal(false);
      alert('Phone number updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to update phone number');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItemClass = (path: string) => 
    `px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
      location.pathname.startsWith(path) 
        ? 'bg-white shadow-sm text-slate-900' 
        : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to={profile?.role === 'vendor' ? '/vendor' : profile?.role === 'buyer' ? '/buyer' : '/rider'} className="flex items-center gap-3 group">
            <Logo size="md" variant="primary" className="transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              Market Mates
            </span>
          </Link>
        </div>

        {(user || demoMode) && profile && (
          <nav className="hidden md:flex bg-slate-100 p-1 rounded-2xl">
            {profile.role === 'vendor' ? (
              <Link to="/vendor" className={navItemClass('/vendor')}>
                Vendor Hub
              </Link>
            ) : profile.role === 'buyer' ? (
              <Link to="/buyer" className={navItemClass('/buyer')}>
                Buyer Market
              </Link>
            ) : (
              <Link to="/rider" className={navItemClass('/rider')}>
                Rider Dashboard
              </Link>
            )}
            
            {profile.role !== 'rider' && (
              <Link to="/negotiations" className={navItemClass('/negotiations')}>
                Negotiations
              </Link>
            )}
            <Link to="/deliveries" className={navItemClass('/deliveries')}>
              Deliveries
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDemoMode(!demoMode)}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full hover:bg-amber-100 transition-colors"
          >
            {demoMode ? (
              <>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider hidden sm:inline">Demo Mode</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Demo Mode</span>
              </>
            )}
          </button>
          {demoMode && setDemoRole && (
            <select
              value={profile?.role || 'buyer'}
              onChange={(e) => setDemoRole(e.target.value as any)}
              className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs font-bold text-amber-800 outline-none"
            >
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
              <option value="rider">Rider</option>
            </select>
          )}
          
          {(user || demoMode) && profile && (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-slate-200">
              
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-full" onClick={() => setShowProfileModal(true)}>
                <span className="text-sm font-semibold text-slate-700 hidden lg:block">
                  {profile.full_name}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center relative group">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
  

              <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-2">
                <Link to="/about" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" aria-label="About">
                  <Info className="w-5 h-5" />
                </Link>
                <Link to="/support" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" aria-label="Support">
                  <HelpCircle className="w-5 h-5" />
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && profile && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Update Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+233 55 123 4567"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">Add your phone number so other parties can call you during negotiations or deliveries.</p>
            </div>
            <button 
              onClick={handleUpdatePhone}
              className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
  

      {/* Mobile Bottom Navigation */}
      {(user || demoMode) && profile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 z-50 flex justify-around pb-safe">
          {profile.role === 'vendor' ? (
            <Link to="/vendor" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${location.pathname.startsWith('/vendor') ? 'text-[#10B981]' : 'text-slate-500'}`}>
              <Store className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Hub</span>
            </Link>
          ) : profile.role === 'buyer' ? (
            <Link to="/buyer" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${location.pathname.startsWith('/buyer') ? 'text-[#10B981]' : 'text-slate-500'}`}>
              <ShoppingBag className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Market</span>
            </Link>
          ) : (
            <Link to="/rider" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${location.pathname.startsWith('/rider') ? 'text-[#10B981]' : 'text-slate-500'}`}>
              <Motorbike className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Rides</span>
            </Link>
          )}

          {profile.role !== 'rider' && (
            <Link to="/negotiations" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${location.pathname.startsWith('/negotiations') ? 'text-[#10B981]' : 'text-slate-500'}`}>
              <MessageCircle className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Chats</span>
            </Link>
          )}
          <Link to="/deliveries" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${location.pathname.startsWith('/deliveries') ? 'text-[#10B981]' : 'text-slate-500'}`}>
            <svg className="w-6 h-6 mb-1 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-bold">Deliveries</span>
          </Link>
        </nav>
      )}
    </>
  );
};
