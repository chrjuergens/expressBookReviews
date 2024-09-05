const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + ":" + password);
  // Check if both username and password are provided
  if (username) {
    // Check if the user does not already exist
    if (isValid(username)) {
      if (!password) {
        return res.status(404).json({message: "No password provided!"});
      }
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user. Username missing!"});
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/',function (req, res) {
  //try {
    const books_to_string = (books) => {
      return new Promise((resolve, reject) => {
        try {
          resolve(JSON.stringify(books));
        } catch(err) {
          reject();
        }
      })
    }
    books_to_string(books).then((result) => res.send(result)).then(() => console.log("Books send!"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn]));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.replace("+", " ");
  let books_by_author = [];
  for (key in books) {
    if (books[key]["author"] == author) {
      books_by_author.push(books[key]);
    }
  }
  return res.send(JSON.stringify(books_by_author));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const regex = new RegExp(/\+/g);
  const title = req.params.title.replace(regex, ' ');
  let books_by_title = [];
  for (key in books) {
    if (books[key]["title"] == title) {
      books_by_title.push(books[key]);
    }
  }
  return res.send(JSON.stringify(books_by_title));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(JSON.stringify(book["reviews"]));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
