const mongoose = require("mongoose");

const courseContentSchema = new mongoose.Schema({
    courseId: {
		type: String, 
		required: true, 
	},
	chapterNumber: {
		type: Number,
		required: true,
	},
	content: {
		type: String,
		default: 0,
        required: true
	},
	url: {
		type: String
	},
	code: {
		type: [String],
		// requried: true
	},
	question: {
		type: String,
		// required: true
	},
	answer: {
		type: String,
		// required: true
	}
},
);

const Content = mongoose.model("content", courseContentSchema);

module.exports = { Content };