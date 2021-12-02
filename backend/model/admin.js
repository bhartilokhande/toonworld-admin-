const mongoose = require("mongoose")
const schema = mongoose.Schema
const Admin = new schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        default: ''
    },
    role:{
        type: Number,
        default:1
    },
    isDelete:{
        type: Boolean,
        default:false
    },
    Image:{
        type: String
    },
    otp:{
        type: Number
    }
}, { timestamps: true }, { strict: false });
var detail = mongoose.model("Admin", Admin)
module.exports = detail