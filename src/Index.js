const express = require("express");
const { request } = require("http");
const app = express();
const mongoose = require("mongoose"); 
const path = require("path");
const ejs = require("ejs");
const { collection, collection2 } = require("./mongodb");

const bodyParser = require('body-parser'); //for body parser endpoint

const templatepath = path.join(__dirname, "../templates");

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatepath);
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());//for endpoint

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  // Extract user_id from query parameter
  res.render("Home"); // Pass the user_id to the template
});

//for signup database store connection
app.post("/signup", async (req, res) => {
  const data = {
    user_id: new mongoose.Types.ObjectId(), 
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

app.post("/check", async (req, res) => {
  const input = req.body.input.split(",").map((num) => parseInt(num));
  const random = parseInt(req.body.random);

  

  const sortedInput = input.sort((a, b) => b - a);

  const result = input.includes(random);

  

    try {
      await collection2.create({ input: sortedInput.join(",") });
      res.render("home", { result: result });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
 
});



//for endpoint

const inputData = [
  {
    timestamp: '2012-01-01 00:00:00',
    user_id: 1,
    input_values: '11, 10, 9, 7, 5, 1, 0'
  },
  {
    timestamp: '2013-01-01 01:00:00',
    user_id: 1,
    input_values: '13, 11, 10, 7, 5, 2, 1'
  },
  // ... other data entries
];

app.get('/get-input-values', (req, res) => {
  const { start_datetime, end_datetime, user_id } = req.query;
  
  // Validate user_id, start_datetime, and end_datetime here

  const filteredData = inputData.filter(entry => {
    return (
      entry.user_id == user_id &&
      entry.timestamp >= start_datetime &&
      entry.timestamp <= end_datetime
    );
  });

  const response = {
    status: 'success',
    user_id: user_id,
    payload: filteredData
  };

  res.json(response);
});


app.post('/add-input-values/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { input_values } = req.body;

  const timestamp = new Date().toISOString();
  
  const entry = {
    timestamp: timestamp,
    user_id: parseInt(user_id),
    input_values: input_values.join(', ')
  };

  inputData.push(entry);

  const response = {
    status: 'success',
    message: 'Input values added successfully'
  };

  res.json(response);
});




app.listen(5000, () => {
  console.log("port is running");
});
