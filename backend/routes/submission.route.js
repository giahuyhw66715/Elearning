const submissionController = require("../controllers/submission.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", submissionController.getAllSubmissions);
router.get("/:id", submissionController.getSubmissionById);
router.post("/", verifyToken, submissionController.createSubmission);
router.put("/:id", verifyToken, submissionController.updateSubmission);
router.delete("/:id", verifyToken, submissionController.deleteSubmission);

module.exports = router;
