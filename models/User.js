const bcrypt = require("bcryptjs");
const ObjectID = require("mongodb").ObjectID;
const usersCollection = require("../db").db().collection("users");
const jobCollection = require("../db").db().collection("jobs");
/**
 * User constructor
 * @param {Object} userData
 */
let User = function (userData) {
  this.userData = userData;
  this.errors = [];
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    // this.cleanUp();
    // const { username, password, isRecruiter } = this.userData;
    // console.log(
    //   "inside the login function" + { username, password, isRecruiter }
    // );

    usersCollection
      .findOne({
        email: this.userData.username,
        isRecruiter: this.userData.isRecruiter,
      })
      .then(async (attemptedUser) => {
        /**
         * if there is a user with the email provided then compare the password
         */
        if (
          attemptedUser &&
          bcrypt.compareSync(this.userData.password, attemptedUser.password)
        ) {
          this.userData = attemptedUser;
          resolve("success");
        } else {
          /**
           * if there is no user with the provided email id then reject the promise.
           */
          reject("No user found");
        }
      })
      .catch((err) => {
        console.log(err);
        reject("Error occured");
      });
  });
};

User.prototype.register = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    //console.log("inside the model" + this.userData);
    // if (!this.errors.length) {
    let salt = bcrypt.genSaltSync(10);
    this.userData.password = bcrypt.hashSync(this.userData.password, salt);
    usersCollection
      .insertOne(this.userData)
      .then((info) => {
        resolve(info);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    // } else {
    //   reject(this.errors);
    // }
  });
};

User.prototype.cleanUp = function () {
  if (typeof this.userData.companyName != "string") {
    this.userData.companyName = "";
  }
  if (typeof this.userData.email != "string") {
    this.userData.email = "";
  }
  if (typeof this.userData.password != "string") {
    this.userData.password = "";
  }
  this.userData = {
    fullname: this.userData.fullname.trim().toLowerCase(),
    email: this.userData.email.trim().toLowerCase(),
    username: this.userData.email.trim().toLowerCase().split("@")[0],
    password: this.userData.password,
    isRecruiter: !!this.userData.isRecruiter,
    companyName: String(
      !!this.userData.isRecruiter && this.userData.companyName
    ),
  };
};
User.isEmailExists = function (email) {
  return new Promise(async (resolve, reject) => {
    usersCollection
      .findOne({
        email: email.trim().toLowerCase(),
      })
      .then((user) => {
        // console.log("Email is " + email + "result is " + user);
        if (user == null) resolve("Email is available to use");
        else reject("Email already exists in the database");
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = User;
