import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        form
      );

      console.log(res.data);

      // Save JWT
      localStorage.setItem('token', res.data.token);

      setMessage(t('loginSuccess'));

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.log(err.response?.data || err.message);
      setMessage(err.response?.data?.msg || t('loginFailed'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{t('loginTitle')}</h2>
        <p className="auth-subtitle">Access your AgroSense account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">{t('email')}</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder={t('email')}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">{t('password')}</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder={t('password')}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">{t('loginBtn')}</button>
        </form>

        <p className="auth-footer" style={{ marginTop: '-2px' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        {message ? <p className="auth-message">{message}</p> : null}

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">{t('registerBtn')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
