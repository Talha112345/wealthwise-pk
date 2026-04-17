import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import fetchProducts from "../utils/fetchProducts";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [riskFilter, setRiskFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [liquidityFilter, setLiquidityFilter] = useState("all");
  const [horizonFilter, setHorizonFilter] = useState("all");
  const [minReturn, setMinReturn] = useState("");
  const [maxReturn, setMaxReturn] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    fetchProducts().then(apiData => {
      if (apiData.length > 0) {
        setAllProducts([...products, ...apiData]);
      } else {
        setAllProducts(products);
      }
      setLoading(false);
    });
  }, []);

  function toggleRisk(value) {
    setRiskFilter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  function toggleCategory(value) {
    setCategoryFilter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  function resetFilters() {
    setRiskFilter([]);
    setCategoryFilter([]);
    setLiquidityFilter("all");
    setHorizonFilter("all");
    setMinReturn("");
    setMaxReturn("");
    setBudgetFilter("");
  }

  // Each filter only applies if it has been set by the user
  const filtered = allProducts.filter(p => {
    // Risk: only filter if at least one checkbox is checked
    if (riskFilter.length > 0 && !riskFilter.includes(p.riskLevel)) return false;

    // Category: only filter if at least one checkbox is checked
    if (categoryFilter.length > 0 && !categoryFilter.includes(p.category)) return false;

    // Liquidity: only filter if not "all"
    if (liquidityFilter !== "all" && p.liquidity !== liquidityFilter) return false;

    // Time horizon: only filter if not "all"
    if (horizonFilter !== "all" && p.timeHorizon !== horizonFilter) return false;

    // Min return: only filter if field is not empty
    if (minReturn !== "" && p.expectedReturn < Number(minReturn)) return false;

    // Max return: only filter if field is not empty
    if (maxReturn !== "" && p.expectedReturn > Number(maxReturn)) return false;

    // Budget: only filter if field is not empty
    if (budgetFilter !== "" && p.minInvestment > Number(budgetFilter)) return false;

    return true;
  });

  const pageStyle = {
    color: "var(--text)",
    minHeight: "100vh",
    background: "var(--primary)"
  };

 const sidebarStyle = {
  width: "240px",
  flexShrink: 0,
  background: "var(--secondary)",
  borderRadius: "var(--radius)",
  padding: "var(--spacing-md)",
  position: "sticky",
  top: "80px",
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
  alignSelf: "flex-start"
};

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
    cursor: "pointer",
    textTransform: "capitalize"
  };

  const inputStyle = {
    width: "100%",
    padding: "6px",
    marginTop: "6px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    boxSizing: "border-box"
  };

  const selectStyle = {
    width: "100%",
    padding: "6px",
    marginTop: "6px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "4px"
  };

  const sectionStyle = {
    marginBottom: "var(--spacing-md)",
    paddingBottom: "var(--spacing-md)",
    borderBottom: "1px solid var(--border)"
  };


  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--spacing-lg)" }}>
        <h1 style={{ marginBottom: "var(--spacing-lg)" }}>All Products</h1>

        <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "flex-start", position: "relative" }}>

          {/* SIDEBAR FILTERS */}
          <div style={sidebarStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button
                onClick={resetFilters}
                style={{
                  background: "var(--highlight)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Reset
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#aaa", marginTop: 0 }}>
              Showing <strong style={{ color: "white" }}>{filtered.length}</strong> of {allProducts.length} products
            </p>

            {/* Risk Level */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>Risk Level</strong>
              <div style={{ marginTop: "8px" }}>
                {["low", "medium", "high"].map(r => (
                  <label key={r} style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={riskFilter.includes(r)}
                      onChange={() => toggleRisk(r)}
                    />
                    <span style={{
                      color: r === "low" ? "var(--risk-low)" : r === "medium" ? "var(--risk-medium)" : "var(--risk-high)"
                    }}>
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>Category</strong>
              <div style={{ marginTop: "8px" }}>
                {["savings", "investment", "insurance", "crypto"].map(c => (
                  <label key={c} style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={categoryFilter.includes(c)}
                      onChange={() => toggleCategory(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Liquidity */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>Liquidity</strong>
              <select value={liquidityFilter} onChange={e => setLiquidityFilter(e.target.value)} style={selectStyle}>
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="locked">Locked</option>
              </select>
            </div>

            {/* Time Horizon */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>Time Horizon</strong>
              <select value={horizonFilter} onChange={e => setHorizonFilter(e.target.value)} style={selectStyle}>
                <option value="all">All</option>
                <option value="short">Short term</option>
                <option value="medium">Medium term</option>
                <option value="long">Long term</option>
              </select>
            </div>

            {/* Return Range */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>Return Range (%)</strong>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <input
                  type="number"
                  value={minReturn}
                  onChange={e => setMinReturn(e.target.value)}
                  placeholder="Min %"
                  style={{ ...inputStyle, width: "50%" }}
                />
                <input
                  type="number"
                  value={maxReturn}
                  onChange={e => setMaxReturn(e.target.value)}
                  placeholder="Max %"
                  style={{ ...inputStyle, width: "50%" }}
                />
              </div>
            </div>

            {/* Budget */}
            <div style={sectionStyle}>
              <strong style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase" }}>My Budget (Rs.)</strong>
              <input
                type="number"
                value={budgetFilter}
                onChange={e => setBudgetFilter(e.target.value)}
                placeholder="e.g. 10000"
                style={inputStyle}
              />
              {budgetFilter !== "" && (
                <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
                  Showing products up to Rs. {Number(budgetFilter).toLocaleString()}
                </p>
              )}
            </div>

          </div>

          {/* PRODUCT GRID */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
                <p>Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px",
                background: "var(--secondary)", borderRadius: "var(--radius)"
              }}>
                <p style={{ fontSize: "18px", color: "#aaa" }}>No products match your filters.</p>
                <button onClick={resetFilters} style={{
                  marginTop: "12px", padding: "10px 20px",
                  background: "var(--highlight)", color: "white",
                  border: "none", borderRadius: "6px", cursor: "pointer"
                }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "var(--spacing-md)"
              }}>
                {filtered.map((p, index) => <ProductCard key={`${p.id}-${index}`} product={p} />)}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Products;