const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

const regex = /      <\/div>\n\n      \n      \n      \{\/\* Delete Confirmation Modal \*\/\}/g;

code = code.replace(regex, '      </div>\n      </>)}\n      </div>\n\n      {/* Delete Confirmation Modal */}');

// Just to be sure, let's use a simpler replace:
code = code.replace("      </div>\n\n      \n      \n      {/* Delete Confirmation Modal */}", "      </div>\n      </>)}\n      </div>\n\n      {/* Delete Confirmation Modal */}");

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
