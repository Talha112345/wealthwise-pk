import { useUserProfile } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import fetchProducts from "../utils/fetchProducts";

function Recommendations() {
  const { profile, getRecommendations } = useUserProfile();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(apiData => {
      if (apiData.length > 0) {
        setAllProducts([...products, ...apiData]);
      }
      setLoading(false);
    });
  }, []);

  const recommendations = getRecommendations(allProducts);

  // Group recommendations by category
  const grouped = recommendations.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
      Loading recommendations...
    </div>
  );

  // No profile yet
  if (!profile) return (
    <div style={{
      background: "var(--primary)", minHeight: "100vh",
      color: "var(--text)", display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>📋</div>
        <h2>No Profile Found</h2>
        <p style={{ color: "#aaa", marginBottom: "24px" }}>
          You need to create a financial profile first to get personalized recommendations.
        </p>
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "12px 28px", background: "var(--highlight)",
            color: "white", border: "none", borderRadius: "6px",
            cursor: "pointer", fontSize: "16px", fontWeight: "bold"
          }}
        >
          Create My Profile
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--primary)", minHeight: "100vh", color: "var(--text)", padding: "var(--spacing-lg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h1 style={{ marginBottom: "6px" }}>Your Recommendations</h1>
          <p style={{ color: "#aaa" }}>
            Based on your profile — <strong style={{ color: "white", textTransform: "capitalize" }}>{profile.riskTolerance}</strong> risk,{" "}
            <strong style={{ color: "white", textTransform: "capitalize" }}>{profile.investmentHorizon}</strong> horizon,{" "}
            budget of <strong style={{ color: "white" }}>Rs. {Number(profile.monthlyCapacity).toLocaleString()}</strong>
          </p>
        </div>

        {/* Profile summary bar */}
        <div style={{
          background: "var(--secondary)", borderRadius: "var(--radius)",
          padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)",
          display: "flex", gap: "var(--spacing-lg)", flexWrap: "wrap",
          alignItems: "center"
        }}>
          {[
            { label: "Risk", value: profile.riskTolerance },
            { label: "Horizon", value: profile.investmentHorizon },
            { label: "Liquidity", value: profile.liquidityPreference },
            { label: "Goal", value: profile.investmentGoal },
            { label: "Budget", value: `Rs. ${Number(profile.monthlyCapacity).toLocaleString()}` }
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>{item.value}</div>
            </div>
          ))}

          <button
            onClick={() => navigate("/profile")}
            style={{
              marginLeft: "auto", padding: "8px 16px",
              background: "transparent", color: "#aaa",
              border: "1px solid #aaa", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px"
            }}
          >
            Edit Profile
          </button>
        </div>

        {/* No matches */}
        {recommendations.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px",
            background: "var(--secondary)", borderRadius: "var(--radius)"
          }}>
            <div style={{ fontSize: "50px", marginBottom: "16px" }}>🔍</div>
            <h3>No products match your current profile</h3>
            <p style={{ color: "#aaa" }}>Try adjusting your risk tolerance or increasing your budget.</p>
            <button
              onClick={() => navigate("/profile")}
              style={{
                marginTop: "12px", padding: "10px 24px",
                background: "var(--highlight)", color: "white",
                border: "none", borderRadius: "6px", cursor: "pointer"
              }}
            >
              Update Profile
            </button>
          </div>
        )}

        {/* Results count */}
        {recommendations.length > 0 && (
          <p style={{ color: "#aaa", marginBottom: "var(--spacing-md)" }}>
            Found <strong style={{ color: "white" }}>{recommendations.length}</strong> products for you
          </p>
        )}

        {/* Grouped by category */}
        {Object.keys(grouped).map(category => (
          <div key={category} style={{ marginBottom: "var(--spacing-xl)" }}>
            <h2 style={{
              textTransform: "capitalize", marginBottom: "var(--spacing-md)",
              paddingBottom: "8px", borderBottom: "2px solid var(--highlight)",
              display: "inline-block"
            }}>
              {category}
              <span style={{ fontSize: "14px", color: "#aaa", fontWeight: "normal", marginLeft: "10px" }}>
                ({grouped[category].length} products)
              </span>
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "var(--spacing-md)"
            }}>
              {grouped[category].map((p, index) => (
                <ProductCard key={`${p.id}-${index}`} product={p} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Recommendations;