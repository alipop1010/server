const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, 'data', 'zakaz.json');

// Initialize database with sample customers
function initializeDatabase() {
  if (!fs.existsSync(dataPath)) {
    const initialData = [
      {
        id: uuidv4(),
        full_name: 'Иванов Иван Иванович',
        phone: '+79161234567',
        email: 'ivanov@example.com',
        address: 'г. Москва, ул. Ленина, д. 10, кв. 25',
        registration_date: '2023-01-15',
        status: 'active'
      },
      {
        id: uuidv4(),
        full_name: 'Петрова Мария Сергеевна',
        phone: '+79031234568',
        email: 'petrova@example.com',
        address: 'г. Санкт-Петербург, Невский пр-т, д. 20',
        registration_date: '2023-02-20',
        status: 'active'
      }
    ];
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  initializeDatabase();
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  getAllCustomers: readData,
  addCustomer: (customer) => {
    const customers = readData();
    const newCustomer = {
      id: uuidv4(),
      ...customer,
      registration_date: customer.registration_date || new Date().toISOString().split('T')[0],
      status: customer.status || 'active'
    };
    customers.push(newCustomer);
    writeData(customers);
    return newCustomer;
  },
  updateCustomer: (id, update) => {
    const customers = readData();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    const updatedCustomer = {
      ...customers[index],
      ...update
    };
    
    customers[index] = updatedCustomer;
    writeData(customers);
    return updatedCustomer;
  },
  deleteCustomer: (id) => {
    const customers = readData();
    const newCustomers = customers.filter(c => c.id !== id);
    writeData(newCustomers);
    return newCustomers.length !== customers.length;
  },
  // Дополнительный метод для поиска по email или телефону
  findCustomer: (field, value) => {
    const customers = readData();
    return customers.find(c => c[field] === value);
  }
};