const express = require('express');
const path = require('path');
const cors = require('cors');
const { uploadDir } = require('./middlewares/multer.config');
const uploadRoutes = require('./routes/upload.routes');
require('./cron/pujaChecker');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares y API
app.use(cors());
app.use('/uploads', express.static(uploadDir));
app.use('/upload', uploadRoutes);

// Angular dist path
const angularDistPath = path.join(__dirname, '../dist/artefactos-del-ayer/browser');
app.use(express.static(angularDistPath));

// Fallback para SPA (Angular)
app.get(/^\/(?!api|upload|uploads).*/, (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
