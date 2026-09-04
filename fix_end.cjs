const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// I will just replace the exact target.
const oldStr = `        </div>
      </div>
      
      
      {/* Delete Confirmation Modal */}`;

const newStr = `        </div>
      </div>
      </>)}
      </div>

      {/* Delete Confirmation Modal */}`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/views/VendorDashboard.tsx', code);
