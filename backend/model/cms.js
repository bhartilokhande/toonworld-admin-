const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
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

module.exports = mongoose.model("Cms", cmsSchema);