module.exports = {
    ADMIN: [
        "manage:users",
        "read:users",
        "edit:users",
        "delete:users",
        "view:reports"
    ],
    MANAGER: [
        "read:users",
        "edit:users",
        "view:reports"
    ],
    USER: [
        "read:profile",
        "edit:profile"
    ]
};
