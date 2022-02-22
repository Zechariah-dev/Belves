const { model, Schema } = require('mongoose');

const StatusType = ['Accepted', 'Pending', 'Rejected']

const RequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true,
    },
    status: {
        type: String,
        enum: StatusType,
        default: 'Pending'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book',
        autopopulate: true,
    }
}, {
    timestamps: true
});

RequestSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('request', RequestSchema);