const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const flowersRouter = require('./routes/flowers');
const zakazRouter = require('./routes/zakaz');

const app = express();
const PORT = process.env.PORT || 3000; // Используем порт из переменной окружения

// Настройка путей
const imagesPath = path.join(__dirname, 'public/images'); // Убрал ../ для Render

// Проверка папки с изображениями
if (!fs.existsSync(imagesPath)) {
  console.error('Папка images не найдена! Создаю...');
  fs.mkdirSync(imagesPath, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['https://server-s923.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check для Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Маршруты API
app.use('/api/flowers', flowersRouter);
app.use('/api/zakaz', zakazRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на https://server-s923.onrender.com`);
  console.log(`Локальный доступ: http://localhost:${PORT}`);
  console.log(`Путь к изображениям: ${imagesPath}`);
  console.log(`Тестовые маршруты:`);
  console.log(`- https://server-s923.onrender.com/health`);
  console.log(`- https://server-s923.onrender.com/test-image`);
});
