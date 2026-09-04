const fs = require('fs');
let code = fs.readFileSync('src/views/LoginView.tsx', 'utf8');

code = code.replace(
  /const handleRoleSelect = async \(role: 'vendor' \| 'buyer'\) => \{/,
  `const handleRoleSelect = async (role: 'vendor' | 'buyer' | 'rider') => {`
);

code = code.replace(
  /navigate\(role === 'vendor' \? '\/vendor' : '\/buyer'\);/,
  `navigate(role === 'vendor' ? '/vendor' : role === 'buyer' ? '/buyer' : '/rider');`
);

code = code.replace(
  /grid-cols-1 md:grid-cols-2/,
  `grid-cols-1 md:grid-cols-3`
);

const buyerButtonEndRegex = /<span className="text-blue-600\/70 text-sm font-medium">Browse markets and buy<\/span>\s*<\/button>/;

code = code.replace(buyerButtonEndRegex, (match) => {
  return `${match}
          <button
            onClick={() => handleRoleSelect('rider')}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-transparent hover:border-amber-100 bg-amber-50 rounded-3xl transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-amber-900 mb-1 sm:mb-2">I am a Rider</span>
            <span className="text-amber-700/70 text-sm font-medium">Deliver goods and track orders</span>
          </button>`;
});

fs.writeFileSync('src/views/LoginView.tsx', code);
