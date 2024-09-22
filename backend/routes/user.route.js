const userController = require("../controllers/user.controller");
const {
    verifyAdmin,
    verifyManager,
    verifyToken,
} = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", verifyAdmin, userController.getAllUsers);
router.get("/search", verifyManager, userController.searchUserByUsername);
router.get("/:id", verifyManager, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyAdmin, userController.deleteUser);

module.exports = router;
