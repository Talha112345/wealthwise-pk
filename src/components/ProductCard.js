// I am importing useNavigate so I can go to different pages
import { useNavigate } from "react-router-dom";

// I am importing my portfolio context so I can access and add to the portfolio
import { usePortfolio } from "../context/PortfolioContext";

// I am importing the RiskBadge component to show low/medium/high risk
import RiskBadge from "./RiskBadge";

// This component shows one product card
// It receives a product object as a prop
function ProductCard({ product }) {

  // useNavigate lets me go to another page when user clicks
  const navigate = useNavigate();

  // Getting the portfolio data and the addToPortfolio function from context
  const { portfolio, addToPortfolio } = usePortfolio();

  // I am checking if this product is already in the portfolio
  // I loop through all portfolio items and compare their IDs
  let isInPortfolio = false;
  for (let i = 0; i < portfolio.items.length; i++) {
    if (String(portfolio.items[i].id) === String(product.id)) {
      isInPortfolio = true;
    }
  }

  // This function runs when user clicks the Add button
  function handleAdd(e) {
    // stopPropagation stops the card click from also firing
    // because the button is inside the card
    e.stopPropagation();

    // Only add if not already in portfolio
    if (isInPortfolio === false) {
      addToPortfolio(product, product.minInvestment);
    }
  }

  // This function runs when user clicks the View Details button
  function handleViewDetails(e) {
    // stopPropagation stops the card click from also firing
    e.stopPropagation();
    navigate("/product/" + product.id);
  }

  // This function runs when the whole card is clicked
  function handleCardClick() {
    navigate("/product/" + product.id);
  }

  // I am deciding the button color based on whether product is in portfolio
  let addButtonColor = "var(--highlight)";
  if (isInPortfolio === true) {
    addButtonColor = "#2ecc71";
  }

  // I am deciding the button text based on whether product is in portfolio
  let addButtonText = "Add";
  if (isInPortfolio === true) {
    addButtonText = "Added ✓";
  }

  // Styles I am using for the card elements
  let categoryStyle = {
    fontSize: "11px",
    color: "#aaa",
    marginBottom: "6px",
    textTransform: "uppercase"
  };

  let nameStyle = {
    margin: "0 0 10px 0",
    fontSize: "15px"
  };

  let returnStyle = {
    fontSize: "26px",
    fontWeight: "bold",
    color: "var(--highlight)",
    marginBottom: "8px"
  };

  let returnLabelStyle = {
    fontSize: "13px",
    color: "#aaa",
    marginLeft: "4px"
  };

  let minInvestStyle = {
    marginTop: "10px",
    fontSize: "13px",
    color: "#aaa"
  };

  let overlayInfoStyle = {
    fontSize: "13px",
    marginBottom: "8px"
  };

  let overlayButtonsStyle = {
    display: "flex",
    gap: "8px"
  };

  let viewButtonStyle = {
    flex: 1,
    padding: "8px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  let addButtonStyle = {
    flex: 1,
    padding: "8px",
    background: addButtonColor,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease"
  };

  // Returning the JSX — this is what appears on screen
  return (
    <div className="product-card fade-in" onClick={handleCardClick}>

      {/* Showing the category name at the top */}
      <div style={categoryStyle}>
        {product.category}
      </div>

      {/* Showing the product name */}
      <h3 style={nameStyle}>
        {product.name}
      </h3>

      {/* Showing the expected return percentage */}
      <div style={returnStyle}>
        {product.expectedReturn}%
        <span style={returnLabelStyle}>expected return</span>
      </div>

      {/* Showing the risk badge component */}
      <RiskBadge riskLevel={product.riskLevel} />

      {/* Showing the minimum investment amount */}
      <div style={minInvestStyle}>
        Min: Rs. {product.minInvestment.toLocaleString()}
      </div>

      {/* This overlay appears when user hovers over the card */}
      {/* The CSS handles showing and hiding it on hover */}
      <div className="overlay">

        {/* Showing liquidity and time horizon info */}
        <div style={overlayInfoStyle}>
          <strong>Liquidity:</strong> {product.liquidity} &nbsp;|&nbsp;
          <strong>Horizon:</strong> {product.timeHorizon}
        </div>

        {/* Two buttons side by side */}
        <div style={overlayButtonsStyle}>

          {/* View Details button takes user to the product page */}
          <button onClick={handleViewDetails} style={viewButtonStyle}>
            View Details
          </button>

          {/* Add button adds this product to the portfolio */}
          <button onClick={handleAdd} style={addButtonStyle}>
            {addButtonText}
          </button>

        </div>
      </div>

    </div>
  );
}

export default ProductCard;