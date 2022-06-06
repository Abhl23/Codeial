const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app=express();
const port=8000;
const db=require('./config/mongoose');

const sassMiddleware=require('node-sass-middleware');

// used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

const MongoStore=require('connect-mongo');

app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// require the layouts library
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie into the database
app.use(session({
    name : 'codeial',
    // TODO change the secret before deployment in production mode
    secret : 'blahsomething',
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

// use the express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
    }

    console.log(`Server is up and running at port: ${port}`);
});