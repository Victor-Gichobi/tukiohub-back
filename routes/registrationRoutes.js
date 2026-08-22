const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { register, myRegistrations, cancel } = require("../controllers/registrationController");

router.use(protect);
router.post("/", register);
router.get("/my", myRegistrations);
router.patch("/:id/cancel", cancel);

module.exports = router;
