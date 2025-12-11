const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "MANAGER", "USER"],
        default: "USER"
    },
    permissions: {
        type: [String]
    },
    refreshToken: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
