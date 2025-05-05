const express = require('express');
const router = express.Router();
const customersDb = require('../zakaz-db'); // Исправлено с customers-db на zakaz-db

// Получить всех заказчиков
router.get('/', (req, res) => {
  try {
    const customers = customersDb.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Ошибка при получении заказчиков:', error);
    res.status(500).json({ 
      error: 'Не удалось получить данные заказчиков',
      details: error.message 
    });
  }
});

// Создать нового заказчика
router.post('/', (req, res) => {
  try {
    // Валидация обязательных полей
    if (!req.body.full_name || !req.body.phone) {
      return res.status(400).json({ 
        error: 'Необходимо указать ФИО и телефон' 
      });
    }

    const newCustomer = customersDb.addCustomer({
      full_name: req.body.full_name,
      phone: req.body.phone,
      email: req.body.email || '',
      address: req.body.address || '',
      registration_date: req.body.registration_date || new Date().toISOString().split('T')[0],
      status: req.body.status || 'active'
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Ошибка при создании заказчика:', error);
    res.status(400).json({ 
      error: 'Не удалось создать заказчика',
      details: error.message 
    });
  }
});

// Обновить заказчика
router.put('/:id', (req, res) => {
  try {
    const updated = customersDb.updateCustomer(req.params.id, req.body);
    
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Заказчик не найден' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении заказчика:', error);
    res.status(400).json({ 
      error: 'Не удалось обновить данные заказчика',
      details: error.message 
    });
  }
});

// Удалить заказчика
router.delete('/:id', (req, res) => {
  try {
    const success = customersDb.deleteCustomer(req.params.id);
    
    if (success) {
      res.json({ message: 'Заказчик успешно удален' });
    } else {
      res.status(404).json({ error: 'Заказчик не найден' });
    }
  } catch (error) {
    console.error('Ошибка при удалении заказчика:', error);
    res.status(400).json({ 
      error: 'Не удалось удалить заказчика',
      details: error.message 
    });
  }
});

// Тестовый эндпоинт для проверки
router.get('/test', (req, res) => {
  res.json({ message: "API для заказчиков работает!" });
});

module.exports = router;