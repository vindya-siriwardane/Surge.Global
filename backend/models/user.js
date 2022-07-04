const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

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

const complexityOptions = {
    min: 8,
    max: 12,
    // numeric: 1,
    requirementCount: 2,
  };

const validate = (data) => {
    // data.firstName = " ",
    // data.lastName = " "

    console.log("data --> ", data);
    const schema = Joi.object({
        email : Joi.string().required().label("Email"),
        password: passwordComplexity(complexityOptions).required(),
    });
    
    console.log(schema.validate(data));
    return schema.validate(data);
};


//-------------------

const validateReg = (data) => {
    // data.firstName = " ",
    // data.lastName = " "

    console.log("data --> ", data);
    const schema = Joi.object({
        firstName : Joi.string().required().label("First Name"),
        lastName : Joi.string().required().label("Last Name"),
        email : Joi.string().required().label("Email"),
        // password : passwordComplexity.required().label("Password"),
        password: passwordComplexity(complexityOptions).required(),
        // password: Joi.string().required().label("Password"),

        dob : Joi.string().label("Date of Birth"),
        mobile : Joi.string().length(10).label("Mobile"),
        type : Joi.string().label("Account Type"),
        status : Joi.boolean().label("Status")

    });
    console.log(schema.validate(data));
    return schema.validate(data);
};



//----------------------


module.exports = {User, validate, validateReg};