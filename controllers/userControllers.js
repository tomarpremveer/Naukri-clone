const User = require("../models/User");
exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = {
        username: user.userData.username,
        _id: user.userData._id,
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (e) {
      req.flash("errors", e);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};
exports.checkForEmail = function (req, res) {
  User.isEmailExists(req.body.email)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.register = function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        username: user.userData.username,
        _id: user.userData._id,
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (e) {
        req.flash("regErrors", e);
      });
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.isLoggedIn = function (req, res, next) {
  if (req.visitorId != 0) {
    next();
  } else {
    req.flash("errors", "You must be logged in to carry out that operation");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};
exports.home = function (req, res) {
  res.render("index", { title: "Naukri-Clone" });
};
