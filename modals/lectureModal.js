const mongoose = require('mongoose');
const schema = mongoose.Schema({

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    title: {
        type: String,
        required: true
    },
    imgUrl: {
        type:String,
        default:''
    },
    description: {
        type:String,
        default:''
    },

    // timestamps: true
});

const LectureModal = mongoose.model("Lecture", schema);
module.exports = LectureModal;