const Task = require('../model/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
};

const loginUser = async (req, res) => {
    try {
        const { empid, password } = req.body;

        // Find user
        const user = await Task.findOne({ empid });

        if (!user) {
            return res.status(400).json({
                msg: 'User not found. Kindly register first.'
            });
        }

        // Verify password
        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) {
            return res.status(400).json({
                msg: 'Invalid Password'
            });
        }

        // Generate token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                empid: user.empid,
                name: user.name,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            msg: 'User logged in successfully',
            accessToken
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            msg: 'An error occurred during login'
        });
    }
};

module.exports = { registerUser, loginUser };