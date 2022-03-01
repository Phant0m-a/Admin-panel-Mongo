const express = require('express');
const CatModal = require('../modals/catModal');
const catRouter = express.Router();

// get 
catRouter.get("/", async (req, res) => {
    const list = await CatModal.find({});
    try {

        // res.status(200).send({ success: true, data: list });
        res.render('category/cats', { list })
    } catch (err) {
        res.status(300).send({ success: false, message: `something went wrong ${err}` });


    }
});

// post- add cat
catRouter.post("/", async (req, res) => {
    const {
        title
    } = req.body;
    const newCat = CatModal({
        title: title
    });

    try {
        await newCat.save();
        // res.status(200).send({ success: true, message: 'Category Added Successfully!' });
        res.redirect('/api/category/');
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
});

// update- title
catRouter.put("/", async (req, res) => {
    const {
        id,
        title
    } = req.body;

    try {
        category = await CatModal.findById(id);
        let oldTitle = category.title;
        category.title = title;
        await category.save();
        // res.status(200).send({ success: true, message: `Category title: "${oldTitle}" updated  to  "${title}" Successfully!` });
        res.redirect('/api/category/')
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
});

// delete title
catRouter.delete("/", async (req, res) => {
    const {
        id
    } = req.body;

    try {
        category = await CatModal.findById(id);
        let title = category.title;
        await CatModal.findByIdAndRemove(id);

        // res.status(200).send({ success: true, message: `Category title: "${title}" Deleted Successfully!` });
        res.redirect('/api/category/')
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }
});


module.exports = catRouter;