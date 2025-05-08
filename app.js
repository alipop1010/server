const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Абсолютный путь к изображениям
const imagesPath = path.join(__dirname, 'public/images');

// 2. Создаём папку если её нет
if (!fs.existsSync(imagesPath)) {
  console.log('Создаю папку для изображений:', imagesPath);
  fs.mkdirSync(imagesPath, { recursive: true });
}

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Статические файлы
app.use('/images', express.static(imagesPath));

// 5. Маршрут для проверки изображений
app.get('/api/images-check', (req, res) => {
  try {
    const files = fs.existsSync(imagesPath) 
      ? fs.readdirSync(imagesPath).filter(f => /\.(jpe?g|png)$/i.test(f))
      : [];

    res.json({
      status: 'OK',
      imagesPath: imagesPath,
      files: files,
      exampleUrl: files.length > 0 
        ? `https://${req.get('host')}/images/${files[0]}`
        : 'No images found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Простой тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

// 7. Запуск сервера
app.listen(PORT, () => {
  console.log(`
  🚀 Сервер запущен на порту ${PORT}
  📁 Путь к изображениям: ${imagesPath}
  🔍 Проверка: https://your-server.onrender.com/api/images-check
  🌐 Пример: https://your-server.onrender.com/images/flower_1.jpeg
  `);
});
