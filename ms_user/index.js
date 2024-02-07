var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require("mongodb");

// Use environment variables for security and flexibility
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET || 'yourSecretKey'; // Ensure to set a strong secret key in production
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const client = new MongoClient(mongoUri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }
});

async function pingDb() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("successfully pinged mongo");
  } finally {
    await client.close();
  }
}

app.get("/healthcheck", async (req, res) => {
  try {
    await pingDb();
    res.send("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).send("MongoDB connection failed");
  }
});

async function findUser(username) {
  try {
    await client.connect();
    const database = client.db("tradingApp");
    const users = database.collection("users");
    return await users.findOne({ username });
  } finally {
    await client.close();
  }
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(username, hashedPassword);
  res.status(201).send('User registered successfully');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUser(username);

  if (user && await bcrypt.compare(password, user.hashedPassword)) {
    const token = jwt.sign({ username: user.username, id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Username or password is incorrect');
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


app.get('/protected', authenticateToken, (req, res) => {
  res.send('Protected data accessed');
});

app.get("/", (req, res) => {
  res.send("This is the user microservice");
});

app.listen(port, () => {
  console.log(`User microservice on port ${port}...`);
});


//just use profile id to store in jwt
//identify user to the payload

//jwt token with nodejs or express
//read headers in nodejs

//search for 
//login
//register endpoint
//store password using bcrypt
