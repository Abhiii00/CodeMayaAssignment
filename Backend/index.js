require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./src/config/dbConfig');
const routes = require("./src/routes/index");

const app = express();

app.use(
  cors({
    origin: [
      "http://codemaya.duckdns.org"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();
app.use("/", routes);

app.get('/', (req, res)=>{
    res.json('node is running')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
