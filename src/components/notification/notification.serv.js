const NotificationRepository = require('../../database/repositories/notification.repo');

const NotifcationService = {
    createNotificaion(payload) {
        return NotificationRepository.create(payload);
    }
}

module.exports = NotifcationService;