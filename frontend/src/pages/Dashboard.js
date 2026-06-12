import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../services/api";
import CropCopilotPanel from "../components/CropCopilotPanel";

const cardStyle = {
  border: "1px solid #dbe5ef",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
};

function MetricCard({ label, value, color = "#2e7d32" }) {
  return (
    <div style={cardStyle} className="dashboard-metric-card">
      <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function HorizontalBars({ title, labels = [], values = [], colors = [] }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ ...cardStyle, marginTop: 12 }} className="dashboard-chart-card">
      <h4 style={{ marginTop: 0 }}>{title}</h4>
      {labels.map((label, i) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <span>{label}</span>
            <b>{values[i]}</b>
          </div>
          <div style={{ height: 10, background: "#eee", borderRadius: 6 }}>
            <div
              style={{
                height: "100%",
                width: `${(values[i] / max) * 100}%`,
                background: colors[i] || "#4CAF50",
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // ===== STATE =====
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({
    crop: "",
    soilType: "",
    city: "",
    area: "",
  });

  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const [sendingReport, setSendingReport] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [deletingFarmId, setDeletingFarmId] = useState("");
  const [reportStatus, setReportStatus] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: t("chatbotWelcome"),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatFarmId, setChatFarmId] = useState("");
  const [chatbotOnline, setChatbotOnline] = useState(null);

  // ===== AUTH + INIT =====
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchFarms(token);
  }, [navigate]);

  useEffect(() => {
    setChatMessages([
      {
        role: "assistant",
        text: t("chatbotWelcome"),
      },
    ]);
  }, [language, t]);

  useEffect(() => {
    if (!reportStatus) return;

    const timeoutId = setTimeout(() => {
      setReportStatus("");
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [reportStatus]);

  // ===== API FUNCTIONS =====

  // Fetch farms
  const fetchFarms = (token) => {
    axios
      .get(`${API_BASE_URL}/api/farms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFarms(res.data);
        if (res.data.length > 0) {
          setChatFarmId((prev) => prev || res.data[0]._id);
        }
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
        localStorage.removeItem("token");
        navigate("/");
      });
  };

  // Create farm
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_BASE_URL}/api/farms`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({ crop: "", soilType: "", city: "", area: "" });
      fetchFarms(token); // refresh list
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // AI Recommendation
  const getAIRecommendation = async (farmId) => {
    const token = localStorage.getItem("token");
    setLoadingAI(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/recommendations/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAiData(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  const sendAIReport = async (farmId) => {
    const token = localStorage.getItem("token");
    setSendingReport(true);
    setReportStatus("");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/send/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReportStatus(`✅ ${t('reportEmailSuccess')}`);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setReportStatus(`❌ ${t('reportEmailFailed')}`);
    } finally {
      setSendingReport(false);
    }
  };

  const downloadAIReport = async (farmId) => {
    const token = localStorage.getItem("token");
    setDownloadingReport(true);
    setReportStatus("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/recommendations/${farmId}/download-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch = contentDisposition?.match(/filename="?([^\"]+)"?/i);
      const fileName = fileNameMatch?.[1] || `AgroSense_Report_${farmId}.pdf`;

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setReportStatus(`✅ ${t('reportDownloadSuccess')}`);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setReportStatus(`❌ ${t('reportDownloadFailed')}`);
    } finally {
      setDownloadingReport(false);
    }
  };

  const deleteFarm = async (farmId) => {
    const confirmDelete = window.confirm(t('confirmDeleteFarm'));
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");
    setDeletingFarmId(farmId);
    setReportStatus("");

    try {
      await axios.delete(`${API_BASE_URL}/api/farms/${farmId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAiData(null);
      setReportStatus(`✅ ${t('farmDeleteSuccess')}`);
      fetchFarms(token);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setReportStatus(`❌ ${t('farmDeleteFailed')}`);
    } finally {
      setDeletingFarmId("");
    }
  };

  const checkChatbotHealth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/chatbot/health`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatbotOnline(Boolean(res.data?.configured));
    } catch (err) {
      setChatbotOnline(false);
    }
  };

  const sendChatMessage = async () => {
    const token = localStorage.getItem("token");
    const question = chatInput.trim();

    if (!question || !token) {
      return;
    }

    const userMessage = { role: "user", text: question };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const payload = {
        message: question,
        language,
      };

      if (chatFarmId) {
        payload.farmId = chatFarmId;
      }

      const res = await axios.post(`${API_BASE_URL}/api/chatbot/ask`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data?.reply || t("chatbotError"),
        },
      ]);
      setChatbotOnline(true);
    } catch (err) {
      const msg = err.response?.data?.msg || t("chatbotError");
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠ ${msg}`,
        },
      ]);
      setChatbotOnline(false);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleChatbot = () => {
    const next = !chatOpen;
    setChatOpen(next);
    if (next) {
      checkChatbotHealth();
    }
  };

  // ===== UI =====
  return (
    <div className="dashboard-page" style={{ padding: "20px", maxWidth: "1080px", margin: "auto" }}>
      {/* HEADER */}
      <div className="dashboard-header-card">
        <h2 className="dashboard-title"> {t('dashboardTitle')}</h2>
        <p className="dashboard-subtitle">Manage farms, get recommendations, and generate reports from one place.</p>
      </div>

      {/* ADD FARM */}
      <div className="dashboard-section-card">
        <h3 className="dashboard-section-title">➕ {t('addFarm')}</h3>
        <form onSubmit={handleSubmit} className="dashboard-farm-form">
          <input
            className="dashboard-input"
            type="text"
            name="crop"
            placeholder={t('crop')}
            value={form.crop}
            onChange={handleChange}
          />

          <input
            className="dashboard-input"
            type="text"
            name="soilType"
            placeholder={t('soilType')}
            value={form.soilType}
            onChange={handleChange}
          />

          <input
            className="dashboard-input"
            type="text"
            name="city"
            placeholder={t('enterCity')}
            value={form.city}
            onChange={handleChange}
          />

          <input
            className="dashboard-input"
            type="number"
            name="area"
            placeholder={t('areaAcres')}
            value={form.area}
            onChange={handleChange}
          />

          <button type="submit" className="dashboard-primary-btn">{t('addFarmBtn')}</button>
        </form>
      </div>

      {/* FARMS */}
      <div className="dashboard-section-card">
      <h3 className="dashboard-section-title"> {t('myFarms')}</h3>

      {farms.length === 0 ? (
        <p className="dashboard-empty">{t('noFarms')}</p>
      ) : (
        <div className="dashboard-farm-grid" style={{ display: 'grid', gap: '12px' }}>
          {farms.map((farm) => (
            <div
              key={farm._id}
              className="farm-card"
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '12px',
                background: '#fff'
              }}
            >
              <p style={{ margin: 0, marginBottom: '10px' }} className="farm-card-title">
                 <b>{farm.crop}</b>
              </p>
              <p style={{ margin: 0, marginBottom: '10px', color: '#334155' }} className="farm-card-meta">
                {t('soilType')}: {farm.soilType} | {t('areaAcres')}: {farm.area} | {t('city')}: {farm.city || 'N/A'}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} className="farm-card-actions">
                <button className="dashboard-action-btn" onClick={() => getAIRecommendation(farm._id)}>
                   {t('getRecommendation')}
                </button>

                <button
                  className="dashboard-action-btn"
                  onClick={() => sendAIReport(farm._id)}
                  disabled={sendingReport}
                >
                  📩 {t('emailReport')}
                </button>

                <button
                  className="dashboard-action-btn"
                  onClick={() => downloadAIReport(farm._id)}
                  disabled={downloadingReport}
                >
                  ⬇️ {t('downloadReport')}
                </button>

                <button
                  className="dashboard-action-btn dashboard-danger-btn"
                  onClick={() => deleteFarm(farm._id)}
                  disabled={deletingFarmId === farm._id}
                  style={{ color: '#b91c1c' }}
                >
                  🗑️ {t('deleteFarm')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* STATUS UI */}
      {sendingReport && <p className="dashboard-status">📨 {t('sendingReport')}</p>}
      {downloadingReport && <p className="dashboard-status">⬇️ {t('downloadingReport')}</p>}
      {deletingFarmId && <p className="dashboard-status">🗑️ {t('deletingFarm')}</p>}
      {reportStatus && <p className="dashboard-status" style={{ fontWeight: "bold" }}>{reportStatus}</p>}

      {/* AI PANEL */}
      {loadingAI && <p className="dashboard-status"> {t('aiAnalyzing')}</p>}

      {aiData && (
        <div
          className="dashboard-ai-panel"
          style={{
            marginTop: "25px",
            padding: "20px",
            border: "2px solid #4CAF50",
            borderRadius: "8px",
            background: "#f9fff9",
          }}
        >
          <h3> {t('aiPanel')}</h3>

          <p>
            <b>{t('crop')}:</b> {aiData.farm.crop}
          </p>
          <p>
            <b>{t('soilType')}:</b> {aiData.farm.soilType}
          </p>
          <p>
            <b>{t('city')}:</b> {aiData.farm.city || 'N/A'}
          </p>
          <p>
            <b>{t('temperature')}:</b> {aiData.weather?.temperature ?? 'N/A'} °C | <b>{t('humidity')}:</b> {aiData.weather?.humidity ?? 'N/A'}%
          </p>
          <p>
            <b>{t('areaAcres')}:</b> {aiData.farm.area} acres
          </p>

          <hr />

          <p>
            <b>{t('fertilizer')}:</b> {aiData.recommendation.fertilizer}
          </p>
          <p>
            <b>{t('quantity')}:</b> {aiData.recommendation.quantity}
          </p>
          <p>
            <b>{t('irrigation')}:</b> {aiData.recommendation.irrigation}
          </p>

          {aiData.statistics && (
            <>
              <h4>📊 {t('statsOverview')}</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 10,
                }}
              >
                <MetricCard
                  label={t('riskScore')}
                  value={`${aiData.statistics.riskScore}/100`}
                  color="#d32f2f"
                />
                <MetricCard
                  label={t('environmental')}
                  value={`${aiData.statistics.environmentalScore}/100`}
                />
                <MetricCard
                  label={t('soilHealth')}
                  value={`${aiData.statistics.soilHealthScore}/100`}
                  color="#1565c0"
                />
                <MetricCard
                  label={t('confidence')}
                  value={`${aiData.statistics.confidenceScore}%`}
                  color="#6a1b9a"
                />
              </div>

              <HorizontalBars
                title={t('riskDistribution')}
                labels={aiData.statistics.riskDistribution?.labels || []}
                values={aiData.statistics.riskDistribution?.data || []}
                colors={["#e53935", "#1e88e5", "#fbc02d", "#43a047", "#8e24aa"]}
              />

              <HorizontalBars
                title={t('yieldComparison')}
                labels={[t('benchmark'), t('predicted')]}
                values={[
                  aiData.statistics.yieldAnalysis?.benchmark || 0,
                  aiData.statistics.yieldAnalysis?.predicted || 0,
                ]}
                colors={["#90caf9", "#4CAF50"]}
              />
            </>
          )}

          {aiData.cropRecommendations?.length > 0 && (
            <>
              <h4>🌾 {t('topAltCrops')}</h4>
              <HorizontalBars
                title={t('profitComparison')}
                labels={aiData.cropRecommendations.map(
                  (c) => `${c.cropName} (${c.suitabilityScore}%)`,
                )}
                values={aiData.cropRecommendations.map(
                  (c) => c.yieldAnalysis?.profit || 0,
                )}
                colors={["#2e7d32", "#ef6c00", "#1565c0"]}
              />

              <div style={{ ...cardStyle, marginTop: 12 }}>
                <h4 style={{ marginTop: 0 }}>{t('detailedCropStats')}</h4>
                {aiData.cropRecommendations.map((c) => (
                  <div
                    key={c.cropName}
                    style={{
                      marginBottom: 10,
                      paddingBottom: 10,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <b>{c.cropName.toUpperCase()}</b> • {t('suitability')}: {" "}
                    {c.suitabilityScore}% • {t('finalYield')}: {" "}
                    {c.yieldAnalysis?.finalYieldQuintals} q • {t('loss')}: {" "}
                    {c.yieldAnalysis?.lossPercentage}% • {t('profit')}: {" "}
                    {formatINR(c.yieldAnalysis?.profit)}
                  </div>
                ))}
              </div>
            </>
          )}

          <h4>📌 {t('advice')}</h4>
          <ul>
            {aiData.recommendation.advice.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>

          {aiData.recommendation.risk.length > 0 && (
            <>
              <h4>⚠ {t('riskAlerts')}</h4>
              <ul>
                {aiData.recommendation.risk.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          {aiData.recommendation.diseaseRisks?.length > 0 && (
            <>
              <h4>🦠 {t('possibleDiseases')}</h4>
              <ul>
                {aiData.recommendation.diseaseRisks.map((d, i) => (
                  <li key={`${d.disease}-${i}`}>
                    <b>{d.disease}</b> ({d.likelihood}) - {d.why}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <CropCopilotPanel farms={farms} />

      <button
        onClick={toggleChatbot}
        className="chatbot-toggle-btn"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1200,
          border: "none",
          borderRadius: "999px",
          padding: "12px 16px",
          background: "#2e7d32",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        }}
      >
        🤖 {chatOpen ? t("closeChat") : t("openChat")}
      </button>

      {chatOpen && (
        <div
          className="chatbot-panel"
          style={{
            position: "fixed",
            bottom: 76,
            right: 20,
            width: 340,
            maxWidth: "calc(100vw - 32px)",
            height: 470,
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: 12,
            zIndex: 1200,
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            className="chatbot-panel-header"
            style={{
              padding: "10px 12px",
              background: "#2e7d32",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <b>{t("chatTitle")}</b>
            <span style={{ fontSize: 12 }}>
              {chatbotOnline === null
                ? t("chatStatusChecking")
                : chatbotOnline
                ? t("chatOnline")
                : t("chatOffline")}
            </span>
          </div>

          <div className="chatbot-farm-select-wrap" style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 12, marginBottom: 4 }}>{t("selectFarmForChat")}</div>
            <select
              value={chatFarmId}
              onChange={(e) => setChatFarmId(e.target.value)}
              className="chatbot-farm-select"
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
            >
              {farms.length === 0 && <option value="">{t("noFarms")}</option>}
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.crop} - {farm.city}
                </option>
              ))}
            </select>
          </div>

          <div
            className="chatbot-messages"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px 12px",
              background: "#f8fafc",
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "86%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: msg.role === "user" ? "#d1fae5" : "#ffffff",
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div style={{ fontSize: 12, color: "#334155" }}>⏳ {t("chatbotTyping")}</div>
            )}
          </div>

          <div className="chatbot-input-wrap" style={{ padding: 10, borderTop: "1px solid #e5e7eb", background: "#fff" }}>
            <textarea
              rows={2}
              placeholder={t("chatPlaceholder")}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="chatbot-textarea"
              style={{
                width: "100%",
                resize: "none",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                padding: 8,
                marginBottom: 8,
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="chatbot-send-btn"
              style={{
                width: "100%",
                border: "none",
                borderRadius: 8,
                padding: "10px 12px",
                background: "#2e7d32",
                color: "#fff",
                fontWeight: 600,
                cursor: chatLoading || !chatInput.trim() ? "not-allowed" : "pointer",
                opacity: chatLoading || !chatInput.trim() ? 0.7 : 1,
              }}
            >
              {t("sendMessage")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
