const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    desc:{
        type: String,
        required: true
    },
    img:{
        type: JSON,
        required: true
    },
    id:{
        type: String,
        required: true
    }
});

  const Upload = mongoose.model('Upload', uploadSchema)

  module.exports = Upload;