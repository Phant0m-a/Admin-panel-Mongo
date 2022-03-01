const express = require('express');
const CatModal = require('../modals/catModal.js');

const CourseModal = require('../modals/courseModal');
const LectureModal = require('../modals/lectureModal');
const {
    saveVideo,
    saveImage,
    saveFile,
    deleteFile
} = require('../utils/file_handler');

const courseRouter = express.Router();

//  promises 
let newPromise =  new Promise((resolve, reject)=>{
    let item1 = 'a';
    let item2 = 'a';
    if(item1 === item2){
        resolve('passed!');
    }else{
        reject('failed!')
    }   
    })

let secondPromise = ()=>{
    return new Promise((resolve, reject)=>{
        let msg = 'hey im the item!'
        resolve(msg)
    });
}


newPromise.then((success)=>{
    console.log(success)
}).then(secondPromise).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})




// get - Get course by id
courseRouter.get("/:id", async (req, res) => {
    let id = req.params.id;
  
    try {
       
        const lecture = await LectureModal.find({course :id});
        const cats = await CatModal.find({});
        const course = await CourseModal.findById(id).populate("category").exec();

        res.render('course/edit_course', {
            lecture,
            cats,
            course
        });

        // res.status(200).send({ success: true, data: courses });
    } catch (err) {
        console.log(err);
        res.status(300).send({ success: false, message: `something went wrong ${err}` });

    }
});

// post add course
courseRouter.post("/", async (req, res) => {
    const {
        title,
        description,
        category,
        enabled,
        price
    } = req.body;

    let thumbnail = '';
    try {
        if (req.files && req.files.thumbnail) {

            let url = await saveImage(req.files.thumbnail);
            if (url != false)
                thumbnail = url;
        }
        const newCourse = CourseModal({
            title: title,
            description: description,
            thumbnail: thumbnail,
            category: category,
            enabled: enabled,
            price: price
        });
        await newCourse.save();
        // res.status(200).send({ success: true, message: 'Course Added Successfully!' });
        res.redirect('/api/home/list');
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }

});

// put - edit course
courseRouter.put("/", async (req, res) => {
    let {
        id,
        title,
        description,
        category,
        enabled,
        price
    } = req.body;

    
    try {
        let course = await CourseModal.findById(id);
        if (req.files && req.files.thumbnail) {

            await deleteFile(course.thumbnail);
            let url = await saveImage(req.files.thumbnail);
            if (url != false){
                course.thumbnail = url;
            }
               
        }
        enabled = enabled=='true'? true : false;
     
        course.title = title ?? course.title;
        course.description = description ?? course.description;
        course.category = category ?? course.category;
        course.enabled = enabled ?? course.enabled;
        course.price = price ?? course.price;

        await course.save();
        // res.status(200).send({ success: true, message: `Course Edited id:${id} Successfully!` });
        res.redirect(`/api/course/${id}`)
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }

});

// delete - delete course
courseRouter.delete('/', async (req, res) => {
    let {
        id
    } = req.body;

    try {
        const course = await CourseModal.findById(id);
        const lecture = await LectureModal.findById(id);
        await deleteFile(lecture.thumbnail);
        await LectureModal.findOneAndDelete({ course: id });
        await deleteFile(course.thumbnail);
        await CourseModal.findByIdAndDelete(id);
        res.status(200).send({ success: true, message: `Course Deleted id:${id} Successfully!` });
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
})


module.exports = courseRouter;