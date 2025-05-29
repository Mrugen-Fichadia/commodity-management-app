import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem('darkMode') === 'true';
    });
    const axisColor = {
      stroke: darkMode ? '#c0c0c0' : '#000000',
  };
  
  useEffect(() => {
      if (darkMode) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    }, [darkMode]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then((res) => {
        const revenueData = res.data.map((product) => ({
          name: product.name,
          revenue: product.sold * product.price/10000,
        }));
        setData(revenueData);
      })
      .catch((err) => console.error('Error fetching revenue data:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke={axisColor.stroke} />
          <YAxis
            stroke={axisColor.stroke}
            label={{
              value: 'Revenue (₹ × 10,000)',
              angle: -90,
              position: 'insideLeft',
              offset: 1,
              style: { fill: axisColor.stroke }
            }}
          />
          <Tooltip
            formatter={(value) => `₹${value * 10000}`}
            contentStyle={{
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: 'none',
            }}
            itemStyle={{ color: darkMode ? '#fff' : '#000' }}
            labelStyle={{ color: darkMode ? '#fff' : '#000' }}
          />
          <Bar dataKey="revenue" fill="#11b317" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
