const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');

// check if production log directory already exist OR we need to create the log directory
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// // deprecated method of using rfs
// const accessLogStream = rfs('access.log', {
//     interval: '1d',
//     path: logDirectory
// });

// new method of using rfs
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',  // rotate daily
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',     // gmail's server
        port: 587,
        secure: false,
        auth: {
            // these credentials are used to authorize with google to use their mailer services - so these should be actual, correct and verified by google
            user: 'anuragdeol2017@gmail.com',
            pass: 'tfxuokixnzpzpwvy'    // app-generated password, from google, for our app (Codeial)
        }
    },
    google_client_id: "278352446158-klp6n4to3bhbqglm7qm3453g5mi8gjmu.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',     // gmail's server
        port: 587,
        secure: false,
        auth: {
            // these credentials are used to authorize with google to use their mailer services - so these should be actual, correct and verified by google
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD    // app-generated password, from google, for our app (Codeial)
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
module.exports = development;