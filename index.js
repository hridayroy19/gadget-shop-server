const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200, 
  })
);
app.use(express.json());

// jwt token validation
const veryfyJwt = (req, res)=>{
  const authorization = req.header.authorizatioon;
  if(!authorization){
    return res.send({message:'No token'})
  }
 const token = authorization.split(' ')[1];
 jwt.verify(token.process.env.TOKEN_ACCESS,(err, decode)=>{
  if(err){
    return res.send({message:'invalid token'})
  }
  req.decode = decode
 })

}

//mongodb
const url = `mongodb+srv://${process.env.DATABASC_USER}:${process.env.DATABASC_PASS}@cluster0.jg43ilw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const clint = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//database collaction
const userCollaction = clint.db("gadgetShop").collection("user");
const productCollaction = clint.db("gadgetShop").collection("product");

const dbConnet = async () => {
  try {
    clint.connect();
    console.log("Database conncted successfully");

    //getuser
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email; 
      const query = { email: email };
      console.log(query);
      
        const user = await userCollaction.findOne(query);      
        console.log(user);   
        if(user === null || user === undefined){
          res.send('empty')
        }      
        res.send(user);

    });
    

    //insart user
    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };

        // Check if the user already exists
        const existUser = await userCollaction.findOne(query);

        if (existUser) {
          return res.send({
            message: "User already exists. Proceed to login.",
          });
        }

        // Insert the new user into the database
        const result = await userCollaction.insertOne(user);
        res.send(result);
      } catch (error) {
        console.log(error.name, error.message);
        res.status(500).send({ error: "An error occurred on the server." });
      }
    });
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
app.post("/authication", async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.TOKEN_ACCESS, {
    expiresIn: "1d",
  });
  res.send({ token });
});

app.listen(port, () => {
  console.log(`server is runnign on port${port}`);
});
