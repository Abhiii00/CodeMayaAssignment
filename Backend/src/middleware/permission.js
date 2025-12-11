export const requirePermission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).send({ success: false, message: "Unauthorized" });
            }

            if (!req.user.permissions || !req.user.permissions.includes(permission)) {
                return res.status(403).send({ success: false, message: "Forbidden: Missing Permission" });
            }

            next();
        } catch (error) {
            console.error("Permission middleware error:", error);
            return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
        }
    };
};
