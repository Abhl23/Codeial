// this file contains environment

const development={
    name : 'development',
    asset_path : '/assets',
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
};

const production={
    name : 'production'
};


module.exports=development;