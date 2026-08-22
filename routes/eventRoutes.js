const router = require("express").Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
