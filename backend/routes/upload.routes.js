const express = require('express');
const { upload } = require('../middlewares/multer.config');
const { uploadImage } = require('../controllers/upload.controller');

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

module.exports = router;
