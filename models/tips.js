const mongoose = require('mongoose')
const tipSchema = mongoose.Schema({
    tipTitle: {
        type: String,
        required: true
    },
    tipText: {
        type: String, 
        required: true
    }
});

const Tip = mongoose.model("tip", tipSchema);

module.exports = { Tip };