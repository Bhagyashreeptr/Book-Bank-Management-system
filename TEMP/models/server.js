const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json());  // Parse incoming JSON data

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookbank', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Import Models
const User = require('./models/user');
const Book = require('./models/book');

// Register User Route
app.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({ username, password, email, phone });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Login User Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// Add Book Route
app.post('/add-book', async (req, res) => {
  const { title, author, category, copies } = req.body;

  try {
    const book = new Book({ title, author, category, copies });
    await book.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding book', error: err });
  }
});

// Get Books Route
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
