const mongoose = require('mongoose');
// const crypto = require('crypto');

const resetPassTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: {
        type: String
        // default: crypto.randomBytes(20).toString('hex')
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const resetPassToken = mongoose.model('resetPassToken', resetPassTokenSchema);
module.exports = resetPassToken;