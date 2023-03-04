const mongoose = require('mongoose')
const courseQuestionSchema = mongoose.Schema({
    contentId: {
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
    }
});

const CourseQuestion = mongoose.model("courseQuestion", courseQuestionSchema);

module.exports = { CourseQuestion };