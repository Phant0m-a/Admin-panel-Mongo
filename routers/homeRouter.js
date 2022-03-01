const express = require('express');
const { isAuth } = require('../utils/util');
const CatModal = require('../modals/catModal');
const CourseModal = require('../modals/courseModal');
const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
    try {

        res.render('home.ejs');
    } catch (error) {
        res.send(error);
    }
})

homeRouter.get('/list', async (req, res) => {
    try {
        const cats = await CatModal.find({});

        const courses = await CourseModal.find({}).populate("category").exec();

        res.render('course/list.ejs', {
            cats,
            courses
        });
    } catch (error) {
        res.send('error' + error);
    }
})



module.exports = homeRouter;