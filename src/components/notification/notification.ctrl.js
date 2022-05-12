const NotificationRepository = require('../../database/repositories/notification.repo');
const Logger = require('../../utils/pino');

const NotificationController = {
    async getUserNotifications(req, res) {
        try {
            const { user, query } = req;

            const payload = { user: user._id, ...query };

            const notifications = await NotificationRepository.filter(payload);

            if (!notifications) {
                return res
                    .status(200)
                    .json({ status: 'success', message: 'No Notification Found' });
            }

            return res.status(200).json({
                status: 'success',
                message: "fetched user's notification ",
                notifications,
            });
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({ message: 'An Error Occured' });
        }
    },
    async readNotification(req, res) {
        try {
            const {
                params: { notificationId },
            } = req;

            await NotificationRepository.updateOne({ _id: notificationId }, { read: true }, );

            return res.sendStatus(204);
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'An Error Occured',
            });
        }
    },
    async deleteNotication(req, res) {
        try {
            const {
                params: { notificationId },
                user,
            } = req;

            let notification = await NotificationRepository.findOne({
                _id: notificationId,
                user: user._id,
            });

            if (!notification) {
                return res
                    .status(404)
                    .json({ status: 'error', message: 'No Notification Found' });
            }

            await NotificationRepository.deleteOne({ _id: notificationId });

            return res.sendStatus(204);
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async deleteAllNotification(req, res) {
        try {
            const { user } = req;

            let notifications = await NotificationRepository.filter({
                user: user._id,
            });

            if (!notification) {
                return res
                    .status(404)
                    .json({ status: 'error', message: 'No Notification Found' });
            }

            await NotificationRepository.deleteMany({ user: user._id });

            return res.sendStatus(204);
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({
                status: 'error',
                message: ' An Error Occured ',
            });
        }
    },
};

module.exports = NotificationController;