const nodemailer = require("nodemailer");

module.exports = async (email, subject, text, password) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: "Please click link below to verify your account. \n" + text + "\nPlease use below credintials to login to your account. \n Email :"+ email +"\n Password : " + password,
			// password : "Please use one time password below to login to your account. \n" + password
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};