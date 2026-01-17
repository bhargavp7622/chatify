import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { ENV } from '../lib/env.js';

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

        if (newUser) {
            const saveUser = await newUser.save();
            generateToken(saveUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            // send a welcome email
            try{
                await sendWelcomeEmail(saveUser.email, saveUser.fullName, ENV.CLIENT_URL);
            }catch(error){

            }
        }else{
            res.status(400).json({ message: "Invalid user data" });
        }

        // await newUser.save();



    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try{    
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials"});

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    }catch(error){
        res.status(500).json({ message: "Internal server error"});
    }
}

export const logout = async (_, res) => {
    res.cookie("jwt", "", {maxAge: 0})
    res.status(200).json({ message: "Logged out successfully"});
}
