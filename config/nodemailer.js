const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// tansporter sends emails - it defines how the communication is going to happen
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',     // gmail's server
    port: 587,
    secure: false,
    auth: {
        // these credentials are used to authorize with google to use their mailer services - so these should be actual, correct and verified by google
        user: 'anuragdeol2017@gmail.com',
        pass: 'tfxuokixnzpzpwvy'    // app-generated password, from google, for our app (Codeial)
    }
});


// we are using ejs as our template engine to be used in mail that we send
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), // this function is being called from 'relativePath - email is being sent from 'relativePath'
        data,   // context that is to be passed to the template
        function(err, template){
            if(err){
                console.log('error in rendering template');
                return;
            }

            mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}