const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
    
    try {
        const { error } = validate(req.body);

        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

            console.log("auth req.body.password :", req.body.password);
            console.log("user typed user.password :", user.password);

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        // const validPassword = await req.body.password.localeCompare(user.password);

        console.log("validPassword : ", validPassword);

        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });


        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }

            return res
                .status(400)
                .send({ message: "An Email sent to your account please verify" });
        }

        const token = user.generateAuthToken();
        // const token = user.jwt;

        res.status(200).send({ data: token, message: "Logged in successfully!" });

    } catch (error) {
        console.log("error---> ", error);
        res.status(500).send({ message: "Internal Server Error!" });
    }
})

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")

    });
    return schema.validate(data);
}

module.exports = router;