const fs = require('fs');
let code = fs.readFileSync('src/views/LoginView.tsx', 'utf8');

const riderButton = `
          <button
            onClick={() => handleRoleSelect('rider')}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-transparent hover:border-violet-100 bg-violet-50 rounded-3xl transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-violet-900 mb-1 sm:mb-2">I am a Rider</span>
            <span className="text-violet-700/70 text-sm font-medium">Accept and manage deliveries</span>
          </button>
        </div>`;

code = code.replace(
  '        </div>\n        {error && <p className="text-red-500 text-sm mt-6 text-center">{error}</p>}',
  riderButton + '\n        {error && <p className="text-red-500 text-sm mt-6 text-center">{error}</p>}'
);

fs.writeFileSync('src/views/LoginView.tsx', code);
console.log("Updated LoginView.tsx");
