var config = {};

//Set port number
config.port = 4001;

// Database details
config.database = {
    host: '10.10.10.254',
    user: 'root',
    password: '',
    database: 'fitfriend',
    connectionLimit: 100,
    timezone: 'utc',
    supportBigNumbers: true,
    bigNumberStrings: true
};

config.jwtAuthSecret = 'bjMZ10aHNFMv3f+a/jHKPMeakbx3wEjYQHFRN6eOWIo';
config.jwtRefreshSecret = 'bjMZ10aHNFMv3f+a/jHKPMeakbx3wEjYQHFRN6eOWIo';
config.fcm_key = 'AAAAgfxm5-k:APA91bHRWm8WEoTFObO08lvmMl-FFT9dYJviGA2p1Qi1A2bR7EOLZR1UjWWA3YH8j4RIr8afZe2uu-rgonmlUb_LPtOJaUwSkOWbBgS9YZ1w1XPUVHY6r6R0yTrfb6ggvow2xSbvmdz2';
config.stripe_secret_key='sk_test_L1DCMWAsRaqSWM3CSce5BFZk';

config.response = {
    status: '',
    function: '',
    message: '',
    data: {}
};

config.message = {
    success: "Success",
    authFailure : "Authentication failure.",
    authTokenCreateFailure : "Authentication token create failure.",
    tokenExpire : "Token expired.",
    userCreate: "User created successfully.",
    userUpdate: "User details updated successfully.",
    userCreateErr: "An error occure, please try again later.",
    usernameExist : "Username is already exist.",
    emailExist : "Email ID is already exist.",
    loginCheck : "User does not found.",
    invalidParameters : "Invalid request parameters."
    // user:"user present"
    
};
config.path = {
    fc_imagepath: 'public/images/',
    base_imagepath: 'images/'
    };

module.exports = config;