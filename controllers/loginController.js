const passport = require("passport");
const Joi = require("joi");
const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");

// const loginUser = ("/", async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     console.log(req.body);
//     res.redirect("/account");
//   } catch (error) {
//     console.log(`server error ${error}`);
//   }
// });

const userLogin =
  ("/",
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/",
    failureFlash: true,
  }));

// const validate = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required().label("Email"),
//     password: Joi.string().required().label("Password"),
//   });
//   return schema.validate(data);
// };

const loginView =
  ("/",
  function (req, res) {
    res.render("index");
  });

// const userLogout =
//   ("/",
//   (req, res) => {
//     req.logOut();
//     res.redirect("/");
//   });

const userLogout =
  ("/",
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

module.exports = {
  loginView,
  userLogin,
  userLogout,
};
