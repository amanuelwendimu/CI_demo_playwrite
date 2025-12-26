const fs = require('fs');

function getTestData(filePath) {
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

module.exports = { getTestData };
