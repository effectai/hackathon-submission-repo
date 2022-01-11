const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      max: 500,
    },
    video: {
      type: String,
      max: 500,
    },
    desc: {
      type: String,
      max: 500,
    },
    campaignId: {
      type: String,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaigns", PostSchema);
