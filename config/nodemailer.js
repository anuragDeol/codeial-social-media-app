const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// tansporter sends emails - it defines how the communication is going to happen
let transporter = nodemailer.createTransport(env.smtp);


// we are using ejs as our template engine to be used in mail that we send
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), // this function is being called from 'relativePath - email is being sent from 'relativePath'
        data,   // context that is to be passed to the template
        function(err, template){
            if(err){
                console.log('error in rendering template', err);
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