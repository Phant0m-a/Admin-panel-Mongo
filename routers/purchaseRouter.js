const express = require('express');
const UserModal = require('../modals/userModal');
const CourseModal = require('../modals/courseModal');
const CatModal = require('../modals/catModal');
const PurchaseModal = require('../modals/purchaseModal');
const {
    saveVideo,
    saveImage,
    saveFile,
    deleteFile
} = require('../utils/file_handler');
const purchaseRouter = express.Router();


// get - All Purchases
purchaseRouter.get("/", async (req, res) => {

    try {
        let users = await UserModal.aggregate([
            {
                $lookup: {
                    from: 'purchases',
                    "localField": "_id",
                    "foreignField": "user",
                    "as": "purchases"
                }
            }
        ]);

        users = await CourseModal.populate(users, { path: "purchases.products.course" });
        users = await CatModal.populate(users, { path: "purchases.products.category" });
 
        // res.status(200).send({ success: true, data: list });
        res.render('purchase/purchase', { users })
    } catch (err) {
        res.status(300).send({ success: false, message: `something went wrong ${err}` });

    }
});


// post add purchase
purchaseRouter.post("/", async (req, res) => {
    const {
        user,
        course,
        category,
        price
    } = req.body;

    try {
        const newPurchase = PurchaseModal({
            user: user,
            totalPrice: price,
            products: [{
                course: course,
                category: category,
                price: price
            }]
        });
        await newPurchase.save();
        res.status(200).send({ success: true, message: 'Purchase Added Successfully!' });
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }

});


// put - add purchase in existing purchases
purchaseRouter.put("/id", async (req, res) => {
    let {
        id,
        course,
        category,
        price
    } = req.body;

    try {
        const purchase = await PurchaseModal.findById(id);
        purchase.totalPrice = purchase.totalPrice + parseInt(price);
        purchase.products.push({
            course: course,
            id: id,
            price: price,
            category: category,
        })
        await purchase.save();
        res.status(200).send({ success: true, message: `One purchase pushed in purchase id:${id} updated Successfully!` });
    }
    catch (err) {
        res.status(300).send({ success: false, message: `something went wrong! ${err}` });
    }

});


// delete one purchase
purchaseRouter.delete("/id", async (req, res) => {
    const {
        id,
        index
    } = req.body;
    const purchase = await PurchaseModal.findById(id);

 
    try {
        purchase.totalPrice = purchase.totalPrice = purchase.products[parseInt(index)].price;
        purchase.products.splice(parseInt(index), 1);

        await purchase.save();

        res.status(200).send({ success: true, message: `1 Purchase deleted Successfully! with id:${id} and index:${index}` });
    } catch (error) {
        res.status(300).send({ success: false, message: `something went wrong! ${error}` });
    }

});


// delete whole purchase
purchaseRouter.delete("/", async (req, res) => {
    const {
        id
    } = req.body;


    try {
        await PurchaseModal.findByIdAndDelete(id);

        res.status(200).send({ success: true, message: `Full Purchase deleted Successfully! with id:${id}` });
    } catch (error) {
        res.status(300).send({ success: false, message: `something went wrong! ${error}` });
    }

});

module.exports = purchaseRouter;