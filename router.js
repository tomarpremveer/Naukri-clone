const router = require("express").Router();
const userControllers = require("./controllers/userControllers");
/**
 * User Routes
 */
router.get("/", userControllers.home);
router.get("/login", userControllers.login);
router.get("/logout", userControllers.logout);
router.post("/register", userControllers.register);

module.exports = router;
