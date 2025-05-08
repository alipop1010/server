const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const flowersRouter = require('./routes/flowers');
const zakazRouter = require('./routes/zakaz');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Определяем точный путь к изображениям
const imagesPath = path.join(__dirname, 'public/images');

// 2. Создаем папку если её нет (для Render)
if (!fs.existsSync(imagesPath)) {
  console.log('🛠 Создаю папку для изображений:', imagesPath);
  fs.mkdirSync(imagesPath, { recursive: true });
}

// 3. Проверяем наличие хотя бы одного изображения
const testImagePath = path.join(imagesPath, 'flower_1.jpeg');
if (!fs.existsSync(testImagePath)) {
  console.warn('⚠️ Предупреждение: flower_1.jpeg не найден в', imagesPath);
  console.log('ℹ️ Поместите изображения в public/images/ на GitHub');
}

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Настройка статических файлов
app.use('/images', express.static(imagesPath));

// 6. Маршрут для диагностики
app.get('/api/images-check', (req, res) => {
  const files = fs.readdirSync(imagesPath).filter(file => 
    ['.jpeg', '.jpg', '.png'].includes(path.extname(file).toLowerCase())
  );

  res.json({
    status: files.length > 0 ? 'OK' : 'ERROR',
    imagesPath: imagesPath,
    availableImages: files,
    firstImageUrl: files.length > 0 
      ? `${req.protocol}://${req.get('host')}/images/${files[0]}`
      : null,
    instructions: files.length === 0
      ? 'Загрузите изображения в public/images/ в репозиторий GitHub'
      : 'Используйте URL вида /images/имя_файла.jpeg'
  });
});

// 7. Основные маршруты API
app.use('/api/flowers', flowersRouter);
app.use('/api/zakaz', zakazRouter);

// 8. Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// 9. Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📂 Путь к изображениям: ${imagesPath}`);
  console.log(`🔍 Проверка изображений: http://localhost:${PORT}/api/images-check`);
  console.log(`🌐 Пример изображения: http://localhost:${PORT}/images/flower_1.jpeg\n`);
});
