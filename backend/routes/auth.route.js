const authController = require("../controllers/auth.controller");
const { verifyAdmin, verifyToken } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/register", verifyAdmin, authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", verifyToken, authController.fetchMe);

module.exports = router;
