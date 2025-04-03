
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    service : "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ramganta778@gmail.com',
        pass: 'zzgz lcnf scib pjov'
    },
    tls : {
        rejectUnauthorized : false
    }
});

export default transporter;
