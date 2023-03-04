const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const connection = require("./db");
const routes = require("./routes/index");
const methodOverride = require("method-override"); //zeby logout dzialal
const { User } = require("./models/user");
const { Question } = require("./models/question");
const { Content } = require("./models/courseContent");
const { Course } = require("./models/course");
const { Tip } = require("./models/tips");
const { CourseQuestion } = require("./models/courseQuestion");
const { Game } = require("./models/game");
const { Challange } = require("./models/challange");
const { urlencoded } = require("express");
const flash = require("express-flash");
const passport = require("passport");

const bcrypt = require("bcrypt")

// AdminBro configuration
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
AdminBro.registerAdapter(AdminBroMongoose);

const AdminBroOptions = {
  resources: [Question, User, Content, Course, Tip, Game],
  rootPath: '/admin',
};

const adminBro = new AdminBro(AdminBroOptions);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: 'admin-bro',
  cookiePassword: 'dissyndiabla',
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user && user.isAdmin) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        return user;
      }
    }
    return false;
  }, 
}, null, 
{
  resave: false,
  saveUninitialized: true,
}
);




const initializePassport = require('./config/passport');
initializePassport(
  passport,
  email => User.find(user => user.email === email),
  profilePicture => User.find(user => user.profilePicture === profilePicture),
  id => User.find(user => user.id === id)
)

const app = express();

app.use(adminBro.options.rootPath, router);

app.use(cookieParser("test"));
app.use(
  session({
    secret: "test",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge  : 30*60*1000
    },
  })
);

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});


app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

require("dotenv").config();
connection();

app.use(express.static(path.join(__dirname, "public")));
app.use('/public/css', express.static('/public/css'));
app.use(express.static('public/css'));
app.use(express.static(__dirname + "/components"));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());
// app.use(helmet());
app.use(morgan("common"));
app.use(flash());

app.use("/", routes);

const port = process.env.PORT || 8080;
const server = app.listen(port, console.log(`Listening on port ${port}...`));

module.exports = server;