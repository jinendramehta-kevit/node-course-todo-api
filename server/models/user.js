const mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = User;
