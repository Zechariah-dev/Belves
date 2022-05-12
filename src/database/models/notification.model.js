const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    title: String,
    message: String,
    request: {
        type: Schema.Types.ObjectId,
        ref: 'request',
        autopopulate: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
}, );

NotificationSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('notifcation', NotificationSchema);