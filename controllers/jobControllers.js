const Job = require("../models/Job");
/**
 * Function to add a new Job to the database
 * @param {Request Object} req
 * @param {Response Object} res
 */
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
      res.send(jobData);
    })
    .catch((err) => {
      res.send("this is the error" + err);
    });
};
