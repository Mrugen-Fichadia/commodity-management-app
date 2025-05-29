import { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import AddProductDialog from '../widgets/addProductDialog.js';
import { FaMoon } from "react-icons/fa";
import { RiDeleteBinLine  } from "react-icons/ri";
import { IoSunny } from "react-icons/io5";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };
  

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };
  
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) setRole(userRole);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="view-products-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='top-navbar-left'>
          <h2>All Products</h2>
          <button className='add-product-button' onClick={() => setOpen(true)}>Add Product</button>
          {role === 'manager' && <button className='dashboard-button' onClick={() => navigate('/dashboard')}>Dashboard</button>}
          <AddProductDialog
            open={open}
            onClose={() => setOpen(false)}
            onProductAdded={() => {
              setOpen(false);
              fetchProducts();
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <button className='logout-button' onClick={handleLogout}>Logout</button>
          <div className="dark-mode-toggle">
            <IoSunny size={24} />
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
            <FaMoon size={20} />
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
            {products.map(product => (
              <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product.id);
                }}
              >
                <RiDeleteBinLine />
              </button>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h3 className="product-title">{product.name}</h3>
              <p className="product-text"><strong>Category:</strong> {product.category}</p>
              <p className="product-text"><strong>Quantity:</strong> {product.quantity}</p>
              <p className="product-text"><strong>Price:</strong> ₹{product.price}</p>
              <p className="product-text description">{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
