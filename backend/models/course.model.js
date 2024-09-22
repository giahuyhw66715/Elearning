const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: String,
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        lecturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        assignments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Assignment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", courseSchema);
