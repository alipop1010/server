const express = require('express');
const router = express.Router();
const flowersDb = require('../flowers-db');

// Получить все цветы
router.get('/', (req, res) => {
  try {
    const flowers = flowersDb.getAllFlowers();
    
    // Добавляем полный URL к изображениям
    const flowersWithFullUrls = flowers.map(flower => ({
      ...flower,
      photo: `http://localhost:3000${flower.photo}`
    }));
    
    res.json(flowersWithFullUrls);
  } catch (error) {
    console.error('Ошибка при получении цветов:', error);
    res.status(500).json({ 
      error: 'Не удалось получить данные о цветах',
      details: error.message 
    });
  }
});

// Создать новый цветок
router.post('/', (req, res) => {
  try {
    // Валидация обязательных полей
    if (!req.body.nazvanie || !req.body.price || !req.body.photo) {
      return res.status(400).json({ 
        error: 'Необходимо указать название, цену и фото цветка',
        required: ['nazvanie', 'price', 'photo'],
        received: Object.keys(req.body)
      });
    }

    const newFlower = flowersDb.addFlower({
      cod_f: req.body.cod_f || `FL${Date.now()}`,
      nazvanie: req.body.nazvanie,
      sort: req.body.sort || 'Не указан',
      color: req.body.color || 'Не указан',
      strana: req.body.strana || 'Не указана',
      price: Number(req.body.price) || 0,
      nalichie: req.body.nalichie !== undefined ? req.body.nalichie : true,
      cezon: req.body.cezon || 'Круглый год',
      tip: req.body.tip || 'Срезанные',
      photo: req.body.photo
    });

    res.status(201).json({
      ...newFlower,
      photo: `http://localhost:3000${newFlower.photo}`
    });
  } catch (error) {
    console.error('Ошибка при создании цветка:', error);
    res.status(400).json({ 
      error: 'Не удалось создать запись о цветке',
      details: error.message 
    });
  }
});

// Обновить данные цветка
router.put('/:id', (req, res) => {
  try {
    // Базовая валидация
    if (req.body.price && isNaN(req.body.price)) {
      return res.status(400).json({ 
        error: 'Цена должна быть числом' 
      });
    }

    const updated = flowersDb.updateFlower(req.params.id, req.body);
    
    if (updated) {
      res.json({
        ...updated,
        photo: `http://localhost:3000${updated.photo}`
      });
    } else {
      res.status(404).json({ 
        error: 'Цветок не найден',
        id: req.params.id
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении цветка:', error);
    res.status(400).json({ 
      error: 'Не удалось обновить данные о цветке',
      details: error.message 
    });
  }
});

// Удалить цветок
router.delete('/:id', (req, res) => {
  try {
    const success = flowersDb.deleteFlower(req.params.id);
    
    if (success) {
      res.json({ 
        message: 'Цветок успешно удален',
        id: req.params.id
      });
    } else {
      res.status(404).json({ 
        error: 'Цветок не найден',
        id: req.params.id
      });
    }
  } catch (error) {
    console.error('Ошибка при удалении цветка:', error);
    res.status(400).json({ 
      error: 'Не удалось удалить цветок',
      details: error.message 
    });
  }
});

// Тестовый эндпоинт
router.get('/test', (req, res) => {
  res.json({ 
    message: "API для цветов работает!",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;