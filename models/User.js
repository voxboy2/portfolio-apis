const mongoose = require('mongoose');
const crypto = require('crypto');


const Schema = mongoose.Schema;


const User = new Schema ({
    first_name : {
         type:String,
         required: true,
         min: 3,
         max: 255

    },
    
    last_name : {
            type:String,
            required: true,
            min: 3,
            max: 255
    },

    email : {
        type:String,
        required:true,
        min: 4,
        max: 255
    },

    // address : {
    //     type:String,
    //     required: true,
    //     min: 3,
    //     max: 255
    // },

    password : {
        type: String,
        required: true,
        min: 6
    },

    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type:Date,
        required: false
    }
})








User.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};


module.exports = mongoose.model('User', User)