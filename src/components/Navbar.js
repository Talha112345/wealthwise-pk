import { NavLink } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";

function Navbar() {
  const { portfolio } = usePortfolio();
  const count = portfolio.items.length;

  return (
    <>
      {/* Ticker strip */}
      <div className="ticker-strip">
        <div className="ticker-content">
          {[
            { name: "BTC/PKR", value: "₨ 8,842,300", change: "+2.4%", up: true },
            { name: "Gold", value: "₨ 24,150/g", change: "+0.8%", up: true },
            { name: "KSE-100", value: "108,432", change: "-0.3%", up: false },
            { name: "USD/PKR", value: "₨ 278.50", change: "+0.1%", up: true },
            { name: "ETH/PKR", value: "₨ 612,400", change: "+1.9%", up: true },
            { name: "T-Bills 3M", value: "21.5%", change: "stable", up: true },
            { name: "BTC/PKR", value: "₨ 8,842,300", change: "+2.4%", up: true },
            { name: "Gold", value: "₨ 24,150/g", change: "+0.8%", up: true },
            { name: "KSE-100", value: "78,432", change: "-0.3%", up: false },
            { name: "USD/PKR", value: "₨ 278.50", change: "+0.1%", up: true },
            { name: "ETH/PKR", value: "₨ 612,400", change: "+1.9%", up: true },
            { name: "T-Bills 3M", value: "21.5%", change: "stable", up: true },
          ].map((item, i) => (
            <span key={i} className="ticker-item">
              <span style={{ color: "var(--text)" }}>{item.name}</span>
              <span>{item.value}</span>
              <span className={item.up ? "up" : "down"}>{item.change}</span>
            </span>
          ))}
        </div>
      </div>

      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
  WealthWise<span>.pk</span>
</NavLink>
        <div className="navbar-links">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/products", label: "Products" },
            { to: "/recommendations", label: "Recommendations" },
            { to: "/portfolio", label: "Portfolio" },
            { to: "/profile", label: "My Profile" },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
            >
              {link.label}
              {link.label === "Portfolio" && count > 0 && (
                <span className="navbar-portfolio-badge">{count}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navbar;