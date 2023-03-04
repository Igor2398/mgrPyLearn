const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
		type: String, 
		required: true, 
		min: 3, 
		max: 20, 
		unique: true,
	},
	courseDescription: {
		type: String,
		required: true,
		min: 8,
		max: 40
	},
	img: {
		type: String,
		required: true,
	},
	courseNumber: {
		type: Number,
		required: true
	}
},
);

const Course = mongoose.model("course", courseSchema);
module.exports = { Course };

// const validate = (data) => {
// 	const schema = Joi.object({
// 		firstName: Joi.string().required().label("First Name"),
// 		lastName: Joi.string().required().label("Last Name"),
// 		userName: Joi.string().required().label("User Name"),
// 		email: Joi.string().email().required().label("Email"),
// 		password: passwordComplexity().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

