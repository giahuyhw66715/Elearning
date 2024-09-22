const assignmentController = require("../controllers/assignment.controller");
const { verifyManager } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", assignmentController.getAllAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.post("/", verifyManager, assignmentController.createAssignment);
router.put("/:id", verifyManager, assignmentController.updateAssignment);
router.delete("/:id", verifyManager, assignmentController.deleteAssignment);

module.exports = router;
