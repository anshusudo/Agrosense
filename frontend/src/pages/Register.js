import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
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
        `${API_BASE_URL}/api/auth/register`,
        form
      );

      console.log(res.data);

      // Save email for OTP step
      localStorage.setItem('otpEmail', form.email);

      setMessage(t('registerSuccessOtp'));
      
      // Redirect to OTP page
      navigate('/verify-otp');

    } catch (err) {
      console.log(err.response?.data || err.message);
      setMessage(err.response?.data?.msg || t('registerFailed'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{t('registerTitle')}</h2>
        <p className="auth-subtitle">Create your AgroSense account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="register-name">{t('name')}</label>
            <input
              id="register-name"
              type="text"
              name="name"
              placeholder={t('name')}
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">{t('email')}</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder={t('email')}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">{t('password')}</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder={t('password')}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">{t('registerBtn')}</button>
        </form>

        {message ? <p className="auth-message">{message}</p> : null}

        <p className="auth-footer">
          Already have an account? <Link to="/">{t('loginBtn')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
