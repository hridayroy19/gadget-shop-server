const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb
const url = `mongodb+srv://${process.env.DATABASC_USER}:${process.env.DATABASC_PASS}@cluster0.jg43ilw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const clint = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnet = async () => {
  try {
    clint.connect();
    console.log("Database conncted successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
};

dbConnet();

//api
app.get("/", (req, res) => {
  res.send("surver is running ");
});

//jwt emplemnet
app.post('/authication', async(req, res )=>{
  const userEmail = req.body
  const token = jwt.sign(userEmail,process.env.TOKEN_ACCESS,{expiresIn: '1d' });
  res.send({token})
})

app.listen(port, () => {
  console.log(`server is runnign on port${port}`);
});
