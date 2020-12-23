const jobCollection = require("../db").db().collection("jobs");
const appliedJobsCollection = require("../db").db().collection("appliedJobs");
const ObjectID = require("mongodb").ObjectID;
let Job = function (jobData) {
  this.jobData = jobData;
};
Job.prototype.cleanUp = function () {
  this.jobData = {
    title: this.jobData.title.trim(),
    description: this.jobData.description.trim(),
    postedDate: this.jobData.postedDate,
    expireDate: this.jobData.expireDate,
  };
};
Job.prototype.addNewJob = function () {
  return new Promise((resolve, reject) => {
    //this.cleanUp();
    jobCollection
      .insertOne(this.jobData)
      .then((info) => {
        resolve({ info: info, success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
Job.viewCandidates = function (jobId, recruiterId) {
  return new Promise(async (resolve, reject) => {
    var candidates = await appliedJobsCollection.find({
      jobId: ObjectID(jobId),
      recruiterId: ObjectID(recruiterId),
    });
    if (candidates.length > 0) {
      resolve(candidates);
    } else {
      reject("No candidate have applied for this job");
    }
  });
};
Job.viewJob = function (jobId) {
  return new Promise((resolve, reject) => {
    jobCollection
      .findOne({ _id: ObjectID(jobId) })
      .then((job) => {
        //console.log(job);
        resolve(job);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
Job.applyForJob = function (jobId, studentId, recruiterId) {
  return new Promise((resolve, reject) => {
    appliedJobsCollection
      .insertOne({
        jobId: ObjectID(jobId),
        studentId: ObjectID(studentId),
        recruiterId: ObjectID(recruiterId),
      })
      .then((info) => {
        resolve({ success: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
Job.getJobs = function (visitorId, isRecruiter) {
  return new Promise(async (resolve, reject) => {
    if (isRecruiter) {
      /**
       * If the attempted user(user tring to log In) is a recruiter
       * then retrieve the jobs posted by the recruiter.
       */
      let postedjobs = await jobCollection
        .find({
          recruiterId: ObjectID(visitorId),
        })
        .toArray();
      resolve(postedjobs || []);
    } else {
      let availableJobs = await jobCollection.find({}).toArray();
      console.log(availableJobs);
      resolve(availableJobs);
    }
    reject("Error in Fetching jobs");
  });
};
module.exports = Job;
