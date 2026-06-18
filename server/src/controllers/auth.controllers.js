
 import User from "../models/user.model.js";
 import TokenBlacklist from "../models/tokenBlacklist.model.js";
 import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
 import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ message: 'User registered successfully' ,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await
            User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.clearCookie('token');
            return res.json({ message: 'Logout successful' });
        }

        // Decode token to get expiration time
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add token to blacklist with expiration time
        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000)  // exp is in seconds, convert to milliseconds
        });

        res.clearCookie('token');
        res.json({ message: 'Logout successful and token blacklisted' });
    } catch (err) {
        console.error(err.message);
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    }
};
const getuser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export { registerUser as register, loginUser as login, logoutUser as logout, getuser as getUser };
