const Course = require("../models/course.model");
const User = require("../models/user.model");
const Submission = require("../models/submission.model");
const Assignment = require("../models/assignment.model");

const courseController = {
    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.find()
                .populate("department", "name")
                .populate("lecturer", "fullName role avatar");
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getCourseById: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id)
                .populate({
                    path: "lecturer",
                    select: "fullName role avatar",
                })
                .populate({
                    path: "department",
                    select: "name",
                })
                .populate({
                    path: "students",
                    select: "fullName role avatar",
                })
                .populate({
                    path: "assignments",
                    select: "title dueDate createdAt course instructions attachment",
                    options: { sort: { createdAt: -1 } },
                });
            res.json(course);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCourse: async (req, res) => {
        const course = new Course(req.body);
        try {
            const newCourse = await course.save().then((course) => {
                return Course.populate(course, [
                    {
                        path: "department",
                        select: "name",
                    },
                    {
                        path: "lecturer",
                        select: "fullName",
                    },
                ]);
            });

            await User.updateOne(
                { _id: req.body.lecturer },
                { $addToSet: { courses: newCourse._id } }
            );

            res.status(200).json(newCourse);
        } catch (error) {
            console.log("🚀 ~ error:", error);
            res.status(400).json({ message: error.message });
        }
    },

    addStudentToCourse: async (req, res) => {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.courseId,
                { $addToSet: { students: req.params.studentId } },
                { new: true }
            );

            const updatedUser = await User.findByIdAndUpdate(
                req.params.studentId,
                { $addToSet: { courses: updatedCourse._id } },
                { new: true }
            );

            res.status(200).json({
                updatedCourse: updatedCourse._id,
                updatedUser: updatedUser._id,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteStudentFromCourse: async (req, res) => {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.courseId,
                { $pull: { students: req.params.studentId } },
                { new: true }
            );
            const updatedUser = await User.findByIdAndUpdate(
                req.params.studentId,
                { $pull: { courses: updatedCourse._id } },
                { new: true }
            );
            res.status(200).json({
                updatedCourse: updatedCourse._id,
                updatedUser: updatedUser._id,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateCourse: async (req, res) => {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedCourse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteCourseDetails: async (courseId) => {
        try {
            const deletedCourseAssignments = await Assignment.find({
                course: courseId,
            });
            await Submission.deleteMany({
                assignment: { $in: deletedCourseAssignments },
            });
            await Assignment.deleteMany({ course: courseId });
        } catch (error) {
            console.log(error);
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const deletedCourse = await Course.findByIdAndDelete(req.params.id);
            await courseController.deleteCourseDetails(deletedCourse._id);
            for (let student of deletedCourse.students) {
                await User.updateOne(
                    { _id: student._id },
                    { $pull: { courses: deletedCourse._id } }
                );
            }
            res.json(deletedCourse);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = courseController;
