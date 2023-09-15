const express = require("express");
const path = require("path");
const app = express();

const publicFolderPath = path.join(__dirname, "./../public");

app.use(express.static(publicFolderPath));

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
