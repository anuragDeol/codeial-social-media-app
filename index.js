const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');      // require built-in ejs layouts library
const db = require('./config/mongoose');
// used for session-cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// (OUTDATED SYNTAX) const MongoStore = require('connect-mongo')(session);   // session is passed as arguement
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

if (env.name == 'development') {
    // set up before server starts
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),   // middleware will pick scss files from here to convert them into css
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',    // we want our code in multiple lines
        prefix: '/css'  // where should my server lookout for css files
    }));
}

// app.use(express.urlencoded());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(env.asset_path));

// make the '/uploads' path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO - change the secret before deployment in production mode
    secret: env.session_cookie_key,    // 'secret' is the key to encode our user's id and storing encoded 'id' in cookie
    saveUninitialized: false,   // if the user has not signed in and the identity has not been initialised in such case i do not want to save any other data
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 1000)
    },
    store: MongoStore.create(
        {
            mongoUrl: "mongodb://localhost/codeial_devlopment",
            autoRemove: 'disabled'
        },
        function(err){
            // callback func, incase the connection is not established
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());    // passport also helps in maintaining sessions

app.use(passport.setAuthenticatedUser);

app.use(flash());   // flash uses session cookies - flash msgs will setup in the cookie which stores session info
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));      // middleware

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});