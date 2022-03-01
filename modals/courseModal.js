const mongoose = require('mongoose');
const schema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    thumbnail: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cat",
        required: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },

    // timestamps: true
});

const CourseModal = mongoose.model("Course", schema);
module.exports = CourseModal;