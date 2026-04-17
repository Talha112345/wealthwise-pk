import { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import products from "../data/products";

function Profile() {
  const { profile, updateProfile, getRecommendations } = useUserProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    riskTolerance: profile?.riskTolerance || "",
    investmentHorizon: profile?.investmentHorizon || "",
    monthlyCapacity: profile?.monthlyCapacity || "",
    liquidityPreference: profile?.liquidityPreference || "",
    investmentGoal: profile?.investmentGoal || ""
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user changes it
    setErrors(prev => ({ ...prev, [field]: "" }));
    setSaved(false);
  }

  function validate() {
    const newErrors = {};
    if (!form.riskTolerance) newErrors.riskTolerance = "Please select your risk tolerance";
    if (!form.investmentHorizon) newErrors.investmentHorizon = "Please select your investment horizon";
    if (!form.monthlyCapacity || Number(form.monthlyCapacity) < 1000)
      newErrors.monthlyCapacity = "Minimum investment capacity is Rs. 1,000";
    if (!form.liquidityPreference) newErrors.liquidityPreference = "Please select your liquidity preference";
    if (!form.investmentGoal) newErrors.investmentGoal = "Please select your investment goal";
    return newErrors;
  }

  function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateProfile({ ...form, monthlyCapacity: Number(form.monthlyCapacity) });
    setSaved(true);
  }

  // Live preview — how many products match current form
  const previewProfile = { ...form, monthlyCapacity: Number(form.monthlyCapacity) };
  const matchCount = form.riskTolerance && form.investmentHorizon && form.monthlyCapacity && form.liquidityPreference
    ? getRecommendations(products).length
    : 0;

  const inputStyle = {
    width: "100%",
    padding: "10px",
    background: "var(--accent)",
    color: "white",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const errorStyle = {
    color: "var(--risk-high)",
    fontSize: "12px",
    marginTop: "4px"
  };

  const fieldStyle = {
    marginBottom: "var(--spacing-md)"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#aaa",
    fontSize: "13px",
    textTransform: "uppercase"
  };

  const radioGroupStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "6px"
  };

  function RadioOption({ field, value, label, description }) {
    const isSelected = form[field] === value;
    return (
      <label style={{
        flex: 1,
        minWidth: "120px",
        padding: "12px",
        background: isSelected ? "var(--highlight)" : "var(--accent)",
        borderRadius: "6px",
        cursor: "pointer",
        border: isSelected ? "2px solid var(--highlight)" : "2px solid transparent",
        transition: "all 0.2s ease"
      }}>
        <input
          type="radio"
          name={field}
          value={value}
          checked={isSelected}
          onChange={() => handleChange(field, value)}
          style={{ display: "none" }}
        />
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>{label}</div>
        {description && <div style={{ fontSize: "11px", color: isSelected ? "#eee" : "#aaa", marginTop: "4px" }}>{description}</div>}
      </label>
    );
  }

  return (
    <div style={{ background: "var(--primary)", minHeight: "100vh", color: "var(--text)", padding: "var(--spacing-lg)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <h1 style={{ marginBottom: "6px" }}>Your Financial Profile</h1>
        <p style={{ color: "#aaa", marginBottom: "var(--spacing-lg)" }}>
          Fill in your profile to get personalized product recommendations.
        </p>

        {/* Live match preview */}
        {form.riskTolerance && form.investmentHorizon && form.monthlyCapacity && form.liquidityPreference && (
          <div style={{
            background: "var(--accent)", borderRadius: "var(--radius)",
            padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)",
            borderLeft: "4px solid var(--highlight)"
          }}>
            <strong style={{ color: "var(--highlight)" }}>{matchCount} products</strong> match your current profile
            {matchCount > 0 && (
              <button
                onClick={() => navigate("/recommendations")}
                style={{ marginLeft: "12px", padding: "4px 12px", background: "var(--highlight)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
              >
                View Recommendations →
              </button>
            )}
          </div>
        )}

        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-lg)" }}>

          {/* Risk Tolerance */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Risk Tolerance</label>
            <div style={radioGroupStyle}>
              <RadioOption field="riskTolerance" value="conservative" label="Conservative" description="Safety first, lower returns" />
              <RadioOption field="riskTolerance" value="moderate" label="Moderate" description="Balanced risk and reward" />
              <RadioOption field="riskTolerance" value="aggressive" label="Aggressive" description="Higher risk for higher return" />
            </div>
            {errors.riskTolerance && <p style={errorStyle}>{errors.riskTolerance}</p>}
          </div>

          {/* Investment Horizon */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Investment Horizon</label>
            <div style={radioGroupStyle}>
              <RadioOption field="investmentHorizon" value="short" label="Short" description="1–2 years" />
              <RadioOption field="investmentHorizon" value="medium" label="Medium" description="3–5 years" />
              <RadioOption field="investmentHorizon" value="long" label="Long" description="5+ years" />
            </div>
            {errors.investmentHorizon && <p style={errorStyle}>{errors.investmentHorizon}</p>}
          </div>

          {/* Monthly Capacity */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Investment Capacity (Rs.)</label>
            <input
              type="number"
              value={form.monthlyCapacity}
              onChange={e => handleChange("monthlyCapacity", e.target.value)}
              placeholder="e.g. 25000"
              min="1000"
              style={inputStyle}
            />
            {errors.monthlyCapacity && <p style={errorStyle}>{errors.monthlyCapacity}</p>}
          </div>

          {/* Liquidity Preference */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Liquidity Preference</label>
            <div style={radioGroupStyle}>
              <RadioOption field="liquidityPreference" value="easy" label="Easy Access" description="Need funds anytime" />
              <RadioOption field="liquidityPreference" value="moderate" label="Some Flexibility" description="Can wait a few months" />
              <RadioOption field="liquidityPreference" value="locked" label="Can Lock Funds" description="Don't need access" />
            </div>
            {errors.liquidityPreference && <p style={errorStyle}>{errors.liquidityPreference}</p>}
          </div>

          {/* Investment Goal */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Investment Goal</label>
            <select
              value={form.investmentGoal}
              onChange={e => handleChange("investmentGoal", e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a goal...</option>
              <option value="wealth building">Wealth Building</option>
              <option value="retirement">Retirement</option>
              <option value="emergency fund">Emergency Fund</option>
              <option value="specific purchase">Specific Purchase</option>
            </select>
            {errors.investmentGoal && <p style={errorStyle}>{errors.investmentGoal}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "14px",
              background: saved ? "var(--risk-low)" : "var(--highlight)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
          >
            {saved ? "Profile Saved ✓" : "Save Profile"}
          </button>

        </div>

        {/* Current profile summary */}
        {profile && (
          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
            <h3 style={{ marginTop: 0 }}>Current Saved Profile</h3>
            {[
              { label: "Risk Tolerance", value: profile.riskTolerance },
              { label: "Investment Horizon", value: profile.investmentHorizon },
              { label: "Monthly Capacity", value: `Rs. ${Number(profile.monthlyCapacity).toLocaleString()}` },
              { label: "Liquidity Preference", value: profile.liquidityPreference },
              { label: "Investment Goal", value: profile.investmentGoal }
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "#aaa" }}>{row.label}</span>
                <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;