const mongoose = require('mongoose');
const schema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },

});

const CatModal = mongoose.model("Cat", schema);
module.exports = CatModal;