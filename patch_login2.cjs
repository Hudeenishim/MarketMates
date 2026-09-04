const fs = require('fs');
let code = fs.readFileSync('src/views/LoginView.tsx', 'utf8');

// Replace first occurrence (role selection)
code = code.replace(
  '<div className="w-full min-h-full flex items-center justify-center">\n        <div className="w-full p-4 py-8">',
  '<div className="w-full min-h-full flex flex-col">\n        <div className="flex-1 shrink-0 min-h-[2rem]"></div>\n        <div className="w-full p-4 py-8">'
);

code = code.replace(
  '        {error && <p className="text-red-500 text-sm mt-6 text-center">{error}</p>}\n          </div>\n        </div>\n      </div>',
  '        {error && <p className="text-red-500 text-sm mt-6 text-center">{error}</p>}\n          </div>\n        </div>\n        <div className="flex-1 shrink-0 min-h-[2rem]"></div>\n      </div>'
);

// Replace second occurrence (main login)
code = code.replace(
  '<div className="w-full min-h-full flex items-center justify-center">\n      <div className="w-full p-4 py-8">',
  '<div className="w-full min-h-full flex flex-col">\n      <div className="flex-1 shrink-0 min-h-[2rem]"></div>\n      <div className="w-full p-4 py-8">'
);

code = code.replace(
  '    </div>\n    </div>\n    </div>',
  '    </div>\n      </div>\n      <div className="flex-1 shrink-0 min-h-[2rem]"></div>\n    </div>'
);

fs.writeFileSync('src/views/LoginView.tsx', code);
