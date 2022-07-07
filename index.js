require('dotenv').config();
const express=require('express');
const logger=require('morgan');
const env=require('./config/environment');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app=express();
require('./config/view-helpers')(app);
const port=8000;
const db=require('./config/mongoose');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const sassMiddleware=require('node-sass-middleware');

// used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

const passportJWT=require('./config/passport-jwt-strategy');

const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo');

// setup the chat server to be used by socket.io
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000');


const path=require('path');

if(env.name=='development'){
    app.use(sassMiddleware({
        src : path.join(__dirname, env.asset_path, '/scss'),
        dest : path.join(__dirname, env.asset_path, '/css'),
        debug : true,
        outputStyle : 'extended',
        prefix : '/css'
    }));
}

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// require the layouts library
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(env.asset_path));

// make the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie into the database
app.use(session({
    name : 'codeial',
    // TODO change the secret before deployment in production mode
    secret : env.session_cookie_key,
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : MongoStore.create({
        mongoUrl : 'mongodb://localhost/codeial_development',
        autoRemove : 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use the express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
    }

    console.log(`Server is up and running at port: ${port}`);
});