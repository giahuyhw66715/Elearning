const Submission = require("../models/submission.model");
const Assignment = require("../models/assignment.model");

const submissionController = {
    getAllSubmissions: async (req, res) => {
        try {
            const submissions = await Submission.find();
            res.json(submissions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSubmissionById: async (req, res) => {
        try {
            const submission = await Submission.findById(req.params.id);
            res.json(submission);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createSubmission: async (req, res) => {
        const submission = new Submission(req.body);
        try {
            const newSubmission = await submission.save();
            await Assignment.updateOne(
                { _id: req.body.assignment },
                { $addToSet: { submissions: newSubmission._id } }
            );
            res.status(200).json(newSubmission);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateSubmission: async (req, res) => {
        try {
            const updatedSubmission = await Submission.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedSubmission);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteSubmission: async (req, res) => {
        try {
            const deletedSubmission = await Submission.findByIdAndDelete(
                req.params.id
            );
            res.json(deletedSubmission);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = submissionController;
