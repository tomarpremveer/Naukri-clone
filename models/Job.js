const jobCollection = require("../db").db().collection("jobs");
const usersCollection = require("../db").db().collection("users");
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
  //console.log("job" + jobId, +"recr" + recruiterId);
  return new Promise(async (resolve, reject) => {
    var candidates = await appliedJobsCollection
      .aggregate([
        {
          $match: {
            jobId: ObjectID(jobId),
            recruiterId: ObjectID(recruiterId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "info",
          },
        },
      ])
      .toArray();
    // console.log(candidates);
    //console.log(candidates[1].candidates);
    if (candidates.length > 0) {
      resolve(candidates);
    } else {
      resolve([]);
    }
    reject("Some error occured");
  });
};
Job.viewJob = function (jobId) {
  return new Promise((resolve, reject) => {
    jobCollection
      .findOne({ _id: ObjectID(jobId) })
      .then((job) => {
        //console.log("the job" + job);
        resolve(job);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
Job.applyForJob = function (jobId, studentId, recruiterId) {
  return new Promise(async (resolve, reject) => {
    /**
     * First check whether the user has already applied for the job or not.
     */
    let hasApplied = await appliedJobsCollection.findOne({
      jobId: ObjectID(jobId),
      studentId: ObjectID(studentId),
      recruiterId: ObjectID(recruiterId),
    });
    console.log("hasApplied" + hasApplied);
    if (hasApplied != null) {
      reject("You have already applied for this job.");
    } else {
      appliedJobsCollection
        .insertOne({
          jobId: ObjectID(jobId),
          studentId: ObjectID(studentId),
          recruiterId: ObjectID(recruiterId),
          appliedOn: new Date().toJSON().slice(0, 10),
        })
        .then((info) => {
          resolve({ success: true });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    }
  });
};
Job.getJobs = function (visitorId, isRecruiter) {
  return new Promise(async (resolve, reject) => {
    if (isRecruiter) {
      /**
       * If Logged In user is the recruiter then fetch the jobs posted by the recruiter.
       */
      let postedjobs = await jobCollection
        .find({
          recruiterId: ObjectID(visitorId),
        })
        .toArray();
      resolve(postedjobs || []);
    } else {
      /**
       * If Logged In user is the student then fetch the available jobs
       */
      let availableJobs = await jobCollection.find({}).toArray();
      //console.log(availableJobs);
      resolve(availableJobs);
    }
    reject("Error in Fetching jobs");
  });
};
Job.getAppliedJobs = function (visitorId) {
  return new Promise(async (resolve, reject) => {
    let appliedJobs = await appliedJobsCollection
      .aggregate([
        {
          $match: { studentId: ObjectID(visitorId) },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "appliedJobs",
          },
        },
      ])
      .toArray();
    // console.log(appliedJobs[0].appliedJobs);
    resolve(appliedJobs[0]);
  });
  reject("Some error Occured");
};
module.exports = Job;
