import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '', role: 'store-keeper' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = `http://localhost:5000/${isLogin ? 'auth/login' : 'register'}`;

    try {
      const res = await axios.post(url, form);
      const { message, role, username } = res.data;

      // Save user info to localStorage
      const user = { username, role };
      localStorage.setItem('user', JSON.stringify(user));
      setMessage(`${message} (Role: ${role})`);

      // Redirect based on role
      if (role === 'store-keeper') {
        localStorage.setItem('role', 'store-keeper');
        navigate('/home');
      } else if (role === 'manager') {
        localStorage.setItem('role', 'manager');
        navigate('/dashboard');
      } else {
        navigate('/login');
      }

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className='login'>
      <div style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', width: '400px' }}>
        <h1 style={{ fontSize: 36 }}>{isLogin ? 'Welcome Back' : 'Welcome To Slooze'}</h1>
        <h3>{isLogin ? 'Login' : 'SignUp for Free'}</h3>
        <form className='form-container' onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Email"
          /><br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          /><br />

          {!isLogin && (
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="store-keeper">Store Keeper</option>
              <option value="manager">Manager</option>
            </select>
          )}
          <br />

          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <p>{message}</p>
        <div>
          {isLogin ? (
            <h4>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
                SignUp
              </a>
            </h4>
          ) : (
            <h4>
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
                SignIn
              </a>
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}
