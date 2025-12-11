const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const permissions = require("../utils/permission");

/* ------------------ REGISTER ------------------ */
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send({ message: "Email already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            role,
            permissions: permissions[role]
        });

        res.status(201).send({success: true, message: "User created", user });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/* ------------------ LOGIN ------------------ */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Validate password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).send({ success: false, message: "Invalid password" });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Prepare user data for response (exclude password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isDeleted: user.isDeleted || false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // Send response
        return res.status(200).send({
            success: true,
            message: "Login successful",
            data: {
                user: userData,
                accessToken,
                refreshToken
            }
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};
/* ------------------ REFRESH TOKEN ------------------ */
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) return res.status(401).send({ message: "Token missing" });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).send({ message: "Invalid token" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        return res.status(200).send({success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/* ------------------ LOGOUT ------------------ */
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ success: false, message: "Refresh token is required" });
        }

        const user = await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ success: false, message: "Invalid refresh token" });
        }

        return res.status(200).send({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

