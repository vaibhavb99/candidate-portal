require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const api = require("./routes/api");

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/canddb";

connectDB(MONGO_URI);

app.use("/api", api);

app.get("/", (req, res) => res.send("Candidate Portal API Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
