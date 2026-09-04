const fs = require('fs');
let code = fs.readFileSync('src/views/VendorDashboard.tsx', 'utf8');

// The Unsplash Source API was recently shut down. loremflickr is fine but often returns random/weird cats. 
// A safer alternative that returns relevant royalty free images is using Unsplash's new free random endpoint or similar.
// Wait, the prompt specifically asked for "data from the internet and use those images instead".
// We will change it to use a real Unsplash query format (source.unsplash.com redirects but still works partially, 
// let's use standard Unsplash query via `https://images.unsplash.com/photo-...` but since we can't search dynamically without an API key,
// we can use a reliable proxy like source.unsplash.com which redirects, or just stick to loremflickr which is working).

// To be safe and ensure the images look like actual market produce, let's stick to loremflickr but add more specific keywords.
const target = "const queryKeys = (newProductName + ' ' + newProductCategory).split(' ').filter(Boolean).join(',');";
const replacement = "const queryKeys = encodeURIComponent((newProductName + ' ' + newProductCategory).trim());";

code = code.replace(target, replacement);

const target2 = "const autoImageUrl = newProductImageUrl.trim() || `https://loremflickr.com/500/500/${encodeURIComponent(queryKeys)}/all`;";
const replacement2 = "const autoImageUrl = newProductImageUrl.trim() || `https://loremflickr.com/500/500/${queryKeys},food/all`;";

code = code.replace(target2, replacement2);

fs.writeFileSync('src/views/VendorDashboard.tsx', code);
