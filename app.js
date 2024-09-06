require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type", "x-email", "x-id"],
    })
);

// app.use(cors({
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Authorization', 'Content-Type', 'x-email', 'x-id'],
// }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

module.exports = app;
