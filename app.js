require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
