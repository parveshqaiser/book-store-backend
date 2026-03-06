
import nodemailer from "nodemailer";


let transporter = nodemailer.createTransport({
    // service : "Gmail",
    host: "smtp.gmail.com",
    port: 587,
	secure: false,
    auth : {
        // user :"a3fd74001@smtp-brevo.com",
        user : "noreply.projectcamp@gmail.com",
        // pass : "DI0j1NBMwLAzZvfa",
        pass: "wtdj octi axpu diws",
    },
    tls : {
        rejectUnauthorized : false
    }
});

export default transporter;
