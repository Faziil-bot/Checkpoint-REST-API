// ============================================
// IMPORTS AND CONFIGURATION
// ============================================

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Get port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the application if database connection fails
  });

// ============================================
// ROUTES / API ENDPOINTS
// ============================================

// ------------------------------------------
// GET: Retrieve all users from database
// ------------------------------------------
app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    
    // Send success response with users data
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    // Send error response if something goes wrong
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// ------------------------------------------
// POST: Add a new user to database
// ------------------------------------------
app.post('/users', async (req, res) => {
  try {
    // Create new user with data from request body
    const newUser = await User.create(req.body);
    
    // Send success response with created user
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    // Handle validation errors or other errors
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// ------------------------------------------
// PUT: Update/Edit a user by ID
// ------------------------------------------
app.put('/users/:id', async (req, res) => {
  try {
    // Extract user ID from URL parameters
    const userId = req.params.id;
    
    // Find user by ID and update with new data
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validation on update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );
    
    // Check if user was found
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Send success response with updated user
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// ------------------------------------------
// DELETE: Remove a user by ID
// ------------------------------------------
app.delete('/users/:id', async (req, res) => {
  try {
    // Extract user ID from URL parameters
    const userId = req.params.id;
    
    // Find user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);
    
    // Check if user was found
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// ============================================
// START SERVER
// ============================================

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📍 Test the API endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/users`);
  console.log(`   POST   http://localhost:${PORT}/users`);
  console.log(`   PUT    http://localhost:${PORT}/users/:id`);
  console.log(`   DELETE http://localhost:${PORT}/users/:id`);
});