const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, 'data', 'flowers.json');

// Initialize database with correct image paths
function initializeDatabase() {
  if (!fs.existsSync(dataPath)) {
    const initialData = [
      {
        id: uuidv4(),
        cod_f: 'FL001',
        nazvanie: 'Розы',
        sort: 'Чайные',
        color: 'Красный',
        strana: 'Эквадор',
        price: 1500,
        nalichie: true,
        cezon: 'Круглый год',
        tip: 'Срезанные',
        photo: '/images/flower_1.jpeg'
      },
      {
        id: uuidv4(),
        cod_f: 'FL002',
        nazvanie: 'Тюльпаны',
        sort: 'Голландские',
        color: 'Желтый',
        strana: 'Голландия',
        price: 800,
        nalichie: true,
        cezon: 'Весна',
        tip: 'Срезанные',
        photo: '/images/flower_2.jpeg'
      }
    ];
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  initializeDatabase();
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  // Normalize image paths
  return data.map(item => ({
    ...item,
    photo: normalizeImagePath(item.photo)
  }));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
function normalizeImagePath(imagePath) {
  if (!imagePath) return '/images/flower_1.jpeg';
  
  // Проверяем оба возможных пути
  const pathsToCheck = [
    path.join(__dirname, '../public', imagePath),
    path.join(__dirname, 'public', imagePath)
  ];
  
  const existingPath = pathsToCheck.find(p => fs.existsSync(p));
  
  if (!existingPath) {
    console.warn(`Image not found: ${imagePath}`);
    return '/images/flower_1.jpeg';
  }
  
  return imagePath
    .replace(/flower(\d)/, 'flower_$1')
    .replace(/\/+/g, '/')
    .replace(/(\.jpe?g)$/, '.jpeg');
}

module.exports = {
  getAllFlowers: readData,
  addFlower: (flower) => {
    const flowers = readData();
    const newFlower = {
      id: uuidv4(),
      ...flower,
      photo: normalizeImagePath(flower.photo)
    };
    flowers.push(newFlower);
    writeData(flowers);
    return newFlower;
  },
  updateFlower: (id, update) => {
    const flowers = readData();
    const index = flowers.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    const updatedFlower = {
      ...flowers[index],
      ...update,
      photo: normalizeImagePath(update.photo || flowers[index].photo)
    };
    
    flowers[index] = updatedFlower;
    writeData(flowers);
    return updatedFlower;
  },
  deleteFlower: (id) => {
    const flowers = readData();
    const newFlowers = flowers.filter(f => f.id !== id);
    writeData(newFlowers);
    return newFlowers.length !== flowers.length;
  }
};