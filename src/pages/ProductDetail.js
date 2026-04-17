import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useCompare } from "../context/CompareContext";
import RiskBadge from "../components/RiskBadge";
import products from "../data/products";
import fetchProducts from "../utils/fetchProducts";

function generateDecisionInsight(product) {
  const insights = [];

  if (product.riskLevel === "low") {
    insights.push("Suitable for conservative investors prioritizing capital preservation.");
  } else if (product.riskLevel === "medium") {
    insights.push("Good for moderate investors seeking balanced growth.");
  } else {
    insights.push("Best for aggressive investors comfortable with significant volatility.");
  }

  if (product.liquidity === "locked") {
    insights.push("Requires commitment — early withdrawal may incur penalties.");
  } else if (product.liquidity === "easy") {
    insights.push("Funds can be accessed quickly if needed.");
  }

  if (product.timeHorizon === "long") {
    insights.push("Optimal when held for 5+ years to maximize returns.");
  } else if (product.timeHorizon === "short") {
    insights.push("Suitable for short-term goals within 1-2 years.");
  }

  if (product.expectedReturn > 15) {
    insights.push("High return potential comes with increased market exposure.");
  }

  return insights;
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolio, addToPortfolio } = usePortfolio();
  const { compareList, addToCompare, removeFromCompare, isInCompare, clearCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState("");
  const [years, setYears] = useState(5);
  const [added, setAdded] = useState(false);
  const [showCompare, setShowCompare] = useState(false); // eslint-disable-line

  const isInPortfolio = portfolio.items.some(item => String(item.id) === String(id));

  useEffect(() => {
    const manual = products.find(p => String(p.id) === String(id));
    if (manual) {
      setProduct(manual);
      setInvestAmount(manual.minInvestment);
      setLoading(false);
      return;
    }

    fetchProducts().then(apiData => {
      const found = apiData.find(p => String(p.id) === String(id));
      if (found) {
        setProduct(found);
        setInvestAmount(found.minInvestment);
      }
      setLoading(false);
    });
  }, [id]);

  function handleAddToPortfolio() {
    if (!isInPortfolio) {
      addToPortfolio(product, Number(investAmount));
      setAdded(true);
    }
  }

  function calcReturn(principal, rate, time) {
    return Math.round(principal * Math.pow(1 + rate / 100, time));
  }

  if (loading) return (
    <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
      Loading product...
    </div>
  );

  if (!product) return (
    <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
      <h2>Product not found</h2>
      <button
        onClick={() => navigate("/products")}
        style={{ marginTop: "16px", padding: "10px 20px", background: "var(--highlight)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Back to Products
      </button>
    </div>
  );

  const insights = generateDecisionInsight(product);
  const riskPercent = product.riskLevel === "low" ? 25 : product.riskLevel === "medium" ? 60 : 90;
  const riskColor = product.riskLevel === "low" ? "var(--risk-low)" : product.riskLevel === "medium" ? "var(--risk-medium)" : "var(--risk-high)";
  const projectedAmount = investAmount ? calcReturn(Number(investAmount), product.expectedReturn, years) : 0;
  const profit = projectedAmount - Number(investAmount);

  return (
    <div style={{ background: "var(--primary)", minHeight: "100vh", color: "var(--text)", padding: "var(--spacing-lg)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/products")}
          style={{ background: "transparent", color: "#aaa", border: "1px solid #aaa", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", marginBottom: "var(--spacing-lg)" }}
        >
          ← Back to Products
        </button>

        {/* Header */}
        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-lg)", marginBottom: "var(--spacing-md)" }}>
          <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", marginBottom: "8px" }}>
            {product.category}
          </div>
          <h1 style={{ margin: "0 0 12px 0" }}>{product.name}</h1>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <RiskBadge riskLevel={product.riskLevel} />
            <span style={{ fontSize: "28px", fontWeight: "bold", color: "var(--highlight)" }}>
              {product.expectedReturn}%
              <span style={{ fontSize: "14px", color: "#aaa", marginLeft: "4px" }}>expected return</span>
            </span>
          </div>
          <p style={{ color: "#ccc", marginTop: "12px", lineHeight: "1.6" }}>{product.description}</p>
        </div>

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>

          {/* LEFT: Product attributes */}
          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)" }}>
            <h3 style={{ marginTop: 0 }}>Product Details</h3>
            {[
              { label: "Category", value: product.category },
              { label: "Liquidity", value: product.liquidity },
              { label: "Time Horizon", value: product.timeHorizon },
              { label: "Min Investment", value: `Rs. ${product.minInvestment.toLocaleString()}` },
              { label: "Expected Return", value: `${product.expectedReturn}% per year` }
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "#aaa" }}>{row.label}</span>
                <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>{row.value}</span>
              </div>
            ))}

            {/* Risk bar */}
            <div style={{ marginTop: "var(--spacing-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#aaa" }}>Risk Level</span>
                <span style={{ color: riskColor, fontWeight: "bold", textTransform: "capitalize" }}>{product.riskLevel}</span>
              </div>
              <div style={{ background: "var(--border)", borderRadius: "10px", height: "10px" }}>
                <div style={{
                  width: `${riskPercent}%`,
                  background: riskColor,
                  height: "10px",
                  borderRadius: "10px",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          </div>

          {/* RIGHT: Decision insight */}
          <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)" }}>
            <h3 style={{ marginTop: 0 }}>Who Is This For?</h3>
            {insights.map((insight, i) => (
              <div key={i} style={{
                display: "flex", gap: "10px", marginBottom: "12px",
                padding: "10px", background: "var(--accent)", borderRadius: "6px"
              }}>
                <span style={{ color: "var(--highlight)", fontWeight: "bold" }}>→</span>
                <span style={{ fontSize: "14px", lineHeight: "1.5" }}>{insight}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Return Calculator */}
        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
          <h3 style={{ marginTop: 0 }}>Return Calculator</h3>
          <div style={{ display: "flex", gap: "var(--spacing-md)", flexWrap: "wrap", alignItems: "flex-end" }}>

            <div>
              <label style={{ display: "block", color: "#aaa", marginBottom: "6px", fontSize: "13px" }}>
                Investment Amount (Rs.)
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={e => setInvestAmount(e.target.value)}
                style={{ padding: "10px", background: "var(--accent)", color: "white", border: "none", borderRadius: "6px", width: "180px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#aaa", marginBottom: "6px", fontSize: "13px" }}>
                Years: {years}
              </label>
              <input
                type="range"
                min="1" max="20"
                value={years}
                onChange={e => setYears(Number(e.target.value))}
                style={{ width: "180px" }}
              />
            </div>

            {investAmount && (
              <div style={{ background: "var(--accent)", borderRadius: "6px", padding: "10px 16px" }}>
                <div style={{ fontSize: "13px", color: "#aaa" }}>After {years} year{years > 1 ? "s" : ""}</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "var(--risk-low)" }}>
                  Rs. {projectedAmount.toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", color: "#aaa" }}>
                  Profit: <span style={{ color: "var(--risk-low)" }}>+Rs. {profit.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add to Portfolio */}
        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
          <h3 style={{ marginTop: 0 }}>Add to Portfolio</h3>
          <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "block", color: "#aaa", marginBottom: "6px", fontSize: "13px" }}>
                Amount to Invest (Rs.)
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={e => setInvestAmount(e.target.value)}
                min={product.minInvestment}
                style={{ padding: "10px", background: "var(--accent)", color: "white", border: "none", borderRadius: "6px", width: "180px" }}
              />
              {investAmount && Number(investAmount) < product.minInvestment && (
                <p style={{ color: "var(--risk-high)", fontSize: "12px", margin: "4px 0 0" }}>
                  Minimum is Rs. {product.minInvestment.toLocaleString()}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToPortfolio}
              disabled={isInPortfolio || added || Number(investAmount) < product.minInvestment}
              style={{
                padding: "12px 28px",
                background: (isInPortfolio || added) ? "var(--risk-low)" : "var(--highlight)",
                color: "white", border: "none", borderRadius: "6px",
                cursor: (isInPortfolio || added) ? "default" : "pointer",
                fontWeight: "bold", fontSize: "15px",
                transition: "background 0.3s ease",
                marginTop: "20px"
              }}
            >
              {(isInPortfolio || added) ? "Added to Portfolio ✓" : "Add to Portfolio"}
            </button>
          </div>
        </div>

        {/* Compare Section */}
        <div style={{ background: "var(--secondary)", borderRadius: "var(--radius)", padding: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
            <h3 style={{ margin: 0 }}>Compare Products</h3>
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                style={{ padding: "4px 12px", background: "var(--risk-high)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
              >
                Clear All
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (isInCompare(product.id)) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
              setShowCompare(true);
            }}
            style={{
              padding: "10px 20px",
              background: isInCompare(product.id) ? "var(--risk-low)" : "var(--accent)",
              color: "white", border: "none", borderRadius: "6px",
              cursor: "pointer", marginBottom: "var(--spacing-md)",
              transition: "background 0.3s ease"
            }}
          >
            {isInCompare(product.id) ? "Added to Compare ✓" : "Add This Product to Compare"}
          </button>

          {compareList.length === 0 && (
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              Add this product and one more to compare them side by side.
            </p>
          )}

          {compareList.length === 1 && !isInCompare(product.id) && (
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              1 product added. Navigate to another product and add it to compare.
            </p>
          )}

          {compareList.length === 2 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px", background: "var(--accent)", textAlign: "left" }}>
                      Attribute
                    </th>
                    {compareList.map(p => (
                      <th key={p.id} style={{ padding: "12px", background: "var(--accent)", textAlign: "center", position: "relative" }}>
                        <div>{p.name}</div>
                        <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", marginTop: "2px" }}>
                          {p.category}
                        </div>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          style={{ position: "absolute", top: "4px", right: "4px", background: "transparent", color: "#aaa", border: "none", cursor: "pointer", fontSize: "14px" }}
                        >
                          ✕
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Expected Return",
                      render: (p) => <span style={{ color: "var(--highlight)", fontWeight: "bold" }}>{p.expectedReturn}%</span>,
                      winner: compareList.reduce((a, b) => a.expectedReturn > b.expectedReturn ? a : b).id
                    },
                    {
                      label: "Risk Level",
                      render: (p) => {
                        const color = p.riskLevel === "low" ? "var(--risk-low)" : p.riskLevel === "medium" ? "var(--risk-medium)" : "var(--risk-high)";
                        return <span style={{ color, fontWeight: "bold", textTransform: "capitalize" }}>{p.riskLevel}</span>;
                      },
                      winner: compareList.reduce((a, b) => {
                        const order = { low: 1, medium: 2, high: 3 };
                        return order[a.riskLevel] < order[b.riskLevel] ? a : b;
                      }).id
                    },
                    {
                      label: "Min Investment",
                      render: (p) => `Rs. ${p.minInvestment.toLocaleString()}`,
                      winner: compareList.reduce((a, b) => a.minInvestment < b.minInvestment ? a : b).id
                    },
                    {
                      label: "Liquidity",
                      render: (p) => <span style={{ textTransform: "capitalize" }}>{p.liquidity}</span>,
                      winner: compareList.reduce((a, b) => {
                        const order = { easy: 1, moderate: 2, locked: 3 };
                        return order[a.liquidity] < order[b.liquidity] ? a : b;
                      }).id
                    },
                    {
                      label: "Time Horizon",
                      render: (p) => <span style={{ textTransform: "capitalize" }}>{p.timeHorizon}</span>,
                      winner: null
                    },
                    {
                      label: "Category",
                      render: (p) => <span style={{ textTransform: "capitalize" }}>{p.category}</span>,
                      winner: null
                    }
                  ].map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 === 0 ? "var(--primary)" : "var(--accent)" }}>
                      <td style={{ padding: "12px", color: "#aaa", fontWeight: "bold" }}>{row.label}</td>
                      {compareList.map(p => (
                        <td key={p.id} style={{
                          padding: "12px", textAlign: "center",
                          background: row.winner && String(row.winner) === String(p.id) ? "rgba(46, 204, 113, 0.1)" : "transparent"
                        }}>
                          {row.render(p)}
                          {row.winner && String(row.winner) === String(p.id) && (
                            <span style={{ fontSize: "10px", color: "var(--risk-low)", display: "block", marginTop: "2px" }}>
                              ✓ better
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;