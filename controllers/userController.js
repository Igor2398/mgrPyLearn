const { checkAuthenticated } = require("../config/auth");
const { Game } = require("../models/game");
const { Question } = require("../models/question");
const { Tip } = require("../models/tips");
const { User } = require("../models/user");
const { search } = require("../routes");
const mongoose = require("mongoose");
// const { Course } = require("../models/course");

async function getTobparData(id) {
  const gamesData = await User.find({ _id: id}, { _id: 1, challanges: 1, activeGames: {$size: "$activeGames"} });
  const challangesCounter = gamesData[0].challanges.length;
  const gamesCounter = gamesData[0].activeGames[0];
  return [challangesCounter, gamesCounter] 
}

const accountView = ("/", checkAuthenticated, async(req, res) => {
  const tips = await Tip.find({}, {});
  const random = Math.floor(Math.random() * tips.length);
  const tip = tips[random];

  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];
  
  res.render("acc", { data: { message: "Witaj, " + req.session.passport.user.firstName, picture: req.session.passport.user.profilePicture, tip: tip }, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
});


const searchUser = ("/", checkAuthenticated, async (req, res)=> {
  res.redirect("/search/firstName=" + req.body.firstName);
});

const searchView = ("/", checkAuthenticated, async (req, res)=> {
  const result = await User.find({ firstName: new RegExp(req.params.firstName, 'i' )}, {_id: 1, firstName: 1, lastName: 1, userName: 1, followers: 1, points: 1});

  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];
  // res.send(result);ś
  res.render("search", {data: { result, currentUserId: req.session.passport.user._id }, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
});

const followUser = ("/", checkAuthenticated, async (req, res)=> {
  // console.log(JSON.stringify(req.session.passport.user._id));
  if (req.body.id !== req.session.passport.user._id) {
    try {
      const currentUser = await User.findById(req.session.passport.user._id);
      const user = await User.findById(req.body.id);
      if (!user.followers.includes(req.session.passport.user._id)) {
        await currentUser.updateOne({ $push: { followings: req.body.id } });
        await user.updateOne({ $push: { followers: req.session.passport.user._id } });
        res.redirect("/search/firstName=" + req.body.firstName);
        // res.status(200).json("user has been followed");
      } else {
        res.redirect("/search/firstName=" + req.body.firstName, { message: "Juz obserwujesz tego uzytkownika" });
        // res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    // res.status(403).json("you cant follow yourself");
    res.redirect("/search/firstName=" + req.body.firstName, { message: "Nie mozesz obeserwować siebie" });
  }
});

const unfollowUser = ("/", async (req, res) => {
  if (req.body.id !== req.session.passport.user._id) {
    try {
      const user = await User.findById(req.body.id);
      const currentUser = await User.findById(req.session.passport.user._id);
      if (user.followers.includes(req.session.passport.user._id)) {
        await user.updateOne({ $pull: { followers: req.session.passport.user._id } });
        await currentUser.updateOne({ $pull: { followings: req.body.id } });
        res.redirect("/search/firstName=" + req.body.firstName);
      } else {
        res.redirect("/search/firstName=" + req.body.firstName, { message: "Nie obserwowałeś tego uzytkownika" });
        // res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Nie mozesz odobserwowac siebie");
  }
});

const challangeUser = ("/", async (req, res)=> {
  if (req.body.id !== req.session.passport.user._id) {
    try {
      const currentUser = await User.findById(req.session.passport.user._id);
      const user = await User.findById(req.body.id);

      if (!user.challanges.includes(req.session.passport.user._id)) {
        await currentUser.updateOne({ $push: { challanged: { stake: req.body.stake, id: req.body.id } } });
        await user.updateOne({ $push: { challanges: { stake: req.body.stake, id: req.session.passport.user._id } } });
        res.redirect("/search/firstName=" + req.body.firstName);
        res.status(200).json("user has been followed");
      } else {
        // res.redirect("/search/firstName=" + req.body.firstName, { message: "Juz wyzwales tego uzytkownika" });
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
    // res.redirect("/search/firstName=" + req.body.firstName, { message: "Nie mozesz obeserwować siebie" });
  }
});

const challangesView = ("/", async (req, res)=> {
  const challanges = await User.find({_id: req.session.passport.user._id }, { _id: 0, challanges: 1, progress: 1 });
  let challangingUsersIds = [];
  let challangingUsersStakes = [];
  challanges[0].challanges.forEach(element => {
    challangingUsersIds.push(element.id);
  })
  // console.log(challanges[0].challanges);
  
  const currentUserId = req.session.passport.user._id;
  // console.log(currentUserId);
  const userChallanges = await User.find( { _id: { $in: challangingUsersIds } }, {_id: 1, userName: 1, firstName: 1, lastName: 1, progress: 1 });
  // console.log(userChallanges);
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  // let dupa = userChallanges.map((item, i) => Object.assign({}, item, challanges[0].challanges[i]));
  // userChallanges.forEach((element, index) => {
  //   console.log(element._id)
  //   console.log()
  //   if(element._id == challanges[0].challanges.id){
  //     console.log("to samo")
  //   }
  // })

  res.render("challanges", { userChallanges: userChallanges, currentUserId: currentUserId, challangesCounter: challangesCounter, gamesCounter: gamesCounter, challanges: challanges });
}); 

const challangeResponse = ("/", async (req, res)=> {
  console.log("siema")
  console.log(JSON.stringify(req.body));
  if(req.body.response == "Decline"){
    if (req.body.userId !== req.session.passport.user._id) {
      try {
        const user = await User.findById(req.body.userId);
        const currentUser = await User.findById(req.session.passport.user._id);
        if (user.challanged.includes(req.session.passport.user._id)) {
          await user.updateOne({ $pull: { challanged: req.session.passport.user._id } });
          await currentUser.updateOne({ $pull: { challanges: req.body.userId } });
          res.redirect("/challanges");
        } else {
          res.redirect("/challanges", { message: "Nie obserwowałeś tego uzytkownika" });
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Nie mozesz odobserwowac siebie");
    }
  } else {
    if (req.body.userId !== req.session.passport.user._id) {
      try {
        const currentUser = await User.findById(req.session.passport.user._id);
        const user = await User.findById(req.body.userId);
        console.log("AKhsdhjas")
        // if (user.challanged.includes(req.session.passport.user._id)) {
          await User.find({ _id: req.body.userId }).updateOne({ $pull: { challanged: { id: req.session.passport.user._id } } });
          await User.find({ _id: req.session.passport.user._id }).updateOne({ $pull: { challanges: { id: req.body.userId } } });
          
          //get questions to game
          const questions = await Question.find({}, {_id: 1});
          let questionsIds = [];
          questions.forEach(element => {
            questionsIds.push(element._id);
          });
          const shuffled = questionsIds.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 8);

          await Game.insertMany({ users: [req.body.userId, req.session.passport.user._id], questions: selected, status: 0, stake: req.body.stake });
          const game = await Game.find({ users: req.session.passport.user._id }, {_id: 1}).limit(1).sort({$natural:-1});
          await currentUser.updateOne({ $push: { activeGames: game[0]._id } });
          await user.updateOne({ $push: { activeGames: game[0]._id } })
          res.redirect("/challanges");
        // } else {
        //   res.redirect("/challanges");
        //   // res.status(403).json("you allready follow this user");
        // }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      // res.status(403).json("you cant follow yourself");
      res.redirect("/challanges", { message: "Nie mozesz obeserwować siebie" });
    }
  }
  // res.redirect("/")
});

const gamesListView = ("/", async (req, res)=> {
  const userGames = await User.findById(req.session.passport.user._id , { _id: 1,  activeGames: 1 });
  let games = await Game.find({ _id: { $in: userGames.activeGames }, status: false }, {});
  // console.log(games)
  let usersToFind = [];
  games.forEach(element => {
    usersToFind.push(element.users.find( id => id != req.session.passport.user._id ));
  });
  const users = await User.find({ _id: { $in: usersToFind } }, { _id: 1, firstName: 1, lastName: 1, userName: 1, progress: 1 });
  let object = users.find( obj => obj._id == games[0].users.find( id => id != req.session.passport.user._id ));
  
  users.forEach((element, index) => {
    let user = users.find( obj => obj._id == games[index].users.find( id => id != req.session.passport.user._id ));
    let successFactor = user.progress / req.session.passport.user.progress
    let loseFactor = req.session.passport.user.progress / user.progress 

    if(successFactor > 1){
      element.successFactor = successFactor;
    } else {
      element.successFactor = 1;
    } 

    if(loseFactor > 1){
      element.loseFactor = loseFactor; 
    } else {
      element.loseFactor = 1;
    } 
  });
  
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  res.render("games-list", { games: games, users: users, currentUserId: req.session.passport.user._id, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
});


const gameSurrender = ("/", async (req, res)=> {
  console.log(req.body);
  if (req.body.userId !== req.session.passport.user._id) {
    try {
      const user = await User.findById(req.body.userId);
      const currentUser = await User.findById(req.session.passport.user._id);
      if (user.activeGames.includes(req.body.currentGameId) && currentUser.activeGames.includes(req.body.currentGameId)) {
        await user.updateOne({ $pull: { activeGames: mongoose.Types.ObjectId(req.body.currentGameId) }, $inc: { points: 100 } });
        await currentUser.updateOne({ $pull: { activeGames: mongoose.Types.ObjectId( req.body.currentGameId ) } });
        // await Game.updateOne( { $push: { winner: req.body.userId } });
        await Game.updateOne({_id: req.body.gameId }, {  status: true, $push: { winner: req.body.userId } });
        // console.log("po update user: " + user.activeGames);
        // console.log("po update currentUser: " + currentUser.activeGames);
        if(currentUser.points >= 100){
          await currentUser.updateOne({ $inc: { points: -100 } });
        } else {
          await currentUser.updateOne({ $set: { points: 0 } });
        }
        res.redirect("/games");
      } else {
        res.redirect("/games", { message: "Nie grałeś z tym uzytkownikiem" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Nie mozesz poddac gry z samym sobą");
  }
})

const gameView = ("/", async (req, res)=> {
  const game = await Game.findById(req.body.currentGameId);
  const questions = await Question.find({_id: { $in: game.questions } }, { questionText: 1, answer: 1, options: 1});

  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  res.render("game", { content: questions, gameId: req.body.currentGameId, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
});

const checkGameAnswers = ("/", async (req, res)=> {
  let points = 0;
  const object = req.body;
  // console.log(JSON.stringify(req.body))
  for (const property in object) {
    if(property != "gameId") {
      const check = await Question.find({ _id: property }, { _id: 0, answer: 1 });
      if(object[property] == check[0].answer){
        points += 10;
      } else {
        points -= 5;
      }
    }
  }
  // const currentUser = await User.findById(req.session.passport.user._id);
  //update
  await Game.updateOne({_id: req.body.gameId }, { $push: { usersPlayed: req.session.passport.user._id } });
  await Game.updateOne({_id: req.body.gameId }, { $push: { usersScores: points } });

  const game = await Game.find({ _id: req.body.gameId}, { usersPlayed: 1, usersScores: 1, stake: 1});
  
  if(game[0].usersPlayed.length == 2){
    if(game[0].usersScores[0] > game[0].usersScores[1]){
      let successFactor = user.progress / req.session.passport.user.progress
      let loseFactor = req.session.passport.user.progress / user.progress 
  
      if(successFactor > 1){
        element.successFactor = successFactor;
      } else {
        element.successFactor = 1;
      } 
  
      if(loseFactor > 1){
        element.loseFactor = loseFactor; 
      } else {
        element.loseFactor = 1;
      } 
      await Game.updateOne({_id: req.body.gameId }, { $set: { winner: game[0].usersPlayed[0], loser: game[0].usersPlayed[1] } });
      await User.updateOne({ _id: game[0].usersPlayed[0] }, { $inc: { points: game[0].stake }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
      await User.updateOne({ _id: game[0].usersPlayed[1] }, { $inc: { points: game[0].stake * (-1) }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
    } else if (game[0].usersScores[0] < game[0].usersScores[1]){
      await Game.updateOne({_id: req.body.gameId }, { $set: { winner: game[0].usersPlayed[1], loser: game[0].usersPlayed[0] } });
      await User.updateOne({ _id: game[0].usersPlayed[0] }, { $inc: { points: game[0].stake * (-1) }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
      await User.updateOne({ _id: game[0].usersPlayed[1] }, { $inc: { points: game[0].stake }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
    } else {
      await Game.updateOne({_id: req.body.gameId }, { $set: { winner: "draw" } });
      await User.updateOne({ _id: game[0].usersPlayed[0] }, { $inc: { points: 10 }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
      await User.updateOne({ _id: game[0].usersPlayed[1] }, { $inc: { points: 10 }, $pull: { activeGames: mongoose.Types.ObjectId(req.body.gameId) } });
    }
    await Game.updateOne({_id: req.body.gameId }, { status: true });
  }
  res.redirect("/games");
});

module.exports = {
  accountView,
  searchUser,
  searchView,
  followUser,
  unfollowUser,
  challangeUser,
  challangesView,
  challangeResponse,
  gamesListView,
  gameSurrender,
  gameView,
  checkGameAnswers
};