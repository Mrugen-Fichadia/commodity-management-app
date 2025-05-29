import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

export default function ProductDetails() {
  const { id } = useParams();
  const [role, setRole] = useState(null);
    const [product, setProduct] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
  
    useEffect(() => {
      const userRole = localStorage.getItem('role');
      if (userRole) setRole(userRole);
    }, []);
    
    useEffect(() => {
        if (darkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
    
        localStorage.setItem('darkMode', darkMode.toString());
      }, [darkMode]);
    
      const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data[0]))
      .catch(err => console.error('Error fetching product details:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/products/${id}`, product)
      .then(res => alert('Product updated successfully'))
      .catch(err => console.error('Error updating product:', err));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-container">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <h2>Edit Product</h2>
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
          <div style={{ width: '60%' }}>
              <div style={{display:'flex', alignItems:'start', justifyContent:'space-between'}}><img src={product.image_url} alt={product.name} style={{ marginBottom: '10px', maxHeight: '200px' }}></img>
              <button className='save-changes' onClick={handleUpdate}>Save Changes</button></div>
              
              <br></br>
        <label>Name:</label>
        <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>Image URL:</label>
        <input
            type="text"
            name="image_url"
            value={product.image_url}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>Category:</label>
        <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>Quantity Available:</label>
        <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>Quantity Sold:</label>
        <input
            type="number"
            name="sold"
            value={product.sold}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
            readOnly={role !== 'manager'}
            onClick={(e) => {
              if (role !== 'manager') {
                alert('Only a manager can edit the Quantity Sold field.');
                e.target.blur();
              }
            }}
        />

        <label>Price:</label>
        <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>Description:</label>
        <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
              />
              
              
      </div>

      
    </div>
  );
}
