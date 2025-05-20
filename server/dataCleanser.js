const fs = require('fs');
const path = require('path');

// Read the original data file
const dataPath = path.join(__dirname, '..', 'public', 'data', 'dataF.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Clean the data
const cleanedData = data.map(item => {
  // Create a new object to avoid modifying the original
  const cleanedItem = { ...item };

  // Clean Année d'experience field - standardize format
  if (cleanedItem["Année d'experience:"]) {
    const xpValue = cleanedItem["Année d'experience:"].toLowerCase();
    if (xpValue.includes('0 ans') || xpValue.includes('0ans') || xpValue === '0 ans' || xpValue === '0ans') {
      cleanedItem["Année d'experience:"] = "0 ans";
    } else if (!xpValue.includes('ans')) {
      cleanedItem["Année d'experience:"] = xpValue + " ans";
    }
  } else {
    cleanedItem["Année d'experience:"] = "Non spécifié";
  }

  // Clean Salaire (TND) field
  if (cleanedItem["Salaire (TND)"] === null || cleanedItem["Salaire (TND)"] === undefined) {
    cleanedItem["Salaire (TND)"] = "Non spécifié";
  } else if (typeof cleanedItem["Salaire (TND)"] === 'number' && cleanedItem["Salaire (TND)"] < 100) {
    // Fix for salaries that are likely entered in thousands (e.g., 4.4 should be 4400)
    cleanedItem["Salaire (TND)"] = Math.round(cleanedItem["Salaire (TND)"] * 1000);
  }

  // Clean Nom entreprise field
  if (cleanedItem["Nom entreprise"] === null || 
      cleanedItem["Nom entreprise"] === undefined ||
      cleanedItem["Nom entreprise"] === "??" ||
      cleanedItem["Nom entreprise"] === "!..." ||
      cleanedItem["Nom entreprise"] === "-------------------------" ||
      cleanedItem["Nom entreprise"] === "Anyone") {
    cleanedItem["Nom entreprise"] = "Non spécifié";
  }

  // Clean Stack technologique field
  if (cleanedItem["Stack technologique(ex: java, javascript, angular, react ...)"] === null ||
      cleanedItem["Stack technologique(ex: java, javascript, angular, react ...)"] === undefined) {
    cleanedItem["Stack technologique(ex: java, javascript, angular, react ...)"] = "Non spécifié";
  } else {
    // Fix common typos
    let stack = cleanedItem["Stack technologique(ex: java, javascript, angular, react ...)"];
    stack = stack.replace(/javascipt/gi, 'javascript');
    stack = stack.replace(/Réact/gi, 'React');
    stack = stack.replace(/note js/gi, 'Node.js');
    cleanedItem["Stack technologique(ex: java, javascript, angular, react ...)"] = stack;
  }

  return cleanedItem;
});

// Write the cleaned data to a new file
const cleanedDataPath = path.join(__dirname, '..', 'public', 'data', 'dataClean.json');
fs.writeFileSync(cleanedDataPath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log('Data cleaning completed. Cleaned data saved to dataClean.json');
