const { model, Schema } = require('mongoose');

const TokenTypes = ['Password Reset']

const TokenSchema = new Schema({
    type: {
        type: String,
        enum: TokenTypes
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    expiresIn: {
        type: Date
    },
    hash: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = model('token', TokenSchema);