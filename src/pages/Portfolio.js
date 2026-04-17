import { usePortfolio } from "../context/PortfolioContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RiskBadge from "../components/RiskBadge";

function Portfolio() {
  const { portfolio, removeFromPortfolio, updateAllocation } = usePortfolio();
  const navigate = useNavigate();

  // Track which item is being edited
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function handleEditStart(item) {
    setEditingId(item.id);
    setEditValue(item.allocatedAmount);
  }

  function handleEditSave(item) {
    const newAmount = Number(editValue);
    if (newAmount >= item.minInvestment) {
      updateAllocation(item.id, newAmount);
    }
    setEditingId(null);
  }

  // Empty portfolio state
  if (portfolio.items.length === 0) {
    return (
      <div style={{
        background: "var(--primary)", minHeight: "100vh",
        color: "var(--text)", display: "flex",
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>📂</div>
          <h2>Your Portfolio is Empty</h2>
          <p style={{ color: "#aaa", marginBottom: "24px" }}>
            Browse products and add them to build your portfolio.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "12px 28px", background: "var(--highlight)",
              color: "white", border: "none", borderRadius: "6px",
              cursor: "pointer", fontSize: "16px", fontWeight: "bold"
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const { items, totalInvested, weightedReturn, riskDistribution } = portfolio;

  // Warning if more than 70% is high risk
  const highRiskWarning = riskDistribution.high > 70;

  return (
    <div style={{ background: "var(--primary)", minHeight: "100vh", color: "var(--text)", padding: "var(--spacing-lg)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        <h1 style={{ marginBottom: "var(--spacing-lg)" }}>My Portfolio</h1>

        {/* High risk warning */}
        {highRiskWarning && (
          <div style={{
            background: "rgba(231, 76, 60, 0.2)",
            border: "1px solid var(--risk-high)",
            borderRadius: "var(--radius)",
            padding: "var(--spacing-md)",
            marginBottom: "var(--spacing-md)",
            display: "flex",
            gap: "12px",
            alignItems: "center"
          }}>
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <div>
              <strong style={{ color: "var(--risk-high)" }}>High Risk Warning</strong>
              <p style={{ margin: "4px 0 0", color: "#ccc", fontSize: "14px" }}>
                {riskDistribution.high.toFixed(1)}% of your portfolio is in high-risk products.
                Consider adding low or medium risk products for better diversification.
              </p>
            </div>
          </div>
        )}

        {/* PORTFOLIO SUMMARY */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-lg)"
        }}>
          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Total Invested</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--highlight)" }}>
              Rs. {totalInvested.toLocaleString()}
            </div>
          </div>

          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Weighted Return</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--risk-low)" }}>
              {weightedReturn}%
            </div>
          </div>

          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Products</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {items.length}
            </div>
          </div>

          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Projected (1yr)</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--risk-low)" }}>
              Rs. {Math.round(totalInvested * (1 + weightedReturn / 100)).toLocaleString()}
            </div>
          </div>
        </div>

        {/* RISK DISTRIBUTION */}
        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "var(--spacing-md)" }}>Risk Distribution</h3>

          {[
            { label: "Low Risk", key: "low", color: "var(--risk-low)" },
            { label: "Medium Risk", key: "medium", color: "var(--risk-medium)" },
            { label: "High Risk", key: "high", color: "var(--risk-high)" }
          ].map(r => (
            <div key={r.key} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "#aaa" }}>{r.label}</span>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: r.color }}>
                  {riskDistribution[r.key]}%
                </span>
              </div>
              <div style={{ background: "var(--border)", borderRadius: "10px", height: "10px" }}>
                <div style={{
                  width: `${riskDistribution[r.key]}%`,
                  background: r.color,
                  height: "10px",
                  borderRadius: "10px",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* PORTFOLIO ITEMS */}
        <h2 style={{ marginBottom: "var(--spacing-md)" }}>Portfolio Items</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          {items.map(item => {
            const share = ((item.allocatedAmount / totalInvested) * 100).toFixed(1);
            const isEditing = editingId === item.id;

            return (
              <div key={item.id} style={{
                background: "var(--secondary)",
                borderRadius: "var(--radius)",
                padding: "var(--spacing-md)",
                border: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>

                  {/* Left: product info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", marginBottom: "4px" }}>
                      {item.category}
                    </div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{item.name}</h3>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <RiskBadge riskLevel={item.riskLevel} />
                      <span style={{ color: "var(--highlight)", fontWeight: "bold" }}>
                        {item.expectedReturn}% return
                      </span>
                      <span style={{ color: "#aaa", fontSize: "13px" }}>
                        {share}% of portfolio
                      </span>
                    </div>
                  </div>

                  {/* Right: amount + actions */}
                  <div style={{ textAlign: "right" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="number"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          min={item.minInvestment}
                          style={{
                            width: "130px", padding: "6px",
                            background: "var(--accent)", color: "white",
                            border: "1px solid var(--highlight)", borderRadius: "4px"
                          }}
                        />
                        <button
                          onClick={() => handleEditSave(item)}
                          style={{
                            padding: "6px 12px", background: "var(--risk-low)",
                            color: "white", border: "none", borderRadius: "4px", cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: "6px 12px", background: "var(--border)",
                            color: "white", border: "none", borderRadius: "4px", cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                          Rs. {item.allocatedAmount.toLocaleString()}
                        </div>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleEditStart(item)}
                            style={{
                              padding: "6px 14px", background: "var(--accent)",
                              color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
                              fontSize: "13px"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeFromPortfolio(item.id)}
                            style={{
                              padding: "6px 14px", background: "var(--risk-high)",
                              color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
                              fontSize: "13px"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Allocation bar */}
                <div style={{ marginTop: "12px" }}>
                  <div style={{ background: "var(--border)", borderRadius: "10px", height: "6px" }}>
                    <div style={{
                      width: `${share}%`,
                      background: "var(--highlight)",
                      height: "6px",
                      borderRadius: "10px",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Portfolio;