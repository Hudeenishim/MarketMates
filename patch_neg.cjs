const fs = require('fs');
let code = fs.readFileSync('src/views/NegotiationCenter.tsx', 'utf8');

if (!code.includes('otherPartyPhone')) {
  // Add otherPartyPhone to RichNegotiation
  code = code.replace(
    "otherPartyName?: string;",
    "otherPartyName?: string;\n  otherPartyPhone?: string;"
  );
  
  // Add Phone icon to lucide imports if missing
  if (!code.includes('PhoneCall')) {
    code = code.replace(
      "import { MessageSquare, Check, X, ArrowLeft, Loader2, Store, Package } from 'lucide-react';",
      "import { MessageSquare, Check, X, ArrowLeft, Loader2, Store, Package, PhoneCall } from 'lucide-react';"
    );
  }

  // Set the phone number when enriching
  code = code.replace(
    "n.otherPartyName = userDoc.data()?.full_name || 'Unknown User';",
    "n.otherPartyName = userDoc.data()?.full_name || 'Unknown User';\n            n.otherPartyPhone = userDoc.data()?.phone_number || '';"
  );

  // Render the Phone button in the negotiation view
  const headerRegex = /<div className="hidden md:flex items-center gap-4 bg-white px-6 py-4 border-b border-slate-200">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  
  const originalHeader = code.match(headerRegex)[0];
  
  const newHeader = originalHeader.replace(
    "</div>\n        </div>\n      </div>",
    `</div>\n        </div>\n        {selectedNeg?.otherPartyPhone ? (\n          <a href={"tel:" + selectedNeg.otherPartyPhone} className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-bold transition-colors">\n            <PhoneCall className="w-4 h-4" />\n            <span className="hidden sm:inline">Call {profile?.role === 'vendor' ? 'Buyer' : 'Vendor'}</span>\n          </a>\n        ) : (\n          <button onClick={() => alert('This user has not added their phone number yet.')} className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 font-bold transition-colors">\n            <PhoneCall className="w-4 h-4" />\n          </button>\n        )}\n      </div>`
  );
  
  code = code.replace(headerRegex, newHeader);

  // Also in mobile header
  const mobileHeaderRegex = /<div className="flex md:hidden items-center gap-3 bg-white p-4 border-b border-slate-200 sticky top-0 z-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  const originalMobileHeader = code.match(mobileHeaderRegex)[0];
  const newMobileHeader = originalMobileHeader.replace(
    "</div>\n        </div>\n      </div>",
    `</div>\n        </div>\n        {selectedNeg?.otherPartyPhone ? (\n          <a href={"tel:" + selectedNeg.otherPartyPhone} className="ml-auto p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-bold transition-colors">\n            <PhoneCall className="w-5 h-5" />\n          </a>\n        ) : (\n          <button onClick={() => alert('This user has not added their phone number yet.')} className="ml-auto p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 font-bold transition-colors">\n            <PhoneCall className="w-5 h-5" />\n          </button>\n        )}\n      </div>`
  );
  
  code = code.replace(mobileHeaderRegex, newMobileHeader);

  fs.writeFileSync('src/views/NegotiationCenter.tsx', code);
}
