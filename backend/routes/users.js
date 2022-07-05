const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { Notes } = require("../models/notes");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


// signup users
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ message: "User with given email already exist!" });
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        user = await new User({ ...req.body, password: hashPassword }).save();
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url, req.body.password);
        res.status(201).send({ message: "An Email sent to your account please verify" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// register user details
router.post("/register", async (req, res) => {
    try {
        const { error } = validateReg(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            user.overwrite({
                email: req.body.email,
                verified: true,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashPassword,
                mobile: req.body.mobile,
                type: req.body.type,
                dob: req.body.dob,
                status: true
            });
            await user.save();
            return res.status(200).send({ message: "Data added successfully!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


//email verification
router.get("/:id/verify/:token/", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });
        await User.updateOne({ _id: user._id}, {$set: { verified: true}});
        await token.remove();
        res.status(200).send({ message: "Email verified successfully" });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//get all users from DB
router.get("/getUser", async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).send({ data: user, message: "Data fetched!" });
        console.log("res : ",user );
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//get user by :email
router.get("/getUserById/:email", async (req, res) => {
    try {
        const user = await User.findOne({email : req.params.email});
        res.status(200).send({ data: user, message: "Data fetched!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


//add New note
router.post("/addNote", async (req, res) => {
    if (!req.body._id) {

        try {
            let user = await new Notes({ ...req.body }).save();
            res.status(200).send({ data: user, message: "Note added successfully!" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
    else {
        let note = await Notes.findOne({ _id: req.body._id });
        if (note) {
            note.overwrite({
                title: req.body.title,
                description: req.body.description,
                email: req.body.email
            });
            await note.save();
            res.status(200).send({ data: note, message: "Note updated successfully!" });
        }
    }
});

//get all notes from DB
router.get("/getNotes", async (req, res) => {
    try {
        const note = await Notes.find({ email: req.query.email });
        res.status(200).send({ data: note, message: "Notes fetched!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//get :id note from DB
router.get("/getNote/:id", async (req, res) => {
    try {
        const note = await Notes.findOne({ _id: req.params.id });
        res.status(200).send({ data: note, message: "Notes fetched!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//delete :id note from DB
router.delete("/deleteNote/:id", async (req, res) => {
    try {
        await Notes.deleteOne({ _id: req.params.id });
        res.status(200).send({ message: "Note Deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
const complexityOptions = {
    min: 8,
    max: 12,
    // numeric: 1,
    requirementCount: 2,
  };

const validate = (data) => {
    const schema = Joi.object({
        email : Joi.string().required().label("Email"),
        password: passwordComplexity(complexityOptions).required(),
    });
    return schema.validate(data);
};

const validateReg = (data) => {
    const schema = Joi.object({
        firstName : Joi.string().required().label("First Name"),
        lastName : Joi.string().required().label("Last Name"),
        email : Joi.string().required().label("Email"),
        password: passwordComplexity(complexityOptions).required(),
        dob : Joi.string().label("Date of Birth"),
        mobile : Joi.string().length(10).label("Mobile"),
        type : Joi.string().label("Account Type"),
        status : Joi.boolean().label("Status")
    });
    return schema.validate(data);
};

module.exports = router;