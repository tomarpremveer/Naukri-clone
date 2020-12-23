const User = require("../models/User");

exports.login = function (req, res) {
  const { username, password, isRecruiter } = req.body;
  var user = new User({
    username,
    password,
    isRecruiter: !!isRecruiter,
  });
  user
    .login()
    .then(function (jobs) {
      // console.log(jobs);
      req.session.user = {
        username: user.userData.username,
        _id: user.userData._id,
        fullname: user.userData.fullname,
        isRecruiter: user.userData.isRecruiter,
      };
      req.session.save(function () {
        res.redirect("/jobs");
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
  User.isEmailExists(req.body.value)
    .then((success) => {
      res.write("hi");
      res.end();
      // res.json({ isAvailable: "yes" });
    })
    .catch((err) => {
      res.write("hi");
      res.end();
      //res.json({ isAvailable: "no" });
    });
};
exports.register = function (req, res) {
  var user = new User(req.body);
  user
    .register()
    .then((info) => {
      req.session.user = {
        username: user.userData.username,
        _id: info.ops[0]._id,
        fullname: user.userData.fullname,
        isRecruiter: user.userData.isRecruiter,
      };
      req.session.save(function () {
        res.redirect("/jobs");
      });
    })
    .catch((regErrors) => {
      // regErrors.forEach(function (e) {
      //   req.flash("regErrors", e);
      // });
      console.log(regErrors);
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
exports.index = function (req, res) {
  if (req.visitorId == 0) {
    res.render("index", { title: "Naukri-Clone" });
  } else {
    res.redirect("/jobs");
  }
  //res.render("index", { title: "Naukri-Clone" });
};
