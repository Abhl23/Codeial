// this file contains environment

const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log', {
    interval : '1d',    // rotate daily
    path : logDirectory
});

const development={
    name : 'development',
    asset_path : './assets',
    session_cookie_key : 'blahsomething',
    db : 'codeial_development',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'anothaonexo@gmail.com',
            pass : ''
        }
    },
    google_client_id : '117983069566-j3uigaqafsqlqvl3uqkqtbvouqg9h16s.apps.googleusercontent.com',
    google_client_secret : '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',
    google_callback_url : 'http://localhost:8000/users/auth/google/callback',
    jwt_secret : 'codeial',
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}
    }
};

const production={
    name : 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    session_cookie_key : process.env.CODEIAL_SESSION_COOKIE_KEY,
    db : process.env.CODEIAL_DB,
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.CODEIAL_GMAIL_USERNAME,
            pass : process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id : process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url : 'http://localhost:8000/users/auth/google/callback',
    jwt_secret : process.env.CODEIAL_JWT_SECRET,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}
    }
};


module.exports=eval(process.env.NODE_ENV)==undefined? development : eval(process.env.NODE_ENV);