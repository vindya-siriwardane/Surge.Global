const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title : {type : String},
    description : {type : String},
    email : {type : String, required : true},
    });

const Notes = mongoose.model("notes", userSchema);

module.exports = {Notes};