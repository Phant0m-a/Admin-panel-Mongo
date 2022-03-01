const express = require('express');
const LectureModal = require('../modals/lectureModal');
const CourseModal = require('../modals/courseModal');
const {
    saveVideo,
    saveImage,
    saveFile,
    deleteFile
} = require('../utils/file_handler');
const lectureRouter = express.Router();

// get
lectureRouter.get("/", async (req, res) => {
   
    try {
      
        const courses = await CourseModal.find({});
        const lecture = await LectureModal.find({}).populate("course").exec();

        res.render('lecture/lecture',{ 
            lecture,
            courses})
        // res.status(200).send({ success: true, data: list });
       
    } catch (err) {
        res.status(300).send({ success: false, message: `something went wrong ${err}` });

    }
});

// post
lectureRouter.post("/", async (req, res) => {

    try {
        const {
            course,
            title,
            description
        } = req.body;
       
        let thumbnail='';

        if (req.files && req.files.thumbnail) {
            let url = await saveImage(req.files.thumbnail);
            if (url != false)
                thumbnail = url;
        }

        const newLecture = LectureModal({
            course : course,
            title : title,
            imgUrl : thumbnail,
            description : description
        });
        await newLecture.save();
        res.redirect('/api/lecture/')
        // res.status(200).send({ success: true, message: 'New Lecture Added Successfully!' });
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
});

// put update lecture
lectureRouter.put("/", async (req, res) => {

    try {
        const {
            id,
            course,
            title,
            description
        } = req.body;
       
        let lecture = await LectureModal.findById(id);

        if (req.files && req.files.imgUrl) {
            await deleteFile(lecture.imgUrl);
            let url = await saveImage(req.files.imgUrl);
            if (url != false)
            lecture.imgUrl = url;
        }
        
        lecture.course = course;
        lecture.title = title;
        lecture.description = description;
     
        await lecture.save();
        // res.status(200).send({ success: true, message:`Lecture Edited id:${id} Successfully!` });
        res.redirect(`/api/course/${course}`)
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
});

// delete - delete course
lectureRouter.delete('/', async (req, res) => {
    let {
        id,
        course
    } = req.body;

    try {
        const lecture = await LectureModal.findById(id);
        await deleteFile(lecture.imgUrl);
        await LectureModal.findByIdAndDelete(id);
        res.status(200).send({ success: true, message: `Lecture Deleted id:${id} Successfully!` });
        res.redirect(`/api/course/${course}`)
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
})

module.exports = lectureRouter;


