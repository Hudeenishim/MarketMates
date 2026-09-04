const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  /useEffect\(\(\) => \{\n\s*const unsubscribe = onAuthStateChanged\(auth, async \(currentUser\) => \{([\s\S]*?)\}\);\n\n\s*return unsubscribe;\n\s*\}, \[demoMode, demoRole\]\);/m,
  `const fetchProfile = async (currentUser: User | null) => {
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchProfile(currentUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchProfile(user);
  }, [demoMode, demoRole]);`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log("Patched AuthContext.tsx");
