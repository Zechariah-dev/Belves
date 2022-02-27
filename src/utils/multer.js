const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, __dirname);
  },
  filename(req, file, cb) {
    const temp = file.originalname.split('.');
    const filename = `${temp[0]}-${Date.now()}.${temp[1]}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb({ message: 'unsupported file format'}, false);
  }
};


const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter,
});

module.exports = upload;