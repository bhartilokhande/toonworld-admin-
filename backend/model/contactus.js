const mongoose = require("mongoose")
const schema = mongoose.Schema
const Contact = new schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    subject: {
        type: String,
    },
    message:{
        type: String
    },
    isDelete:{
        type: Boolean,
        default:false
    },
  
}, { timestamps: true }, { strict: false });
var detail = mongoose.model("Contact", Contact)
module.exports = detail