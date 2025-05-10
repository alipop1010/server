require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const flowersRouter = require('./routes/flowers');
const zakazRouter = require('./routes/zakaz');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Настройка путей
const publicPath = path.join(__dirname, 'public');
const imagesPath = path.join(publicPath, 'images');

// 2. Проверка и создание необходимых директорий
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Директория ${dirPath} не найдена! Создаю...`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExists(publicPath);
ensureDirectoryExists(imagesPath);

// 3. Middleware
app.use(morgan('dev')); // Логирование запросов
app.use(cors({
  origin: [
    'https://server-s923.onrender.com',
    'http://localhost:3000',
    'https://your-vue-domain.sprinthost.ru' // ЗАМЕНИТЕ на ваш реальный домен Vue
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Статические файлы с обработкой ошибок
app.use('/images', (req, res, next) => {
  express.static(imagesPath, {
    setHeaders: (res) => {
      res.set('Cache-Control', 'public, max-age=86400');
    },
    fallthrough: false // Не передавать запрос дальше если файл не найден
  })(req, res, (err) => {
    if (err) {
      console.error('Ошибка при загрузке файла:', req.path, err);
      res.status(404).json({ 
        error: 'Изображение не найдено',
        path: req.path,
        available: fs.readdirSync(imagesPath)
      });
    }
  });
});

// 5. Тестовые маршруты
app.get('/test-image', (req, res) => {
  const testFiles = [
    'flower_1.jpeg',
    'flower_2.jpg',
    'default.png'
  ];

  const existingFile = testFiles.find(file => 
    fs.existsSync(path.join(imagesPath, file))
  );

  if (existingFile) {
    res.sendFile(path.join(imagesPath, existingFile));
  } else {
    const errorMessage = {
      error: 'Тестовые изображения не найдены',
      advice: 'Поместите одно из этих файлов в public/images:',
      expectedFiles: testFiles,
      actualFiles: fs.readdirSync(imagesPath)
    };
    console.error(errorMessage);
    res.status(404).json(errorMessage);
  }
});

// 6. Health check
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
    database: 'OK', // Здесь можно добавить проверку БД если есть
    images: {
      path: imagesPath,
      exists: fs.existsSync(imagesPath),
      fileCount: fs.readdirSync(imagesPath).length
    }
  };
  res.status(200).json(health);
});

// 7. API Routes
app.use('/api/flowers', flowersRouter);
app.use('/api/zakaz', zakazRouter);

// 8. Обработка 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    method: req.method,
    path: req.path,
    availableRoutes: {
      GET: ['/health', '/test-image', '/api/flowers', '/api/zakaz'],
      POST: ['/api/zakaz']
    }
  });
});

// 9. Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Серверная ошибка:', err.stack);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: err.message,
    path: req.path
  });
});

// 10. Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Доступные маршруты:`);
  console.log(`- Health check: https://server-s923.onrender.com/health`);
  console.log(`- Тест изображений: https://server-s923.onrender.com/test-image`);
  console.log(`- API Цветов: https://server-s923.onrender.com/api/flowers`);
  console.log(`- API Заказов: https://server-s923.onrender.com/api/zakaz`);
  console.log(`\nПуть к изображениям: ${imagesPath}`);
  console.log(`Содержимое папки images:`, fs.readdirSync(imagesPath));
});

process.on('unhandledRejection', (err) => {
  console.error('Необработанное исключение:', err);
});
