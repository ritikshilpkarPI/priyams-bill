const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  file: (request, file) => ({}),
});

module.exports = multer({ storage });
