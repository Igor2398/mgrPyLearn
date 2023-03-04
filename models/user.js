const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    userName: {
		type: String, 
		required: true, 
		min: 3, 
		max: 20, 
		unique: true
	},
	firstName: {
		type: String, 
		required: true, 
		min: 2, 
		max: 20
	},
    lastName: {
		type: String, 
		required: true, 
		min: 2, 
		max: 20
	},
    email: {
		type: String, 
		required: true, 
		max: 50, 
		unique: true
	},
    password: {
		type: String, 
		required: true, 
		min: 6
	},
	profilePicture: {
		type: String, 
		default: ""
	},
	followers: {
		type: Array,
		default: []
	},
	followings: {
		type: Array,
		default: [] 
	},
	challanged: [
		new Schema({
			stake: Number,
			id: String
		})
	],
	// challanged: {
	// 	type: Array,
	// 	default: []
	// },
	// challanges: {
	// 	type: Array,
	// 	default: []
	// },
	challanges: [
		new Schema({
			stake: Number,
			id: String
		})
	],
	activeGames: {
		type: Array,
		default: []
	},
	points: {
		type: Number,
		default: 0
	},
	city: {
		type: String,
		max: 50
	},
	progress: {
		type: Number,
		default: 0
	},
	chaptersProgress: {
		type: [Number],
		default: [0, 0, 0, 0, 0, 0, 0]
	},
	attemptsCounter: {
		type: [Number],
		default: [0, 0, 0, 0, 0, 0, 0]
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
	// ilosc podejsc do kursu, postepy w kazdym rozdziale, mozliwosc przystapienia do kolejnego podrozdzialu w kursie 
	// Wyzwania dzienne 
	// Powiadomienia
	// 
},
{
	timestamps: true
}
);

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		userName: Joi.string().required().label("User Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
