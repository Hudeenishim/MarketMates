const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  /setProfile\(\{ id: profileDoc\.id, \.\.\.profileDoc\.data\(\) \} as Profile\);/,
  `const data = profileDoc.data();
            let fullName = data.full_name;
            if ((!fullName || fullName === 'Anonymous User') && currentUser.email) {
              fullName = currentUser.email.split('@')[0];
              try {
                // Background update to firestore
                setDoc(doc(db, 'profiles', currentUser.uid), { full_name: fullName }, { merge: true });
              } catch(e) {}
            }
            setProfile({ id: profileDoc.id, ...data, full_name: fullName } as Profile);`
);

code = code.replace(
  /let defaultName = user\.displayName \|\| 'Anonymous User';\n\s*if \(user\.email && user\.email\.endsWith\('@marketmates\.local'\)\) \{\n\s*const username = user\.email\.split\('@'\)\[0\];\n\s*if \(\!user\.displayName\) \{\n\s*defaultName = username;\n\s*\}\n\s*\}/,
  `let defaultName = user.displayName;
    if (!defaultName && user.email) {
      defaultName = user.email.split('@')[0];
    }
    if (!defaultName) {
      defaultName = 'Anonymous User';
    }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log("Patched username logic");
