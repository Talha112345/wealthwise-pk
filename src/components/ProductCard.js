import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import RiskBadge from "./RiskBadge";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { portfolio, addToPortfolio } = usePortfolio();

  const isInPortfolio = portfolio.items.some(item => String(item.id) === String(product.id));

  function handleAdd(e) {
    e.stopPropagation();
    if (!isInPortfolio) {
      addToPortfolio(product, product.minInvestment);
    }
  }

  return (
    <div
      className="product-card fade-in"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", textTransform: "uppercase" }}>
        {product.category}
      </div>

      <h3 style={{ margin: "0 0 10px 0", fontSize: "15px" }}>{product.name}</h3>

      <div style={{ fontSize: "26px", fontWeight: "bold", color: "var(--highlight)", marginBottom: "8px" }}>
        {product.expectedReturn}%
        <span style={{ fontSize: "13px", color: "#aaa", marginLeft: "4px" }}>expected return</span>
      </div>

      <RiskBadge riskLevel={product.riskLevel} />

      <div style={{ marginTop: "10px", fontSize: "13px", color: "#aaa" }}>
        Min: Rs. {product.minInvestment.toLocaleString()}
      </div>

      {/* Hover overlay — now handled by CSS */}
      <div className="overlay">
        <div style={{ fontSize: "13px", marginBottom: "8px" }}>
          <strong>Liquidity:</strong> {product.liquidity} &nbsp;|&nbsp;
          <strong>Horizon:</strong> {product.timeHorizon}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            style={{
              flex: 1, padding: "8px", background: "var(--accent)",
              color: "white", border: "none", borderRadius: "6px", cursor: "pointer"
            }}
          >
            View Details
          </button>
          <button
            onClick={handleAdd}
            style={{
              flex: 1, padding: "8px",
              background: isInPortfolio ? "#2ecc71" : "var(--highlight)",
              color: "white", border: "none", borderRadius: "6px", cursor: "pointer",
              transition: "background 0.3s ease"
            }}
          >
            {isInPortfolio ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;