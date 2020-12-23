const router = require("express").Router();
const userControllers = require("./controllers/userControllers");
const jobControllers = require("./controllers/jobControllers");

/* User Routes */
router.get("/", userControllers.index);

router.post("/login", userControllers.login);
router.get("/logout", userControllers.logout);
router.post("/register", userControllers.register);
router.post("/checkForEmail", userControllers.checkForEmail);
/* Job routes*/
router.get("/jobs", jobControllers.home);
router.get("/appliedJobs", jobControllers.appliedJobs);
router.post("/addJob", jobControllers.addJob);
router.get("/viewJob/:id", jobControllers.viewJob);

module.exports = router;
