const User = require("../models/user.model");
const Course = require("../models/course.model");
const bcrypt = require("bcrypt");
const courseController = require("./course.controller");

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const filter = {};
            if (req.query.role) {
                filter.role = req.query.role;
            }
            const users = await User.find(filter).populate(
                "department",
                "name"
            );
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).populate(
                "department",
                "name"
            );
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchUserByUsername: async (req, res) => {
        try {
            const user = await User.findOne({
                username: { $regex: req.query.username },
            });
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (req, res) => {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (user.role === "lecturer") {
                const courses = await Course.find({ lecturer: user._id });
                for (let course of courses) {
                    await courseController.deleteCourseDetails(course._id);
                    const students = await User.find({ courses: course._id });
                    for (let student of students) {
                        await User.updateOne(
                            { _id: student._id },
                            { $pull: { courses: course._id } }
                        );
                    }
                    await Course.findByIdAndDelete(course._id);
                }
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = userController;
