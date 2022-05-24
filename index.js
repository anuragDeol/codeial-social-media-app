const express = require('express');
const app = express();
const port = 8800;
const expressLayouts = require('express-ejs-layouts');      // require built-in ejs layouts library
const db = require('./config/mongoose');

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');



// use express router
app.use('/', require('./routes'));      // middleware

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});