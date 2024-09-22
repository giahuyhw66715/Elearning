const Department = require("../models/department.model");

const departmentController = {
    getAllDepartments: async (req, res) => {
        try {
            const departments = await Department.find().select("id name");
            res.json(departments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDepartmentById: async (req, res) => {
        try {
            const department = await Department.findById(req.params.id);
            res.json(department);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createDepartment: async (req, res) => {
        const existedDepartment = await Department.findOne({
            name: req.body.name,
        });
        if (existedDepartment) {
            return res
                .status(400)
                .json({ message: "Department already exists" });
        }
        const department = new Department(req.body);
        try {
            const newDepartment = await department.save();
            res.status(200).json(newDepartment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateDepartment: async (req, res) => {
        try {
            const updatedDepartment = await Department.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.status(200).json(updatedDepartment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteDepartment: async (req, res) => {
        try {
            const deletedDepartment = await Department.findByIdAndDelete(
                req.params.id
            );
            res.status(200).json(deletedDepartment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = departmentController;
