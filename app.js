const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Правильный путь к изображениям
const imagesPath = path.join(__dirname, 'public/images');

// Проверка существования папки
if (!fs.existsSync(imagesPath)) {
  console.error('Папка images не найдена по пути:', imagesPath);
} else {
  console.log('Содержимое папки images:', fs.readdirSync(imagesPath));
}

// Отдача статических файлов с правильным путем
app.use('/images', express.static(imagesPath));

// Тестовый маршрут
app.get('/test-image', (req, res) => {
  const testFile = path.join(imagesPath, 'z1.jpeg');
  if (fs.existsSync(testFile)) {
    res.sendFile(testFile);
  } else {
    res.status(404).json({
      error: 'Файл не найден',
      absolutePath: testFile,
      filesInDir: fs.readdirSync(imagesPath)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен. Проверьте изображения:`);
  console.log(`https://your-render-service.onrender.com/images/z1.jpeg`);
  console.log(`Тест: https://your-render-service.onrender.com/test-image`);
});
