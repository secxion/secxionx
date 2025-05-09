import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    profilePic : String,
    role : String,
    tag : String,
    telegramNumber : String,
},{
    timestamps : true
})

const userModel = mongoose.model("User",userSchema)

export default userModel