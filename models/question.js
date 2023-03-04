const mongoose = require('mongoose')
const questionSchema = mongoose.Schema({
    quizId: {
        type: String,
        required: true
    },
    questionText:{
        type: String, 
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    options:{
        type  :Array,
        default:[]
    }
});

const Question = mongoose.model("question", questionSchema);

module.exports = { Question };