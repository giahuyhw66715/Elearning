const courseController = require("../controllers/course.controller");
const { verifyManager, verifyToken } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", verifyToken, courseController.getAllCourses);
router.get("/:id", verifyToken, courseController.getCourseById);
router.post("/", verifyManager, courseController.createCourse);
router.put("/:id", verifyManager, courseController.updateCourse);
router.delete("/:id", verifyManager, courseController.deleteCourse);
router.post(
    "/:courseId/students/:studentId",
    verifyManager,
    courseController.addStudentToCourse
);
router.delete(
    "/:courseId/students/:studentId",
    verifyManager,
    courseController.deleteStudentFromCourse
);

module.exports = router;
