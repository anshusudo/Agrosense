import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../services/api';

function VerifyOtp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const email = localStorage.getItem('otpEmail');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const focusIdx = Math.min(pasted.length, 5);
      const el = document.getElementById(`otp-${focusIdx}`);
      if (el) el.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setMessage(t('enterOtp'));
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        { email, otp: otpString }
      );

      console.log(res.data);
      setMessage(t('otpVerified'));
      setIsSuccess(true);

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setMessage(err.response?.data?.msg || t('otpFailed'));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e88e5 0%, #2e7d32 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 28
        }}>
          ✉️
        </div>

        <h2 className="auth-title" style={{ textAlign: 'center' }}>{t('verifyOtpTitle')}</h2>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
          {t('otpSentTo') || 'OTP sent to'}
        </p>
        <p style={{
          margin: '-10px 0 20px', fontWeight: 600, fontSize: 15,
          color: '#1e88e5', wordBreak: 'break-all'
        }}>
          {email}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* 6-digit OTP boxes */}
          <div style={{
            display: 'flex', gap: 10, justifyContent: 'center', margin: '4px 0 8px'
          }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                autoFocus={i === 0}
                style={{
                  width: 46, height: 52, textAlign: 'center',
                  fontSize: 22, fontWeight: 700, color: '#0f172a',
                  border: digit ? '2px solid #1e88e5' : '2px solid #cbd5e1',
                  borderRadius: 12, outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: digit ? '0 0 0 3px rgba(30,136,229,0.12)' : 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e88e5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30,136,229,0.15)';
                }}
                onBlur={(e) => {
                  if (!digit) {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Verifying...' : t('verifyOtpBtn')}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 10,
            fontSize: 13, fontWeight: 500,
            background: isSuccess ? '#dcfce7' : '#fee2e2',
            color: isSuccess ? '#166534' : '#991b1b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            {isSuccess ? '✅' : '⚠️'} {message}
          </div>
        )}

        <p className="auth-footer" style={{ textAlign: 'center' }}>
          <Link to="/">← {t('backToLogin') || 'Back to Login'}</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
