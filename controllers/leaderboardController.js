const { User } = require("../models/user");

// const getLeaderboard = ("/", async(req, res) => {
//     var leaderboard = await User.find({}, {points: 1, userName: 1, _id: 0}).sort({points: -1});
//     leaderboard.forEach(element => {
//         console.log(element);
//     });
// });

async function getLeaderboard () {
    return leaderboard = await User.find({isAdmin: false}, {points: 1, userName: 1, progress: 1, _id: 1}).sort({points: -1});    
}

// const getLeaderboard = ("/", async(req, res)=> {
//     res.send(leaderboard = await User.find({isAdmin: false}, {points: 1, userName: 1, progress: 1, _id: 1}).sort({points: -1}));    
// })

const leaderboardView = ("/", async (req, res)=>{
    console.log(req.user);
    const leaderboard = await getLeaderboard();
    const gamesData = await User.find({ _id: req.session.passport.user._id }, { _id: 1, challanges: { $size: "$challanges" }, activeGames: {$size: "$challanges"} });
    const challangesCounter = gamesData[0].challanges[0];
    const gamesCounter = gamesData[0].activeGames[0];
    const currentUserProgress = req.session.passport.user.progress;
    const currentUserId = req.session.passport.user._id;
    res.render("leaderboard", { content: leaderboard, challangesCounter: challangesCounter, gamesCounter: gamesCounter, currentUserProgress: currentUserProgress, currentUserId: currentUserId });
});

module.exports = {
    leaderboardView,
    getLeaderboard
};