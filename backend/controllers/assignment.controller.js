const Assignment = require("../models/assignment.model");
const Course = require("../models/course.model");

const assignmentController = {
    getAllAssignments: async (req, res) => {
        try {
            const assignments = await Assignment.find();
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAssignmentById: async (req, res) => {
        try {
            const assignment = await Assignment.findById(req.params.id)
                .populate({
                    path: "submissions",
                    select: "-__v  -updatedAt",
                    populate: { path: "student", select: "fullName avatar" },
                })
                .populate("course", "students");
            res.json(assignment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createAssignment: async (req, res) => {
        const assignment = new Assignment(req.body);
        try {
            const newAssignment = await assignment.save();
            await Course.updateOne(
                { _id: req.body.course },
                { $addToSet: { assignments: newAssignment._id } }
            );
            res.status(200).json(newAssignment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateAssignment: async (req, res) => {
        try {
            const updatedAssignment = await Assignment.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedAssignment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteAssignment: async (req, res) => {
        try {
            const deletedAssignment = await Assignment.findByIdAndDelete(
                req.params.id
            );
            if (deletedAssignment.submissions.length > 0) {
                await Submission.deleteMany({ assignment: req.params.id });
            }
            await Course.updateOne(
                { _id: deletedAssignment.course },
                { $pull: { assignments: deletedAssignment._id } }
            );
            res.json(deletedAssignment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAssignmentByCourse: async (courseId) => {
        try {
            const assignments = await Assignment.find({ course: courseId });
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = assignmentController;
