import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import RiskBadge from "../components/RiskBadge";
import products from "../data/products";

function Home() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  // Featured products — pick the highest return from each category
  const categories = ["savings", "investment", "crypto", "insurance"];
  let featured = [];
for (let i = 0; i < categories.length; i++) {
  let cat = categories[i];
  let best = null;
  for (let j = 0; j < products.length; j++) {
    if (products[j].category === cat) {
      if (best === null || products[j].expectedReturn > best.expectedReturn) {
        best = products[j];
      }
    }
  }
  featured.push(best);
}

  // Quick stats
  const totalProducts = products.length;
  const avgReturn = (products.reduce((sum, p) => sum + p.expectedReturn, 0) / products.length).toFixed(1);
  const lowRiskCount = products.filter(p => p.riskLevel === "low").length;
  const highRiskCount = products.filter(p => p.riskLevel === "high").length;

  const heroStyle = {
    background: "linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)",
    borderRadius: "var(--radius)",
    padding: "60px 40px",
    textAlign: "center",
    marginBottom: "var(--spacing-xl)"
  };

  const statCardStyle = {
    background: "var(--secondary)",
    borderRadius: "var(--radius)",
    padding: "var(--spacing-md)",
    textAlign: "center",
    flex: 1
  };

  const categoryCardStyle = (isHovered) => ({
    background: isHovered ? "var(--highlight)" : "var(--secondary)",
    borderRadius: "var(--radius)",
    padding: "var(--spacing-lg)",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "2px solid transparent",
    flex: 1,
    minWidth: "120px"
  });

  const featuredCardStyle = {
    background: "var(--secondary)",
    borderRadius: "var(--radius)",
    padding: "var(--spacing-md)",
    border: "1px solid var(--border)",
    transition: "transform 0.2s ease",
    cursor: "pointer"
  };

  // Track hovered category card
  const [hoveredCat, setHoveredCat] = useState(null);

  const categoryInfo = {
    savings: { icon: "🏦", desc: "Safe & stable" },
    investment: { icon: "📈", desc: "Growth focused" },
    crypto: { icon: "₿", desc: "High potential" },
    insurance: { icon: "🔒", desc: "Protection plans" }
  };

  return (
    <div style={{ background: "var(--primary)", minHeight: "100vh", color: "var(--text)", padding: "var(--spacing-lg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* HERO SECTION */}
        <div style={heroStyle}>
          <h1 style={{ fontSize: "42px", margin: "0 0 16px 0" }}>
            Stop Guessing. Start Investing
          </h1>
          <p style={{ fontSize: "18px", color: "#ccc", maxWidth: "600px", margin: "0 auto 32px" }}>
            Explore savings, investments, insurance and crypto products tailored to your financial goals and risk appetite.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "14px 32px", background: "var(--highlight)",
                color: "white", border: "none", borderRadius: "6px",
                cursor: "pointer", fontSize: "16px", fontWeight: "bold"
              }}
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate(profile ? "/recommendations" : "/profile")}
              style={{
                padding: "14px 32px", background: "transparent",
                color: "white", border: "2px solid white", borderRadius: "6px",
                cursor: "pointer", fontSize: "16px"
              }}
            >
              {profile ? "View Recommendations" : "Create My Profile"}
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-xl)", flexWrap: "wrap" }}>
          {[
            { label: "Total Products", value: totalProducts, icon: "🛍️" },
            { label: "Avg Expected Return", value: `${avgReturn}%`, icon: "📊" },
            { label: "Low Risk Options", value: lowRiskCount, icon: "💤" },
            { label: "High Return Options", value: highRiskCount, icon: "🚀" }
          ].map(stat => (
            <div key={stat.label} style={statCardStyle}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--highlight)" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CATEGORY NAVIGATION */}
        <h2 style={{ marginBottom: "var(--spacing-md)" }}>Browse by Category</h2>
        <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-xl)", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <div
              key={cat}
              style={categoryCardStyle(hoveredCat === cat)}
              onClick={() => navigate(`/products?category=${cat}`)}
              onMouseEnter={() => setHoveredCat(cat)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{categoryInfo[cat].icon}</div>
              <div style={{ fontWeight: "bold", textTransform: "capitalize", fontSize: "16px" }}>{cat}</div>
              <div style={{ fontSize: "12px", color: hoveredCat === cat ? "#eee" : "#aaa", marginTop: "4px" }}>
                {categoryInfo[cat].desc}
              </div>
            </div>
          ))}
        </div>

        {/* FEATURED PRODUCTS */}
        <h2 style={{ marginBottom: "var(--spacing-md)" }}>Featured Products</h2>
        <p style={{ color: "#aaa", marginTop: "-12px", marginBottom: "var(--spacing-md)", fontSize: "14px" }}>
          Top performer from each category
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-xl)"
        }}>
          {featured.map(p => (
            <div
              key={p.id}
              style={featuredCardStyle}
              onClick={() => navigate(`/product/${p.id}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", marginBottom: "6px" }}>
                {p.category}
              </div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "15px" }}>{p.name}</h3>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--highlight)", marginBottom: "8px" }}>
                {p.expectedReturn}%
                <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "4px" }}>return</span>
              </div>
              <RiskBadge riskLevel={p.riskLevel} />
              <div style={{ marginTop: "10px", fontSize: "13px", color: "#aaa" }}>
                Min: Rs. {p.minInvestment.toLocaleString()}
              </div>
              <button
                onClick={e => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
                style={{
                  marginTop: "12px", width: "100%", padding: "8px",
                  background: "var(--accent)", color: "white",
                  border: "none", borderRadius: "6px", cursor: "pointer"
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* CTA SECTION */}
        {!profile && (
          <div style={{
            background: "linear-gradient(135deg, var(--accent), var(--highlight))",
            borderRadius: "var(--radius)",
            padding: "40px",
            textAlign: "center"
          }}>
            <h2 style={{ margin: "0 0 12px 0" }}>Get Personalized Recommendations</h2>
            <p style={{ color: "#eee", marginBottom: "24px" }}>
              Tell us your financial goals and risk appetite — we'll find the perfect products for you.
            </p>
            <button
              onClick={() => navigate("/profile")}
              style={{
                padding: "14px 32px", background: "white",
                color: "var(--accent)", border: "none", borderRadius: "6px",
                cursor: "pointer", fontSize: "16px", fontWeight: "bold"
              }}
            >
              Create My Profile →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;