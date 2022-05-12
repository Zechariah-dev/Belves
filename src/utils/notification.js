const NotificationRepository = require('../database/repositories/notification.repo');

exports.registerNotification = (user, title, message) => {
    await NotificationRepository.create({ user: user._id, title, message })
};