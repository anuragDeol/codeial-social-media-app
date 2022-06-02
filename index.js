const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8800;
const expressLayouts = require('express-ejs-layouts');      // require built-in ejs layouts library
const db = require('./config/mongoose');
// used for session-cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// app.use(express.urlencoded());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    //TODO - change the secret before deployment in production mode
    secret: 'blahsomething',    // 'secret' is the key to encode our user's id and storing encoded 'id' in cookie
    saveUninitialized: false,   // if the user has not signed in and the identity has not been initialised in such case i do not want to save any other data
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 1000)
    }
}));

app.use(passport.initialize());
app.use(passport.session());    // passport also helps in maintaining sessions

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));      // middleware

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});