const User = require("../models/user");
const permissions = require("../utils/permission");
const bcrypt = require("bcryptjs");

/* ------------------ GET ALL USERS ------------------ */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false })
            .select("-password -refreshToken -__v");

        if(!users.length) {
            return res.status(404).send({
                success: false,
                message: "No users found",
            });
        }      

        return res.status(200).send({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};


/* ------------------ CREATE USER (ADMIN ONLY) ------------------ */

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).send({ success: false, message: "All fields are required" });
        }

        // Check if email already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).send({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            permissions: permissions[role] || []
        });

        return res.status(201).send({
            success: true,
            message: "User created successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            }
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};


/* ------------------ UPDATE USER ------------------ */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({
                success: false,
                message: "User ID is required",
            });
        }

        const allowedUpdates = ["name", "email", "role"];
        const data = {};

        for (let key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                data[key] = req.body[key];
            }
        }

        delete data.password;
        delete data.refreshToken;

        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select("-password -refreshToken");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (err) {
        console.error("Update User Error:", err);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};


/* ------------------ DELETE USER (ADMIN ONLY) ------------------ */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({
                success: false,
                message: "User ID is required",
            });
        }

        // Soft delete user
        const user = await User.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({ success: true, message: "User deleted successfully", user });

    } catch (err) {
        console.error("Delete User Error:", err);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};
