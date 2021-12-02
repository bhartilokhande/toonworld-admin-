const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    answer: {
        type: String,
        trim: true,
        required: true,
    },
    isDelete:{
      type: Boolean,
      default:false
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", cmsSchema);