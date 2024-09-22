const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authController = {
    register: async (req, res) => {
        const { username, fullName, email, password, department, role } =
            req.body;

        // Check if all required fields are provided
        if (
            !username ||
            !fullName ||
            !password ||
            !department ||
            !role ||
            !email
        ) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
            department,
            role,
        });

        try {
            await user.save();
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );
            res.json({ accessToken, refreshToken });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res
                    .status(401)
                    .json({ message: "Username or password is incorrect" });
            }
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );
            res.json({ accessToken, refreshToken });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Invalid refresh token" });
            }
            const newAccessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
            );
            res.json({ accessToken: newAccessToken });
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    },

    fetchMe: async (req, res) => {
        try {
            const user = await User.findById(req.userId).populate([
                {
                    path: "courses",
                    select: "title image students createdAt",
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        {
                            path: "department",
                            select: "name",
                        },
                        {
                            path: "lecturer",
                            select: "fullName",
                        },
                    ],
                },
                {
                    path: "department",
                    select: "name",
                },
            ]);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = authController;
