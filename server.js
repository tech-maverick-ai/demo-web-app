const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Initialize New Relic (should be first)
require('newrelic');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', lastLogin: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', lastLogin: new Date() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', lastLogin: new Date() }
];

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 45 },
  { id: 2, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', stock: 120 },
  { id: 3, name: 'Coffee Maker', price: 89.99, category: 'Appliances', stock: 30 }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', async (req, res) => {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
    
    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Database connection timeout');
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300));
    
    const category = req.query.category;
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, productIds, total } = req.body;
    
    // Simulate order processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    // Simulate payment processing
    if (Math.random() < 0.1) {
      throw new Error('Payment processing failed');
    }
    
    const order = {
      id: Math.floor(Math.random() * 10000),
      userId,
      productIds,
      total,
      status: 'confirmed',
      createdAt: new Date()
    };
    
    res.json(order);
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Order processing failed' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 New Relic monitoring enabled`);
});
