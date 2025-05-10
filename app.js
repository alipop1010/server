const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const flowersRouter = require('./routes/flowers');
const zakazRouter = require('./routes/zakaz');

const app = express();
const PORT = 3000;

// Настройка путей
const imagesPath = path.join(__dirname, '../public/images');

// Проверка папки с изображениями
if (!fs.existsSync(imagesPath)) {
  console.error('Папка images не найдена! Создаю...');
  fs.mkdirSync(imagesPath, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Статические файлы
app.use('/images', express.static(imagesPath));

// Тестовый маршрут
app.get('/test-image', (req, res) => {
  const testFile = path.join(imagesPath, 'flower_1.jpeg');
  if (fs.existsSync(testFile)) {
    res.sendFile(testFile);
  } else {
    res.status(404).json({
      error: 'Изображение не найдено',
      path: testFile,
      advice: 'Поместите flower_1.jpeg в папку public/images'
    });
  }
});

// Маршруты API
app.use('/api/flowers', flowersRouter);
app.use('/api/zakaz', zakazRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Путь к изображениям: ${imagesPath}`);
  console.log(`Проверка: http://localhost:${PORT}/test-image`);
});
