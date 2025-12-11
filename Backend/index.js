require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./src/config/dbConfig');
const routes = require("./src/routes/index");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/", routes);

app.get('/', (req, res)=>{
    res.json('node is running')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
