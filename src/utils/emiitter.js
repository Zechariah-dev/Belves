const events = require('events');

const emitter = new events.EventEmitter({ captureRejections: true });

module.exports = emitter;