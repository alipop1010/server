const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Абсолютный путь к изображениям
const imagesPath = path.join(__dirname, 'public', 'images');

// 2. Проверка существования папки и файлов
console.log('Путь к изображениям:', imagesPath);
try {
  console.log('Содержимое папки images:', fs.readdirSync(imagesPath));
} catch (err) {
  console.error('Ошибка чтения папки images:', err);
}

// 3. Настройка CORS
app.use(cors());

// 4. Обслуживание статических файлов
app.use('/images', express.static(imagesPath, {
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=86400');
  }
}));

// 5. Маршрут для проверки изображений
app.get('/debug-images', (req, res) => {
  try {
    const files = fs.readdirSync(imagesPath);
    res.json({
      status: 'OK',
      imagePath: imagesPath,
      files: files,
      testUrl: `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost:'+PORT}/images/z1.jpeg`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Ошибка чтения папки',
      message: error.message,
      path: imagesPath
    });
  }
});

// ... остальные маршруты ...

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Проверьте изображения:`);
  console.log(`https://your-render-service.onrender.com/debug-images`);
  console.log(`Пример изображения: https://your-render-service.onrender.com/images/z1.jpeg`);
});
