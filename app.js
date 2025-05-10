const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Абсолютный путь к изображениям
const imagesPath = path.join(__dirname, 'public', 'images');

// Проверка существования файлов
app.use('/images', (req, res, next) => {
  const filePath = path.join(imagesPath, req.path);
  
  if (fs.existsSync(filePath)) {
    express.static(imagesPath)(req, res, next);
  } else {
    console.error('Файл не найден:', filePath);
    res.status(404).json({
      error: 'Image not found',
      absolutePath: filePath,
      availableFiles: fs.readdirSync(imagesPath)
    });
  }
});

// Тестовый маршрут
app.get('/debug-images', (req, res) => {
  res.json({
    imagesPath: imagesPath,
    files: fs.readdirSync(imagesPath),
    exists: {
      'favicon.ico': fs.existsSync(path.join(imagesPath, 'favicon.ico')),
      'z1.jpeg': fs.existsSync(path.join(imagesPath, 'z1.jpeg'))
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен. Проверьте:`);
  console.log(`https://your-service.onrender.com/debug-images`);
});
