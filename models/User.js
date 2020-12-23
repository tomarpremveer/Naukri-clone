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
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ username: this.userData.username })
      .then((attemptedUser) => {
        //console.log(attemptedUser);
        if (
          attemptedUser &&
          bcrypt.compareSync(this.userData.password, attemptedUser.password)
        ) {
          this.userData = attemptedUser;
          //let jobs = jobCollection().toArray();
          resolve("success");
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
    //console.log("inside the model" + this.userData.email);
    // if (!this.errors.length) {
    let salt = bcrypt.genSaltSync(10);
    this.userData.password = bcrypt.hashSync(this.userData.password, salt);
    usersCollection
      .insertOne(this.userData)
      .then((info) => {
        resolve(info);
      })
      .catch((err) => {
        //console.log(err);
        reject(err);
      });
    // } else {
    //   reject(this.errors);
    // }
  });
};

User.prototype.cleanUp = function () {
  if (typeof this.userData.username != "string") {
    this.userData.username = "";
  }
  if (typeof this.userData.email != "string") {
    this.userData.email = "";
  }
  if (typeof this.userData.password != "string") {
    this.userData.password = "";
  }
  this.userData = {
    username: this.userData.username.trim().toLowerCase(),
    email: this.userData.email.trim().toLowerCase(),
    password: this.userData.password,
    isRecruiter: !!this.data.isRecruiter,
  };
};
User.prototype.isEmailExists = function (email) {
  return new Promise(async (resolve, reject) => {
    let isExists = await usersCollection.find({ email: email });
    if (!!isExists) {
      reject("Username/Email already exists in the database");
    } else {
      resolve("Username/Email is available.");
    }
  });
};
module.exports = User;
