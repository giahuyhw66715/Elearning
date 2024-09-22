const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        instructions: String,
        dueDate: Date,
        attachment: String,
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        submissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Submission",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
