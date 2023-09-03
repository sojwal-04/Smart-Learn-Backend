const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  attachments: [String], // URLs or file paths for additional resources
  lastUpdated: {
    type: Date,
    default: Date.now, // Track the last update timestamp
  },
});

module.exports = mongoose.model("SubSection", subSectionSchema);
