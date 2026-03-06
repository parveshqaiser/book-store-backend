
import Mailgen from "mailgen";


let mailGenerator = new Mailgen({
    theme :"default",
    product : {
        name : "Online BookStore",
        link: 'https://mailgen.js/'
    }
});

export let generateEmailContent = (name,otp)=>{

    let emailContent = {
        body: {
            name: name,
            intro: 'Welcome to the Online Book Store ! We\'re very excited to have you on board.',
            action: {
                instructions: 'Here is your Account Verification Credentials. Your OTP will expire in 2 mins',
                button: {
                    color: '#22BC66',
                    text: otp,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    let emailHtml = mailGenerator.generate(emailContent);
    let emailText = mailGenerator.generatePlaintext(emailContent);

    return {emailHtml,emailText}
};

export let resentOtpToVerifyAccount =(name,otp)=>{
    let content = {
        body : {
            name: name,
            action: {
                instructions: 'Here is your Account Verification Credentials. Your New OTP will expire in 2 mins',
                button: {
                    color: '#22BC66',
                    text: otp,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    let html = mailGenerator.generate(content);
    let text = mailGenerator.generatePlaintext(content);
    return {html, text};
}


