const express = require("express");
const router = express.Router();

const {
  loginView,
  userLogin,
  userLogout,
} = require("../controllers/loginController");

const {
  registerView,
  registerUser,
} = require("../controllers/registerController");

const {
  leaderboardView,
  getLeaderboard,
} = require("../controllers/leaderboardController");

const {
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
} = require("../controllers/userController");

const {
  courseProgress,
  courseView,
  quizView,
  checkAnswers,
  courseContentView,
  setChapter,
  courseContentCheck,
  instalationView,
  finalView
} = require("../controllers/courseController");

const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");

//user login routes
router.get("/", checkNotAuthenticated, loginView);
router.post("/api/login", checkNotAuthenticated, userLogin);
router.delete("/api/logout", checkAuthenticated, userLogout);

//register routes
router.get("/register", checkNotAuthenticated, registerView);
router.post("/api/register", checkNotAuthenticated, registerUser);

//account routes
router.get("/account", checkAuthenticated, accountView);

//leaderboard routes
router.get("/leaderboard", checkAuthenticated, leaderboardView);
router.post("/api/leaderboard", getLeaderboard);

//search routes
router.post("/api/search", checkAuthenticated, searchUser);
router.get("/search/firstName=:firstName", checkAuthenticated, searchView);


//course routes
router.post("/api/course", checkAuthenticated, courseProgress);
router.get("/course", checkAuthenticated, courseView);
router.get("/course/:value/:chapter", checkAuthenticated, courseContentView);
router.get("/course/:value", checkAuthenticated, courseContentView);
router.post("/api/check_quiz_answer", checkAuthenticated, courseContentCheck);
router.get("/instalation", checkAuthenticated, instalationView);
router.get("/final", checkAuthenticated, finalView);
// router.get("/kafelki", checkAuthenticated, testCourseView);

//content routes
router.post("/content", checkAuthenticated, courseContentView);
router.post("/api/chapter", checkAuthenticated, setChapter);

//(un)follow users
router.put("/api/follow", checkAuthenticated, followUser);
router.put("/api/unfollow", checkAuthenticated, unfollowUser);

//challange user
router.put("/api/challange", checkAuthenticated, challangeUser);
router.get("/challanges", checkAuthenticated, challangesView);
router.put("/api/challange/response", checkAuthenticated, challangeResponse);

//games
router.get("/games", checkAuthenticated, gamesListView);
router.put("/api/surrender", checkAuthenticated, gameSurrender);
router.post("/game", checkAuthenticated, gameView);
router.put("/api/result", checkAuthenticated, checkGameAnswers);

//quiz routes
router.post("/quiz", checkAuthenticated, quizView);
router.put("/api/check", checkAuthenticated, checkAnswers);

module.exports = router;
