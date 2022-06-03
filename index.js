const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app=express();
const port=8000;
const db=require('./config/mongoose');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// require the layouts library
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));

// use the express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
    }

    console.log(`Server is up and running at port: ${port}`);
});