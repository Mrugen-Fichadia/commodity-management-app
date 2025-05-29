import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const SalesBarChart = () => {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const axisStyle = {
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
        setData(res.data);
      })
      .catch((err) => console.error('Error fetching sales data:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke={axisStyle.stroke} />
          <YAxis stroke={axisStyle.stroke} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: 'none',
            }}
            itemStyle={{
              color: darkMode ? '#fff' : '#000',
            }}
            labelStyle={{
              color: darkMode ? '#fff' : '#000',
            }}
          />
          <Bar dataKey="sold" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
