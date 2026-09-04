const name = "Fresh Plantains";
const category = "Vegetables";
const queryKeys = (name + ' ' + category).trim().replace(/\s+/g, ',');
console.log(`https://loremflickr.com/500/500/${queryKeys},food/all`);
