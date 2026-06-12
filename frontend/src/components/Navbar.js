import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../services/api";

function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "farmer",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const menuRef = useRef(null);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (
      (location.pathname === "/" || location.pathname === "/register") &&
      token
    ) {
      localStorage.removeItem("token");
      token = null;
    }

    setIsAuthenticated(Boolean(token));

    if (!token) {
      setProfile({ name: "", email: "", role: "farmer" });
      setMenuOpen(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile({
          name: res.data?.user?.name || "",
          email: res.data?.user?.email || "",
          role: res.data?.user?.role || "farmer",
        });
      })
      .catch(() => {
        setIsAuthenticated(false);
        setProfile({ name: "", email: "", role: "farmer" });
      });
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const displayName = profile.name || t("profile");
  const avatarLetter = useMemo(
    () => displayName.charAt(0).toUpperCase(),
    [displayName],
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setProfile({ name: "", email: "", role: "farmer" });
    setMenuOpen(false);
    navigate("/");
  };

  const navButtonStyle = (path) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    border:
      location.pathname === path ? "1px solid #1e88e5" : "1px solid #cbd5e1",
    background: location.pathname === path ? "#e3f2fd" : "#ffffff",
    color: location.pathname === path ? "#0c4a6e" : "#334155",
    fontWeight: 600,
    fontSize: "14px",
  });

  return (
    <nav
      className="app-navbar"
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "10px 12px",
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--border-color)",
        color: "var(--text-color)"
      }}
    >
      <div
        className="app-navbar-links"
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={navButtonStyle("/dashboard")}>
              <span style={{ marginRight: "6px" }}>🏠</span>
              {t("navDashboard")}
            </Link>
            {profile.role === "admin" ? (
              <Link to="/admin" style={navButtonStyle("/admin")}>
                <span style={{ marginRight: "6px" }}>🛡️</span>Admin
              </Link>
            ) : null}
          </>
        ) : (
          <>
            <Link to="/register" style={navButtonStyle("/register")}>
              <span style={{ marginRight: "6px" }}></span>
              {t("navRegister")}
            </Link>
            <Link to="/" style={navButtonStyle("/")}>
              <span style={{ marginRight: "6px" }}></span>
              {t("navLogin")}
            </Link>
          </>
        )}
      </div>

      <div
        className="app-navbar-right"
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            padding: "4px",
            borderRadius: "50%",
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <label htmlFor="language-select" className="app-navbar-lang-label">
          {t("language")}:
        </label>
        <select
          id="language-select"
          className="app-navbar-lang-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>

        {isAuthenticated && (
          <div
            ref={menuRef}
            className="app-navbar-profile-wrap"
            style={{ position: "relative" }}
          >
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={t("openMenu")}
              className="app-navbar-profile-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--border-color)",
                borderRadius: "20px",
                background: "var(--card-bg)",
                color: "var(--text-color)",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#1E88E5",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {avatarLetter}
              </span>
              <span
                style={{
                  maxWidth: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </span>
            </button>

            {menuOpen && (
              <div
                className="app-navbar-profile-menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  width: "230px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: "10px",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{t("myAccount")}</div>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    {displayName}
                  </div>
                  {profile.email ? (
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {profile.email}
                    </div>
                  ) : null}
                </div>

                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {t("navDashboard")}
                </button>

                {profile.role === "admin" ? (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Admin Panel
                  </button>
                ) : null}

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: "#dc2626",
                  }}
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
