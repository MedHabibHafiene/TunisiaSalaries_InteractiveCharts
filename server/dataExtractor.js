const fs = require('fs');
const request = require('request');
const Papa = require('papaparse');
const { exit } = require('process');

const csvUrl = 'https://docs.google.com/spreadsheets/d/1IbnUI1aiQ5r_HpLdCNJJp7Gu6KyMw4EpKnkSPmxAHz8/gviz/tq?tqx=out:csv&sheet=YourSheetName';

request(csvUrl, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    // Parse the CSV data into JSON
    Papa.parse(body, {
      header: true,
      dynamicTyping: true, 
      skipEmptyLines: true,
      complete: function (results) {
        const jsonData = JSON.stringify(results.data, null, 2);

        const jsonFilePath = './../public/data/dataF.json';

        fs.writeFileSync(jsonFilePath, jsonData);

        console.log('JSON file created successfully');
        exit();
      },
      error: function (error) {
        console.error('Error parsing CSV:', error.message);
      },
    });
  } else {
    console.error('Error fetching CSV:', error);
  }
});
