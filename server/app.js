const express = require("express");
const path = require("path");
const app = express();

const publicFolderPath = path.join(__dirname, "./../public");

app.use(express.static(publicFolderPath));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
