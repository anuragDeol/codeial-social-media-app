const nodeMailer = require('../config/nodemailer');


exports.resetPass = (token) => {
    let htmlString = nodeMailer.renderTemplate({
        // context
        token: token
    }, '/users/reset_password.ejs');


    nodeMailer.transporter.sendMail({
        // from: 'codeial@gmail.com',   // the mail is sent from the email which is used to setup mailer in 'nodemailer.js' and is authorized by google
        to: token.user.email,     // receiver's email id
        subject: "Codeial - Change your password",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }

        console.log("Mail Delivered", info);
        return;
    });
}

