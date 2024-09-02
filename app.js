const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const userRouter = require("./routes/userRoutes");
app.use("/users", userRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
