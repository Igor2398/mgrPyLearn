function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/account");
  }
  next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}