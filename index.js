const express=require('express');
const app=express();
const port=8000;

// use the express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
    }

    console.log(`Server is up and running at port: ${port}`);
});