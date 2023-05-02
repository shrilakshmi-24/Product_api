const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    return cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

module.exports=upload