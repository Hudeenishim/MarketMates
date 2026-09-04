const fs = require('fs');
let code = fs.readFileSync('src/views/BuyerView.tsx', 'utf8');

code = code.replace(
  "</>)}\n\n      {activeTab === 'products' && (<>\n      {/* Product Catalog */}",
  "</>)}\n\n      {/* Product Catalog */}"
);

// We still have `</>)}` at the end of the file. We need to remove one since we removed the opening tag for products.
code = code.replace(
  "      </>)}\n      </div>\n    </div>\n  );\n};\n",
  "      </div>\n    </div>\n  );\n};\n"
);

fs.writeFileSync('src/views/BuyerView.tsx', code);
