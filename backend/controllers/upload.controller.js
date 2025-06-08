const path = require('path');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).send('No se subió ningún archivo.');

  const host = req.get('host');
  const protocol = req.protocol;
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.json({ imageUrl });
};
