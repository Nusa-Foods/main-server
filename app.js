require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const allowedDomain = [process.env.CLIENT_DOMAIN, process.env.ADMIN_DOMAIN];

app.use(
    cors({
        origin: allowedDomain,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type", "x-email", "x-id"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
module.exports = app;
