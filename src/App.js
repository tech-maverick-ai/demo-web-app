import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = activeTab === 'users' ? '/api/users' : '/api/products';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (activeTab === 'users') {
        setUsers(data);
      } else {
        setProducts(data);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (productId, userId = 1) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productIds: [productId],
          total: products.find(p => p.id === productId)?.price || 0
        })
      });
      
      if (!response.ok) {
        throw new Error('Order failed');
      }
      
      const order = await response.json();
      alert(`Order placed successfully! Order ID: ${order.id}`);
      
    } catch (err) {
      alert('Order failed: ' + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Demo Web App</h1>
        <p>Showcasing New Relic APM Monitoring</p>
      </header>
      
      <nav className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </nav>

      <main className="content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        {!loading && !error && (
          <>
            {activeTab === 'users' && (
              <div className="users-section">
                <h2>Users ({users.length})</h2>
                <div className="grid">
                  {users.map(user => (
                    <div key={user.id} className="card">
                      <h3>{user.name}</h3>
                      <p>📧 {user.email}</p>
                      <p>🔰 {user.role}</p>
                      <p>⏰ Last login: {new Date(user.lastLogin).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'products' && (
              <div className="products-section">
                <h2>Products ({products.length})</h2>
                <div className="grid">
                  {products.map(product => (
                    <div key={product.id} className="card">
                      <h3>{product.name}</h3>
                      <p>💰 ${product.price}</p>
                      <p>📦 Stock: {product.stock}</p>
                      <p>🏷️ {product.category}</p>
                      <button 
                        onClick={() => placeOrder(product.id)}
                        className="order-btn"
                      >
                        Place Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
