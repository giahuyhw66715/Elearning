const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectToMongo = require("./config/db.config");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const multer = require("multer");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const departmentRoute = require("./routes/department.route");
const assignmentRoute = require("./routes/assignment.route");
const courseRoute = require("./routes/course.route");
const submissionRoute = require("./routes/submission.route");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Set up env
dotenv.config();

const app = express();

// Connect to MongoDB
connectToMongo();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/departments", departmentRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/assignments", assignmentRoute);
app.use("/api/v1/submissions", submissionRoute);
app.use("/public", express.static("uploads"));
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
    res.status(200).json({ file: req.file });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
