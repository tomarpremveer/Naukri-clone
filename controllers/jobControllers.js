const Job = require("../models/Job");
/**
 * Function to add a new Job to the database
 * @param {Request Object} req
 * @param {Response Object} res
 */
exports.home = function (req, res) {
  Job.getJobs(req.visitorId, req.isRecruiter)
    .then((jobs) => {
      res.render("jobs", { jobs: jobs, title: "Jobs Home" });
    })
    .catch((err) => {
      req.flash("Errors", "Some error occured");
      res.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.appliedJobs = function (req, res) {
  Job.getAppliedJobs(req.visitorId)
    .then((jobs) => {
      res.render("appliedJobs", { jobs: jobs, title: "Applied Jobs" });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.addJob = function (req, res) {
  var jobData = {
    title: req.body.title,
    desc: req.body.desc,
    postedDate: new Date().toJSON().slice(0, 10),
    expireDate: req.body.expireDate,
    recruiterId: req.body.id,
    companyName: req.body.companyName,
  };
  var job = new Job(jobData);
  job
    .addNewJob()
    .then((data) => {
      const jobId = data.info.ops[0]._id;
      res.render(`viewJob/${jobId}`, { title: "Job" });
    })
    .catch((err) => {
      res.send(err);
    });
};
/**
 *
 * @param {Request Object} req
 * @param {Response Object} res
 */
exports.viewJob = function (req, res) {
  Job.viewJob(req.params.id)
    .then((jobData) => {
      // const { title } = jobData;
      res.render("viewJob", {
        title: jobData.title + jobData.companyName,
        job: jobData,
      });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.applyForJob = function (req, res) {
  console.log("job controllers");
  Job.applyForJob(req.body.jobId, req.visitorId, req.body.recruiterId)
    .then((success) => {
      req.flash("success", "Your submission for the job was successful");
      req.session.save(function () {
        res.redirect("/jobs");
      });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/jobs");
      });
    });
};
exports.postAd = function (req, res) {
  res.render("postAd", { title: "Post a Job" });
};
exports.candidatesApplied = function (req, res) {
  res.render("candidatesApplied", { title: "Candidates Applied for this Job" });
};
