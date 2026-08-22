const Registration = require("../models/Registration");
const Event = require("../models/Event");

exports.register = async (req, res) => {
  try {
    const event = await Event.findById(req.body.event);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Registration.findOne({
      user: req.user._id,
      event: event._id
    });

    if (existing && existing.status === "registered") {
      return res.status(409).json({ message: "Already registered for this event" });
    }

    if (existing) {
      existing.status = "registered";
      await existing.save();
      return res.status(201).json(existing);
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: event._id
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "cancelled" },
      { new: true }
    );
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
