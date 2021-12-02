const mongoose = require("mongoose")
const schema = mongoose.Schema
const Social = new schema({
    name : {
        type: String
    },
    url : {
        type:String
    },
    isDelete:{
        type: Boolean,
        default:false
    }
},{timestamps:true},{strict:false});

var social_detail = mongoose.model("Social",Social)
module.exports=social_detail