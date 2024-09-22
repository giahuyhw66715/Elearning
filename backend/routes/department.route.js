const departmentController = require("../controllers/department.controller");
const { verifyManager } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", verifyManager, departmentController.getAllDepartments);
router.get("/:id", verifyManager, departmentController.getDepartmentById);
router.post("/", verifyManager, departmentController.createDepartment);
router.put("/:id", verifyManager, departmentController.updateDepartment);
router.delete("/:id", verifyManager, departmentController.deleteDepartment);

module.exports = router;
