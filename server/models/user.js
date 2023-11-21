const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: false,
        default:"https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"
    }
});

  const User = mongoose.model('User', userSchema)

  module.exports = User;