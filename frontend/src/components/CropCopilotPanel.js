import { useEffect, useMemo, useState } from "react";
import { cropCopilotApi } from "../services/api";

const panelStyle = {
  border: "1px solid var(--border-color)",
  borderRadius: 14,
  padding: 16,
  background: "var(--panel-bg)",
  boxShadow: "0 8px 18px var(--shadow-color)",
  color: "var(--text-color)"
};

function CropCopilotPanel({ farms = [] }) {
  const [form, setForm] = useState({
    farmId: "",
    cropType: "",
    notes: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!previewUrl) return undefined;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!form.farmId && farms.length > 0) {
      setForm((prev) => ({
        ...prev,
        farmId: farms[0]._id,
      }));
    }
  }, [farms, form.farmId]);

  const selectedFarm = useMemo(
    () => farms.find((farm) => farm._id === form.farmId) || null,
    [farms, form.farmId],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    setForm((prev) => ({ ...prev, image: file }));
    setError("");
    setResult(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!form.image) {
      setError("Please upload a crop image.");
      return;
    }

    const payload = new FormData();
    payload.append("image", form.image);

    if (form.farmId) {
      payload.append("farmId", form.farmId);
    }

    if (form.cropType) {
      payload.append("cropType", form.cropType);
    }

    if (form.notes.trim()) {
      payload.append("notes", form.notes.trim());
    }

    try {
      setLoading(true);
      const response = await cropCopilotApi.analyzeCropImage(payload);
      setResult(response.data || null);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to analyze crop image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ ...panelStyle, marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0 }}>Crop Copilot</h3>
          <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "14px" }}>
            Upload a crop image and get a structured field advisory powered by AI.
          </p>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "4px 8px", background: "var(--card-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", alignSelf: "flex-start" }}>
          {selectedFarm ? `Farm context: ${selectedFarm.crop} • ${selectedFarm.city || "N/A"}` : "No farm context selected"}
        </div>
      </div>

      {error ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "var(--error-bg)", color: "var(--error-text)", border: "1px solid var(--error-text)" }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 1fr)", gap: 16, marginTop: 14 }}>
        <form onSubmit={handleAnalyze} style={{ display: "grid", gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)" }}>Farm context</label>
          <select name="farmId" value={form.farmId} onChange={handleChange} style={{ padding: 10, borderRadius: 8, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-color)" }}>
            {farms.length === 0 && <option value="">No farms available</option>}
            {farms.map((farm) => (
              <option key={farm._id} value={farm._id}>
                {farm.crop} - {farm.city || "N/A"}
              </option>
            ))}
          </select>

          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)" }}>Crop type hint</label>
          <input
            name="cropType"
            value={form.cropType}
            onChange={handleChange}
            placeholder={selectedFarm?.crop || "e.g. tomato"}
            style={{ padding: 10, borderRadius: 8, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-color)" }}
          />

          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)" }}>Farmer notes</label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            placeholder="Yellowing, spots, wilting, pests, recent spraying, etc."
            style={{ padding: 10, borderRadius: 8, border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-color)", resize: "vertical" }}
          />

          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)" }}>Crop image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: "var(--text-color)" }} />

          <button
            type="submit"
            disabled={loading}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              background: "#2e7d32",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Analyzing..." : "Analyze Crop Image"}
          </button>
        </form>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ border: "1px dashed var(--border-color)", borderRadius: 12, minHeight: 180, display: "grid", placeItems: "center", overflow: "hidden", background: "var(--preview-bg)" }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Crop preview" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            ) : (
              <div style={{ color: "var(--text-muted)", padding: 20, textAlign: "center" }}>
                Image preview will appear here after upload.
              </div>
            )}
          </div>

          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 16, background: "var(--card-bg)", boxShadow: "0 4px 6px var(--shadow-color)", color: "var(--text-color)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--text-color)" }}>Crop Copilot Output</h4>

            {!result ? (
              <p style={{ marginBottom: 0, color: "var(--text-muted)", fontSize: "14px" }}>Run an analysis to see structured crop guidance.</p>
            ) : (
              <div style={{ display: "grid", gap: 12, fontSize: 14, color: "var(--text-color)" }}>
                <div style={{ padding: "10px", background: "var(--preview-bg)", borderRadius: "8px", borderLeft: "4px solid #1e88e5" }}>
                  <p style={{ margin: 0 }}><b>Summary:</b> {result.result?.summary}</p>
                </div>
                <p style={{ margin: 0 }}><b>Image description:</b> {result.result?.imageDescription}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <p style={{ margin: 0 }}><b>Likely issue:</b> <span style={{ color: "#eab308", fontWeight: "bold" }}>{result.result?.likelyIssue}</span></p>
                  <p style={{ margin: 0 }}><b>Crop health:</b> {result.result?.cropHealth}</p>
                  <p style={{ margin: 0 }}><b>Severity:</b> {result.result?.severity}</p>
                  <p style={{ margin: 0 }}><b>Confidence:</b> {Math.round(Number(result.result?.confidence || 0) * 100)}%</p>
                </div>
                {result.result?.expertReview ? <p style={{ margin: 0, color: "#ef4444", fontWeight: 700, padding: "8px", background: "var(--error-bg)", borderRadius: "6px" }}>⚠️ Expert review recommended</p> : null}

                {Array.isArray(result.result?.immediateActions) && result.result.immediateActions.length > 0 ? (
                  <div>
                    <b>Immediate actions</b>
                    <ul style={{ marginTop: 6, marginBottom: 0 }}>
                      {result.result.immediateActions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(result.result?.preventionPlan) && result.result.preventionPlan.length > 0 ? (
                  <div>
                    <b>Prevention plan</b>
                    <ul style={{ marginTop: 6, marginBottom: 0 }}>
                      {result.result.preventionPlan.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(result.result?.followUpQuestions) && result.result.followUpQuestions.length > 0 ? (
                  <div>
                    <b>Follow-up questions</b>
                    <ul style={{ marginTop: 6, marginBottom: 0 }}>
                      {result.result.followUpQuestions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CropCopilotPanel;