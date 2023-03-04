const { checkAuthenticated } = require("../config/auth");
const { User } = require("../models/user");
const { Course } = require("../models/course");
const { Question } = require("../models/question");
const { Content } = require("../models/courseContent");
const { object } = require("joi");
const mongoose = require("mongoose");
// var question;


async function getTobparData(id) {
  const gamesData = await User.find({ _id: id}, { _id: 1, challanges: { $size: "$challanges" }, activeGames: {$size: "$activeGames"} });
  const challangesCounter = gamesData[0].challanges[0];
  const gamesCounter = gamesData[0].activeGames[0];
  return [challangesCounter, gamesCounter] 
}


const courseProgress = ("/", async (req, res)=> {
  const currentUser = req.session.passport.user._id;

});

const courseView = ("/", async (req, res)=> {
  // const currentUser = req.session.passport.user._id;
  // console.log(req.session.passport.user.profilePicture);
  course = await Course.find({}, { courseName: 1, courseDescription: 1, img: 1, courseNumber: 1, _id: 1 });
  progress = await User.find({_id: req.session.passport.user._id }, { _id: 0, progress: 1, chaptersProgress: 1 });
 
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  const runConfetti = req.cookies["confetti"];
  res.clearCookie("confetti", { httpOnly: true });
  res.render("course", { course: course, progress: progress, challangesCounter: challangesCounter, gamesCounter: gamesCounter, runConfetti: runConfetti });
});

// const testCourseView = ("/", async (req, res)=> {
//   const currentUser = req.session.passport.user._id;
//   console.log(req.session.passport.user.profilePicture);
//   course = await Course.find({}, { courseName: 1, courseDescription: 1, img: 1, _id: 1 });
//   res.render("course", { course: course });
// });

// const courseContentView = ("/", async (req, res)=> {
//   // content = await Content.find({ courseId: req.body.id },{ chapterNumber: 1, content: 1, courseId: 1, _id: 0 });
//   content = await Content.find({ courseId: req.params.value },{ chapterNumber: 1, content: 1, courseId: 1, _id: 0 });

//   // chapters = await Content.find({ quizId: req.body.id }, { _id: 0, chapterNumber: 1 });
//   // let chaptersNumbers =  [];
//   // for(const property in chapters) {
//   //   chaptersNumbers.push(chapters[property].chapterNumber)
//   // }
//   // console.log(chapters);

//   res.render("course-content", { content: content });
// });

const courseContentView = ("/", async (req, res)=> {
  const course = await Course.find({ _id: req.params.value }, { _id: 1, courseNumber: 1 });
  const content = await Content.find({ courseId: req.params.value },{ chapterNumber: 1, content: 1, courseId: 1, code: 1, question: 1, _id: 1, url: 1 });
  const progress = await User.find({ _id: req.session.passport.user._id }, { _id: 0, chaptersProgress: 1 });
  console.log("content: " + content);
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  const courseNumber = course[0].courseNumber;
  const userProgress = progress[0].chaptersProgress[courseNumber];
  if(req.params.chapter){
    res.render("course-content", {content: content, courseNumber: courseNumber, userProgress: userProgress, selectedChapter: req.params.chapter, challangesCounter: challangesCounter, gamesCounter: gamesCounter})
  } else {
    res.render("course-content", { content: content, courseNumber: courseNumber, userProgress: userProgress, selectedChapter: userProgress, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
  }
  
});


const courseContentCheck = ("/", async (req, res)=> {
  let points = 0;
  const toCheck = await Content.find({ _id: req.body.contentId }, {_id: 0, courseId: 1, chapterNumber: 1, answer: 1});
  const course = await Course.find({ _id: toCheck[0].courseId }, { _id: 1, courseNumber: 1 });
  const progress = await User.find({ _id: req.session.passport.user._id }, { _id: 0, chaptersProgress: 1 });

  // const courseProgress = progress[0].chaptersProgress[course[0].courseNumber];

  // const chapterNumber = toCheck[0].chapterNumber;
  // console.log("Correct: " + toCheck + " answer: " +req.body.answer.toString());
  // console.log("courseNum: " + progress[0].chaptersProgress[req.body.courseNumber] + " chapNum: " + req.body.chapterNumber)

  if(toCheck[0].answer == req.body.answer.toString() && progress[0].chaptersProgress[req.body.courseNumber] == req.body.chapterNumber){
    points += 10;
    // console.log("UPDATE");
    // const currentUser = await User.findById(req.session.passport.user._id);
    // await currentUser.updateOne({ $inc: { points: 10 }, $inc: { "chaptersProgress.1": 1 }}); 
  let update = { };
  update['chaptersProgress.' + req.body.courseNumber.toString()] = 1;
  await User.updateOne({"_id": req.session.passport.user._id }, { $inc: update  }); 
  } else {
    // console.log("Zle zjebie");
    points -= 1;
  }

  res.redirect("/course/" + req.body.courseId);
});

const setChapter = ("/", async (req, res)=> {
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  res.render("course-content", { number: number, gamesCounter: gamesCounter, challangesCounter: challangesCounter });
})

const quizView = ("/", async (req, res)=> {
  const question = await Question.find({ quizId: req.body.quizId }, { questionText: 1, answer: 1, options: 1});
  const result = await Course.find({ _id: req.body.quizId }, { _id: 0, courseNumber: 1 });
  const courseNumber = result[0].courseNumber;

  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];

  res.render("quiz", { content: question, courseNumber: courseNumber, challangesCounter: challangesCounter, gamesCounter: gamesCounter });
});

const checkAnswers = ("/", async (req, res)=> {
  let points = 0;
  const data = req.body;
  for (const property in data) {
    if(property != "courseNumber") {
      const check = await Question.find({ _id: property }, { _id: 0, answer: 1 });
      if(data[property] == check[0].answer){
        points += 10;
      } else {
        points -= 5;
      }
    }
  }
  const currentUser = await User.findById(req.session.passport.user._id);
  //update user points
  if(req.session.passport.user.progress <= req.body.courseNumber){
    points = points;
    await currentUser.updateOne({ $inc: { points: points } });
  }
  //update user attempts
  let update = { };
  update['attemptsCounter.' + req.body.courseNumber.toString()] = 1;
  await User.updateOne({"_id": req.session.passport.user._id }, { $inc: update  });
  //update progress
  const requiredPoints = 10;
    if(points >= requiredPoints && req.session.passport.user.progress <= req.body.courseNumber){
    await currentUser.updateOne({ $inc: { progress: 1 } });
    res.cookie("confetti", "runConfetti", { httpOnly: true });
  }
  res.redirect("/course");
});

const instalationView = async (req, res) => {
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];
  res.render("instalation", { challangesCounter: challangesCounter, gamesCounter: gamesCounter });
}

const finalView = async (req, res) => {
  const topbarData = await getTobparData(req.session.passport.user._id);
  const challangesCounter = topbarData[0];
  const gamesCounter = topbarData[1];
  res.render("final", { challangesCounter: challangesCounter, gamesCounter: gamesCounter });
}

module.exports = {
  courseProgress,
  courseView,
  quizView,
  checkAnswers,
  courseContentView,
  setChapter,
  courseContentCheck,
  instalationView,
  finalView
};