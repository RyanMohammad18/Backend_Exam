const express = require("express");
const { request } = require("http");
const app = express();

const path = require("path");
const ejs = require("ejs");
const {collection,collection2} = require("./mongodb");


const templatepath = path.join(__dirname, "../templates");

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatepath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("Home");
});

//for signup database store connection
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  await collection.insertMany([data]);

  res.render("Home");
});

//for Login database store connection

app.post("/login", async (req, res) => {
  try {
    const checkuser = await collection.findOne({ email: req.body.email });
    if (checkuser.password === req.body.password) {
      res.render("Home");
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("Invalid email or password");
  }
});


//for searching 

app.post('/check', async (req, res) => {
  const input = req.body.input.split(',').map(num => parseInt(num));
  const random = parseInt(req.body.random);

  const sortedInput = input.sort((a, b) => b - a); 

  const result = input.includes(random);

  try {
    await collection2.create({ input: sortedInput.join(',') }); // Store input in database
    res.render('home', { result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }

  
  res.render('home', { result });
});


app.listen(5000, () => {
  console.log("port is running");
});
