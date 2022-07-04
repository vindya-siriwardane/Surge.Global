const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
// const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    title : {type : String},
    description : {type : String},
    email : {type : String, required : true},
    });

// userSchema.methods.generateAuthToken = function(){
//     const token = jwt.sign({_id : this._id},process.env.JWTPRIVATEKEY,{expiresIn:"7d"});
//     return token
// };

const Notes = mongoose.model("notes", userSchema);

// const complexityOptions = {
//     min: 8,
//     max: 12,
//     // numeric: 1,
//     requirementCount: 2,
//   };

// const validate = (data) => {
//     // data.firstName = " ",
//     // data.lastName = " "

//     console.log("data --> ", data);
//     const schema = Joi.object({
//         title : Joi.string().required().label("Title"),
//         description : Joi.string().required().label("Email"),
//         email : Joi.string().required().label("Email"),
//         // password: passwordComplexity(complexityOptions).required(),
//     });
    
//     console.log(schema.validate(data));
//     return schema.validate(data);
// };


module.exports = {Notes};