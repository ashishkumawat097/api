const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { MULTI_STATUS } = require("http-status-codes");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const config = require("./config/config.json");
const db = require("./config/database.json");

app.get("/",(req , res) =>{
res.status(200).send("<h1>Hello welcome to API Home Page</h1>");
});
// Connecting database
mongoose.connect(config.MONGODB_URL);
mongoose.connection.on("error", (err) => console.log(err));
mongoose.connection.on("open", () => console.log("Successfully connected "));

// app.use(express.static("./uploads"));
app.use(cors()); // Middleware call
app.use(express.json());
app.use(errors());
app.use(require("./routes/index"));

const httpServer = http.createServer(app);
httpServer.listen(config.port, (err) => console.log(`Server Lisent on port:${config.port}`));
//Sever Created
