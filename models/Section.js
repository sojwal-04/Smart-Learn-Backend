const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true, // Make it required if necessary
    maxlength: 100, // Set a maximum length if needed
    minlength: 2, // Set a minimum length if needed
    default: "Untitled Section", // Provide a default value if desired
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
