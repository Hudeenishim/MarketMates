import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { VendorDashboard } from './views/VendorDashboard';
import { BuyerView } from './views/BuyerView';
import { NegotiationCenter } from './views/NegotiationCenter';
import { AboutView } from './views/AboutView';
import { CustomerServiceView } from './views/CustomerServiceView';
import { useNegotiationNotifications } from './hooks/useNegotiationNotifications';
import { RiderDashboard } from './views/RiderDashboard';
import { DeliveryDashboard } from './views/DeliveryDashboard';
import { APIProvider } from '@vis.gl/react-google-maps';
import { TutorialOverlay } from './components/TutorialOverlay';


const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'vendor' | 'buyer' | 'rider' }) => {
  const { user, profile, loading, demoMode } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">Loading...</div>;

  if (demoMode) return <>{children}</>;

  if (!user) return <Navigate to="/login" replace />;

  if (!profile) return <Navigate to="/login" replace />;

  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={profile.role === 'vendor' ? '/vendor' : profile.role === 'buyer' ? '/buyer' : '/rider'} replace />;
  }

  return <>{children}</>;
};


const DemoModeFeatures = () => {
  const { demoMode } = useAuth();
  return demoMode ? <TutorialOverlay /> : null;
};

const NotificationProvider = () => {
  useNegotiationNotifications();
  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider />
      <DemoModeFeatures />
      <BrowserRouter>
        <div className="h-[100dvh] w-screen bg-[#F2F2F7] font-sans text-slate-900 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 min-h-0 max-w-[2000px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-32 md:pb-8 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="flex-1 shrink-0 flex flex-col w-full">
              <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/vendor" element={
                <ProtectedRoute allowedRole="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/buyer" element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerView />
                </ProtectedRoute>
              } />
              
              <Route path="/rider" element={
                <ProtectedRoute allowedRole="rider">
                  <RiderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/deliveries" element={
                <ProtectedRoute>
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
              <Route path="/negotiations" element={
                <ProtectedRoute>
                  <NegotiationCenter />
                </ProtectedRoute>
              } />
                            <Route path="/about" element={
                <ProtectedRoute>
                  <AboutView />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <CustomerServiceView />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            </div>
            {/* Mobile bottom nav spacer */}
            <div className="h-40 shrink-0 md:hidden w-full"></div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
