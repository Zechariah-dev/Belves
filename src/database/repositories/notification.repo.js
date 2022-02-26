const BaseRepository = require('../repository');
const Notification = require('../models/notification.model');

class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification);
    }
}

module.exports = new NotificationRepository();