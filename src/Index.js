const express = require("express");
const { request } = require("http");
const app = express(); //requiring express
const mongoose = require("mongoose"); //requiring mongoose for database
const path = require("path");
const ejs = require("ejs"); //for the template extension generate
const { collection, collection2 } = require("./mongodb"); // importing from mongodb.js

const jwt = require("jsonwebtoken"); //jwt token
const secretKey = "hiii"; //secret key generate

const bodyParser = require("body-parser"); //for body parser endpoint

const templatepath = path.join(__dirname, "../templates");

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatepath);
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json()); //for endpoint

//This is the default page after running the server
app.get("/", (req, res) => {
  const signupMessage = req.query.signup === "success";
  res.render("login", { signupMessage });
});

//This is the signup function to render the Signup page

app.get("/signup", (req, res) => {
  res.render("signup");
});

//This is the home function to render the khoj the search page

app.get("/home", (req, res) => {
  res.render("Home", { userId: req.userId }); // Pass the user_id to the Home.ejs
});

//for signup database store connection
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      const errorMessage =
        "Email already exists. Click the button below to log in.";
      const loginButton = '<a href="/"> Login </a>';
      const fullErrorMessage = `${errorMessage} ${loginButton}`;
      return res.status(400).send(fullErrorMessage);
    }

    // If email is unique then it will create a new user
    const newUser = {
      user_id: new mongoose.Types.ObjectId(),
      name,
      email,
      password,
    };

    await collection.insertMany([newUser]);

    res.redirect("/?signup=success");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

//for Login database store connection

app.post("/login", async (req, res) => {
  try {
    const checkuser = await collection.findOne({ email: req.body.email });
    if (checkuser && checkuser.password === req.body.password) {
      // Generate a JWT token
      const token = jwt.sign({ email: checkuser.email }, secretKey, {
        expiresIn: "5h",
      });

      // Redirect to the home page
      res.redirect("/home");
      //To check the token value
      console.log("Token:", token);
    } else {
      res.send("Invalid email or password");
      ``;
    }
  } catch {
    res.send("An error occurred");
  }
});

//for searching

app.post("/check", async (req, res) => {
  const input = req.body.input.split(",").map((num) => parseInt(num));
  const random = parseInt(req.body.random);

  const sortedInput = input.sort((a, b) => b - a); //for the descending order in the database

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
    timestamp: "2012-01-01 00:00:00",
    user_id: 1,
    input_values: "11, 10, 9, 7, 5, 1, 0",
  },
  {
    timestamp: "2013-01-01 01:00:00",
    user_id: 1,
    input_values: "13, 11, 10, 7, 5, 2, 1",
  },
];

app.get("/get-input-values", (req, res) => {
  const { start_datetime, end_datetime, user_id } = req.query;

  // Validate user_id, start_datetime, and end_datetime here

  const filteredData = inputData.filter((entry) => {
    return (
      entry.user_id == user_id &&
      entry.timestamp >= start_datetime &&
      entry.timestamp <= end_datetime
    );
  });

  const response = {
    status: "success",
    user_id: user_id,
    payload: filteredData,
  };

  res.json(response);
});

// to the api given value result

app.post("/add-input-values/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { input_values } = req.body;

  const timestamp = new Date().toISOString();

  const entry = {
    timestamp: timestamp,
    user_id: parseInt(user_id),
    input_values: input_values.join(", "),
  };

  inputData.push(entry);

  const response = {
    status: "success",
    message: "Input values added successfully",
  };

  res.json(response);
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["Authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "After Pressing Login, come here to see the token" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
}

//sending the token to the home after login which will show in the console

app.post("/home", verifyToken, (req, res) => {
  const userId = req.userId; // User ID extracted from the JWT token

  const userData = {
    userId: userId,
    message: "Welcome to the protected home route!",
  };

  res.json(userData); // Return JSON data
});

// Example client code using the fetch API
const token = "hiii";
fetch("http://localhost:5000/home", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // 'Bearer' is the prefix for the token header key values
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

app.listen(5000, () => {
  console.log("port is running");
});
