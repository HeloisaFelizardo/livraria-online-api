const multer = require('multer');

// Configura o multer para lidar com múltiplos uploads de arquivos
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'pdf') {
        cb(null, 'uploads/'); // PDF para uploads
      } else if (file.fieldname === 'cover') {
        cb(null, 'uploads/covers/'); // Capas para uploads/covers
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

exports.upload = upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);
