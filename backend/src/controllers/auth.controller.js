import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // ✅ FIX: add await
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
