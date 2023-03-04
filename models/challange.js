const mongoose = require('mongoose')
const challangeSchema = mongoose.Schema({
    challanging: {
        type: String,
        // required: true
    },
    challanged: {
        type: String,
        // required: true
    },
    stake: {
        type: Number,
        // required: true
    }
});

const Challange = mongoose.model("challange", challangeSchema);

module.exports = { Challange };