const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName : {type : String},
    lastName : {type : String},
    email : {type : String, required : true},
    password : {type : String},
    verified : {type : Boolean, default : false},
    dob : {type : Date},
    mobile :  {type : Number},
    type :  {type : String},
    status :  {type : Boolean, default : false}
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id : this._id},process.env.JWTPRIVATEKEY,{expiresIn:"7d"});
    return token
};

const User = mongoose.model("user", userSchema);

module.exports = {User};