const usersCollection = require("../db").db().collection("users");
/**
 * User constructor
 * @param {Array} userData
 */
let User = function (userData) {
  this.userData = userData;
  this.errors = [];
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.userData.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          this.userData = attemptedUser;
          let jobsApplied = usersCollection
            .aggregate([
              {
                $match: {},
              },
            ])
            .toArray();
          resolve(jobsApplied);
        }
      })
      .catch(() => reject("Error occured"));
  });
};

User.prototype.register = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10);
      this.userData.password = bcrypt.hashSync(this.userData.password, salt);
      usersCollection.insertOne(this.userData);
      resolve();
    } else {
      reject(this.errors);
    }
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
  };
};
