const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// We want to rewrite the AuthContext entirely to support setDemoRole
const newCode = `import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  setProfileRole: (role: 'vendor' | 'buyer' | 'rider') => Promise<void>;
  setDemoRole: (role: 'vendor' | 'buyer' | 'rider') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  demoMode: false,
  setDemoMode: () => {},
  setProfileRole: async () => {},
  setDemoRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [demoRole, setDemoRole] = useState<'vendor' | 'buyer' | 'rider'>('buyer');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (demoMode) {
        setProfile({
          id: 'demo_user',
          full_name: 'Demo User',
          email: 'demo@marketmates.local',
          role: demoRole,
          market_hub_id: '',
          avatar_url: '',
          created_at: Date.now(),
          updated_at: Date.now(),
        });
      } else if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
          if (profileDoc.exists()) {
            setProfile({ id: profileDoc.id, ...profileDoc.data() } as Profile);
          } else {
             setProfile(null);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [demoMode, demoRole]); // re-run when demoMode or demoRole changes

  const setProfileRole = async (role: 'vendor' | 'buyer' | 'rider') => {
    if (!user || demoMode) return;
    
    let defaultName = user.displayName || 'Anonymous User';
    if (user.email && user.email.endsWith('@marketmates.local')) {
      const username = user.email.split('@')[0];
      if (!user.displayName) {
        defaultName = username;
      }
    }

    const newProfile: Partial<Profile> = {
      full_name: defaultName,
      email: user.email || '',
      role,
      market_hub_id: '',
      avatar_url: user.photoURL || '',
      updated_at: Date.now(),
    };

    if (!profile) {
      newProfile.created_at = Date.now();
    }

    try {
      await setDoc(doc(db, 'profiles', user.uid), newProfile, { merge: true });
      setProfile((prev) => ({ ...prev, ...newProfile } as Profile));
    } catch (error) {
      console.error("Failed to set profile role:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, demoMode, setDemoMode, setProfileRole, setDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};
`;

fs.writeFileSync('src/contexts/AuthContext.tsx', newCode);
console.log("Updated AuthContext.tsx");
