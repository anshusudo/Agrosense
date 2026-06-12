import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

function AdminPanel() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const buildAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const loadData = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const meRes = await axios.get(`${API_BASE_URL}/api/auth/me`, buildAuthHeaders());
      const currentUser = meRes.data?.user;

      if (!currentUser || currentUser.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      setProfile(currentUser);

      const [overviewRes, usersRes, farmsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/overview`, buildAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/admin/users`, buildAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/admin/farms`, buildAuthHeaders()),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data || []);
      setFarms(farmsRes.data || []);
    } catch (err) {
      setMessage(err.response?.data?.msg || err.response?.data?.error?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}/role`, { role: nextRole }, buildAuthHeaders());
      setMessage('User role updated successfully');
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to update role');
    }
  };

  const handleFarmDelete = async (farmId) => {
    const confirmed = window.confirm('Delete this farm record?');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/farms/${farmId}`, buildAuthHeaders());
      setMessage('Farm deleted successfully');
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to delete farm');
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading admin panel...</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Admin Panel</h2>
      <p style={{ color: '#475569' }}>Manage users and farms before deployment.</p>

      {profile ? (
        <div style={{ marginBottom: 16, color: '#0f172a' }}>
          Logged in as: <b>{profile.name}</b> ({profile.email})
        </div>
      ) : null}

      {message ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: '#e2e8f0' }}>
          {message}
        </div>
      ) : null}

      {overview ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ border: '1px solid #dbe5ef', borderRadius: 10, padding: 12 }}>
            <b>Total Users:</b> {overview.totalUsers}
          </div>
          <div style={{ border: '1px solid #dbe5ef', borderRadius: 10, padding: 12 }}>
            <b>Total Farms:</b> {overview.totalFarms}
          </div>
          <div style={{ border: '1px solid #dbe5ef', borderRadius: 10, padding: 12 }}>
            <b>Verified Users:</b> {overview.verifiedUsers}
          </div>
          <div style={{ border: '1px solid #dbe5ef', borderRadius: 10, padding: 12 }}>
            <b>Unverified Users:</b> {overview.unverifiedUsers}
          </div>
        </div>
      ) : null}

      <div style={{ marginBottom: 24 }}>
        <h3>Users</h3>
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Verified</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Role</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 10 }}>{user.name}</td>
                  <td style={{ padding: 10 }}>{user.email}</td>
                  <td style={{ padding: 10 }}>{user.isVerified ? 'Yes' : 'No'}</td>
                  <td style={{ padding: 10, textTransform: 'capitalize' }}>{user.role || 'farmer'}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'farmer' : 'admin')}
                      style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                    >
                      Make {user.role === 'admin' ? 'Farmer' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Farms</h3>
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Crop</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Soil</th>
                <th style={{ textAlign: 'left', padding: 10 }}>City</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Area</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Owner</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm) => (
                <tr key={farm._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 10 }}>{farm.crop}</td>
                  <td style={{ padding: 10 }}>{farm.soilType}</td>
                  <td style={{ padding: 10 }}>{farm.city}</td>
                  <td style={{ padding: 10 }}>{farm.area}</td>
                  <td style={{ padding: 10 }}>{farm.owner?.name || farm.owner?.email || 'N/A'}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      onClick={() => handleFarmDelete(farm._id)}
                      style={{
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: 6,
                        padding: '6px 10px',
                        cursor: 'pointer',
                        background: '#fff',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;