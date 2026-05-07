const fs = require('fs');

const vi = JSON.parse(fs.readFileSync('frontend/public/locales/vi/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('frontend/public/locales/en/translation.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const viKeys = getKeys(vi);
const enKeys = getKeys(en);

const missingInEn = viKeys.filter(k => !enKeys.includes(k));
const missingInVi = enKeys.filter(k => !viKeys.includes(k));

console.log('Missing in EN:', missingInEn);
console.log('Missing in VI:', missingInVi);
