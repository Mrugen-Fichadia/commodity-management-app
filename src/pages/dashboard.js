import { useEffect, useState } from 'react';
import SalesBarChart from '../widgets/barChart';
import RevenueChart from '../widgets/revenueChart';
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { useNavigate  } from 'react-router-dom';

export default function Dashboard() {
  const [topSelling, setTopSelling] = useState([]);
  const [topRevenue, setTopRevenue] = useState([]);
  const [topQuantity, settopQuantity] = useState([]);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
    window.location.reload();
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

  useEffect(() => {
    fetch('http://localhost:5000/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        setTopSelling(data.topSelling);
        setTopRevenue(data.topRevenue);
        settopQuantity(data.topAvailable);
      });
  }, []);

  return (
    <div className='dashboard-container' style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Fixed Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
          <h2>Dashboard</h2>
          <button className='dashboard-button' onClick={() => navigate('/home')}>Home</button>
        </div>
        <div style={{display:'flex', gap: '30px'}}>
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

      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
        <div className='bar-charts'>
          <div className='sales-bar-chart'>
            <h2 style={{ marginBottom: '20px' }}>Items Sold per Product</h2>
            <SalesBarChart />
          </div>
          <div className='revenue-bar-chart'>
            <h2 style={{ marginBottom: '20px' }}>Revenue Earned per Product</h2>
            <RevenueChart />
          </div>
        </div>

        <div className='best-products' style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
          <div className={`product-summary-card ${darkMode ? 'dark' : 'light'}`}>
            <h3>Top 5 Selling Items</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '4%', paddingLeft: '25%' }}>
              <h4>Product</h4>
              <h4>Sold</h4>
            </div>
            {topSelling.map((item, index) => (
              <div className='most-sold-items' key={index}>
                <img src={item.image_url} style={{ height: '50px', width: '80px', objectFit: 'contain' }} />
                <h4 style={{ width: '55%' }}>{item.name}</h4>
                <h4>{item.sold}</h4>
              </div>
            ))}
          </div>

          <div className={`product-summary-card ${darkMode ? 'dark' : 'light'}`}>
            <h3>Top 5 Revenue Items</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '4%', paddingLeft: '25%' }}>
              <h4>Product</h4>
              <h4>Revenue</h4>
            </div>
            {topRevenue.map((item, index) => (
              <div className='most-sold-items' key={index}>
                <img src={item.image_url} style={{ height: '50px', width: '80px', objectFit: 'contain' }} />
                <h4 style={{ width: '45%' }}>{item.name}</h4>
                <h4>₹ {item.revenue}</h4>
              </div>
            ))}
          </div>

          <div className={`product-summary-card ${darkMode ? 'dark' : 'light'}`}>
            <h3>Items with Most Stock</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '4%', paddingLeft: '25%' }}>
              <h4>Product</h4>
              <h4>Quantity</h4>
            </div>
            {topQuantity.map((item, index) => (
              <div className='most-sold-items' key={index}>
                <img src={item.image_url} style={{ height: '50px', width: '80px', objectFit: 'contain' }} />
                <h4 style={{ width: '55%' }}>{item.name}</h4>
                <h4>{item.quantity}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
