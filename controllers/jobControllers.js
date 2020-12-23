const Job = require("../models/Job");
/**
 * Function to add a new Job to the database
 * @param {Request Object} req
 * @param {Response Object} res
 */
exports.home = function (req, res) {
  console.log("inside the jobs ");
  console.log(req.isRecruiter);
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
  res.render("appliedJobs", { title: "Applied Jobs" });
};
exports.addJob = function (req, res) {
  var jobData = {
    title: req.body.title,
    desc: req.body.desc,
    expireDate: req.body.expireDate,
    recruiterId: req.body.id,
    companyName: req.body.companyName,
  };
  var job = new Job(jobData);
  job
    .addNewJob()
    .then((data) => {
      res.send("this is the data returned" + data.success);
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
      res.render("viewJob", { title: jobData.title });
    })
    .catch((err) => {
      res.send("this is the error" + err);
    });
};
