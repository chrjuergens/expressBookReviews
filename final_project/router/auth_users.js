const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if (username) {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
  //write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const new_review = req.body.review;
  console.log("New review: " + new_review);
  const username = req.session.authorization['username'];
  if (!isbn) {
    return res.status(404).json({message: "No isbn provided!"});
  }
  console.log("New review by " + username +  " for isbn " + isbn);
  if (!new_review) {
    return res.status(404).json({message: "No review provided!"});
  } else {
    if (isbn in books) {
      books[isbn]["reviews"][username] = new_review;
      return res.status(200).json({message: "Review inserted!"});
    } else {
      return res.status(404).json({message: "isbn not found!"});
    }
  }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (!isbn) {
    return res.status(404).json({message: "No isbn provided!"});
  }
  if (isbn in books) {
    let reviews = books[isbn]["reviews"];
    if (username in reviews) {
      delete reviews[username];
      books[isbn]["reviews"] = reviews;
      return res.status(200).json({message: "Deleted review for isbn " + isbn + " written by " + username});
    }
  } else {
    return res.status(404).json({message: "Isbn not found!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
