const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to validate user data
const validateUserData = (data) => {
    const errors = [];
    
    if (!data.name || !validator.isLength(data.name, { min: 3, max: 50 })) {
        errors.push('Name must be between 3 and 50 characters.');
    }
    if (!data.email || !validator.isEmail(data.email)) {
        errors.push('Invalid email address.');
    }
    if (!data.password || !validator.isStrongPassword(data.password)) {
        errors.push('Password must be strong (at least 8 characters, including uppercase, lowercase, numbers, and symbols).');
    }
    if (data.mob_no && !validator.isMobilePhone(data.mob_no, 'any')) {
        errors.push('Invalid mobile number.');
    }
    if (data.photo_url && !validator.isURL(data.photo_url)) {
        errors.push('Invalid photo URL.');
    }

    return errors;
};

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, mob_no, photo_url } = req.body;
        const validationErrors = validateUserData({ name, email, password, mob_no, photo_url });

        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, mob_no, photo_url });

        res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: "User login successful", user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, mob_no, photo_url } = req.body;

        const validationErrors = validateUserData({ name, email, password, mob_no, photo_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (mob_no) user.mob_no = mob_no;
        if (photo_url) user.photo_url = photo_url;

        await user.save();
        res.json({ message: 'User updated successfully!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
