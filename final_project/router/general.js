const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password)
    return res.status(404).send("Unable to register user.");
  // Check if the user does not already exist
  if (doesExist(username)) return res.status(404).send("User already exists!");

  // Add the new user to the users array
  users.push({ username: username, password: password });
  return res
    .status(200)
    .send("User successfully registered. Now you can login");
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  Promise.resolve(JSON.stringify(books)).then((bookList) =>
    res.status(200).send(bookList)
  );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  Promise.resolve(books[isbn]).then((myBook) => res.status(200).send(myBook));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let myAuthor = req.params.author;
  let length = Object.keys(books).length;
  for (let i = 1; i < length + 1; i++) {
    if (books[i].author == myAuthor) return res.status(200).send(books[i]);
  }
  return res.status(300).send("author not found");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let length = Object.keys(books).length;
  for (let i = 1; i < length + 1; i++) {
    if (books[i].title == title) return res.status(200).send(books[i]);
  }
  return res.status(300).send("title not found");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
