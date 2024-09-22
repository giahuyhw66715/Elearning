const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "You are not authenticated" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid access token" });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const verifyRole = async (req, res, next, roles) => {
    verifyToken(req, res, async () => {
        const user = await User.findById(req.userId);
        const isEnoughPermission = roles.includes(user.role);
        if (!isEnoughPermission) {
            return res
                .status(403)
                .json({ message: "You don't have enough permission" });
        }
        next();
    });
};

const verifyLecturer = async (req, res, next) =>
    verifyRole(req, res, next, ["lecturer"]);

const verifyAdmin = async (req, res, next) =>
    verifyRole(req, res, next, ["admin"]);

const verifyManager = async (req, res, next) =>
    verifyRole(req, res, next, ["admin", "lecturer"]);

module.exports = {
    verifyToken,
    verifyLecturer,
    verifyAdmin,
    verifyManager,
};
