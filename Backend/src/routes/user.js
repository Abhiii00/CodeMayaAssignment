const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controller/user");

router.get("/getUser", requireAuth, requirePermission("read:users"), getUsers);
router.post("/createNewUser", requireAuth, requirePermission("manage:users"), createUser);
router.patch("/updateUser/:id", requireAuth, requirePermission("edit:users"), updateUser);
router.delete("/deleteUser/:id", requireAuth, requirePermission("delete:users"), deleteUser);

module.exports = router;
