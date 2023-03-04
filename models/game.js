const mongoose = require('mongoose')
const gameSchema = mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    result: {
        type: String, 
        // required: true
    },
    questions: {
        type: Array,
        required: true
    },
    usersPlayed: {
        type: Array
    },
    usersScores: {
        type: Array
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    winner: {
        type: String
    },
    loser: {
        type: String
    },
    stake: {
        type: Number,
        required: true
    }
});

const Game = mongoose.model("game", gameSchema);

module.exports = { Game };