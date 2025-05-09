const Task = require('../model/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/model');

// Make sure to set this in your .env file
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-fallback-secret-key';

// Store active users in memory (in production you might want to use Redis)
let activeUsers = new Map();

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
            password: hashedPassword,
            lastActive: new Date()
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
};

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

    // Update last active time
    user.lastActive = new Date();
    await user.save();

    // Create a JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        empid: user.empid, 
        name: user.name, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Add user to active users
    activeUsers.set(user._id.toString(), {
      _id: user._id,
      empid: user.empid,
      name: user.name,
      email: user.email,
      role: user.role || 'Employee',
      lastActive: new Date(),
      loginTimestamp: new Date()
    });

    // Send response with the token
    res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get current user information
const getCurrentUser = async (req, res) => {
    try {
        // req.user should be available from your auth middleware
        const userId = req.user.userId;
        
        // Find user in database
        const user = await Task.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }
        
        // Update last active time in DB and active users map
        user.lastActive = new Date();
        await user.save();
        
        if (activeUsers.has(userId.toString())) {
            const activeUser = activeUsers.get(userId.toString());
            activeUser.lastActive = new Date();
        } else {
            // Add to active users if not already there
            activeUsers.set(userId.toString(), {
                _id: user._id,
                empid: user.empid,
                name: user.name,
                email: user.email,
                role: user.role || 'Employee',
                lastActive: new Date(),
                loginTimestamp: new Date()
            });
        }
        
        // Return user data
        res.status(200).json({
            success: true,
            _id: user._id,
            empid: user.empid,
            name: user.name,
            email: user.email,
            role: user.role || 'Employee',
            lastActive: new Date()
        });
    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error when retrieving user information'
        });
    }
};

// Get all active users
const getActiveUsers = async (req, res) => {
    try {
        // Clean up inactive users (inactive for more than 1 hour)
        const now = new Date();
        for (const [userId, userData] of activeUsers.entries()) {
            const lastActiveTime = new Date(userData.lastActive);
            const diffMs = now - lastActiveTime;
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins > 60) {
                activeUsers.delete(userId);
            }
        }
        
        // Convert Map to Array for response
        const activeUsersArray = Array.from(activeUsers.values());
        
        res.status(200).json(activeUsersArray);
    } catch (err) {
        console.error('Error fetching active users:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error when retrieving active users'
        });
    }
};

// Log out user
const logoutUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Remove from active users
        if (activeUsers.has(userId.toString())) {
            activeUsers.delete(userId.toString());
        }
        
        res.status(200).json({
            success: true,
            msg: 'User logged out successfully'
        });
    } catch (err) {
        console.error('Error logging out user:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error when logging out'
        });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    getActiveUsers,
    logoutUser
};