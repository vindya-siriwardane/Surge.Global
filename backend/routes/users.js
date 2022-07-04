const router = require("express").Router();
const { User, validate, validateReg } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { Notes } = require("../models/notes");
// const {Re, validateReg} = require("../models/user");

// signup users
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        // console.log("generated password : ", user.password);
        if (user)
            return res.status(409).send({ message: "User with given email already exist!" });
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // user = await new User({...req.body, password : hashPassword}).save();
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
    console.log("register req : ", req.body);
    try {
        const { error } = validateReg(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) {

            // return res.status(409).send({message : "User with given email already exist!"});
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            //user = await User({ ...req.body, password: hashPassword }).save();


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
            //  return (<Redirect to="/login" /> )

            // user = await new User({...req.body, password : hashPassword}).save();
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

        await User.updateOne({ _id: user._id, verified: true });
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
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//add New note
router.post("/addNote", async (req, res) => {
    // console.log("req fom add note backend : ", req.body)
    try {
        let user = await new Notes({ ...req.body}).save();
        res.status(200).send({ data: user, message: "Note added successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//get all notes from DB
router.get("/getNotes", async (req, res) => {
    // console.log("req fom get note backend : ", req.query)

    try {
        const note = await Notes.find({ email: req.query.email });
        res.status(200).send({ data: note, message: "Notes fetched!" });

        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.delete("/deleteNote/:id", async (req, res) => {
    // console.log("del req : ", req)
    try {
         await Notes.deleteOne({ _id: req.params.id });

        
        res.status(200).send({ message: "Note Deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;