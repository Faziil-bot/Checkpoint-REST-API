// Import mongoose library
const mongoose = require('mongoose');

// Define the User Schema - structure of user documents
const userSchema = new mongoose.Schema({
  // Name field - required string
  name: {
    type: String,
    required: [true, 'Name is required'], // Validation message
    trim: true // Removes whitespace from both ends
  },
  
  // Email field - required and unique
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // No duplicate emails allowed
    lowercase: true, // Converts to lowercase
    trim: true
  },
  
  // Age field - optional number
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'], // Minimum value validation
    max: [120, 'Age seems unrealistic'] // Maximum value validation
  },
  
  // Country field - optional string
  country: {
    type: String,
    trim: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Create and export the User model
// 'User' is the model name, userSchema is the schema definition
const User = mongoose.model('User', userSchema);

module.exports = User;