const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  review: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
