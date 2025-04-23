const Task = require('../model/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/model');

// Make sure to set this in your .env file
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-fallback-secret-key';

const registerUser = async (req, res) => {
    const { empid, name, email, password } = req.body;

    try {
        // Check for existing user
        const checkExistingUser = await Task.findOne({
            $or: [{ empid }, { email }]
        });

        if (checkExistingUser) {
            return res.status(400).json({
                msg: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newlyCreatedUser = new Task({
            empid,
            name,
            email,
            password: hashedPassword
        });

        await newlyCreatedUser.save();

        // Generate token for new user
        const accessToken = jwt.sign(
            {
                userId: newlyCreatedUser._id,
                empid: newlyCreatedUser.empid,
                name: newlyCreatedUser.name,
                email: newlyCreatedUser.email,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            msg: 'User registered successfully',
            accessToken
        });

    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({
            msg: 'An error occurred during registration'
        });
    }
}; // Assuming you're using a User model

const loginUser = async (req, res) => {
  try {
    const { empid, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ empid });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ empid: user.empid, name: user.name, email: user.email }, 'secretKey', { expiresIn: '1h' });

    // Send response with the token
    res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// === authController.js ===
// Add this to your existing auth controller

// Get current user information
const getCurrentUser = async (req, res) => {
    try {
        // req.user should be available from your auth middleware
        const userId = req.user.id;
        
        // Find user in database (using your existing Task model)
        const user = await Task.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }
        
        // Get last active time
        const lastActive = new Date();
        
        // Update last active time in DB
        user.lastActive = lastActive;
        await user.save();
        
        // Return user data
        res.status(200).json({
            success: true,
            empid: user.empid,
            name: user.name,
            email: user.email,
            role: user.role || 'Employee',
            lastActive: lastActive
        });
    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error when retrieving user information'
        });
    }
};

module.exports = { registerUser, loginUser, getCurrentUser };