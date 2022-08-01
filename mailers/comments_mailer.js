const nodeMailer = require('../config/nodemailer');

// // exporting module - method 1
// module.exports.newComment = function(comment){

// }

// exporting module - method 2
exports.newComment = (comment) => {
    console.log('inside newComment mailer');

    nodeMailer.transporter.sendMail({
        // from: 'codeial@gmail.com',   // the mail is sent from the email which is used to setup mailer in 'nodemailer.js' and is authorized by google
        to: comment.user.email,     // receiver's (the user who commented) email id
        subject: "New Comment Published",
        html: "<h1>Yup, your comment is now published on Codeial :)</h1>"
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }

        console.log("Mail Delivered", info);
        return;
    });
}