/**
 * transformProducts.js
 * Transforms raw DummyJSON API products into our financial product format.
 * The transformation is DETERMINISTIC — same API product always gets
 * same financial attributes. No random values on each render.
 */

// Maps DummyJSON categories to our 4 financial categories
const categoryMapping = {
  "smartphones": "crypto",
  "laptops": "investment",
  "fragrances": "savings",
  "skincare": "savings",
  "groceries": "savings",
  "home-decoration": "savings",
  "furniture": "investment",
  "tops": "insurance",
  "womens-dresses": "insurance",
  "womens-shoes": "insurance",
  "mens-shirts": "insurance",
  "mens-shoes": "insurance",
  "mens-watches": "investment",
  "womens-watches": "investment",
  "womens-bags": "savings",
  "womens-jewellery": "savings",
  "sunglasses": "savings",
  "automotive": "investment",
  "motorcycle": "crypto",
  "lighting": "savings"
};

// Maps financial category to appropriate risk level
// crypto = high risk, investment = medium, savings/insurance = low
const riskMapping = {
  "investment": "medium",
  "savings": "low",
  "insurance": "low",
  "crypto": "high"
};

/**
 * Returns a deterministic expected return based on risk level and product ID.
 * Using productId % n ensures same product always gets same return value.
 * low risk:    3% - 7%
 * medium risk: 7% - 12%
 * high risk:   12% - 27%
 */
function getExpectedReturn(riskLevel, productId) {
  if (riskLevel === "low") {
    return parseFloat((3 + (productId % 5)).toFixed(1));
  } else if (riskLevel === "medium") {
    return parseFloat((7 + (productId % 5)).toFixed(1));
  } else {
    return parseFloat((12 + (productId % 15)).toFixed(1));
  }
}

/**
 * Assigns liquidity based on financial category.
 * savings = easy (can withdraw anytime)
 * investment = moderate (takes time to liquidate)
 * insurance = locked (penalty for early withdrawal)
 * crypto = easy (can sell anytime on exchange)
 */
function getLiquidity(category) {
  if (category === "savings") return "easy";
  if (category === "investment") return "moderate";
  if (category === "insurance") return "locked";
  if (category === "crypto") return "easy";
  return "moderate";
}

/**
 * Assigns time horizon based on risk level.
 * Higher risk products require longer time to ride out volatility.
 */
function getTimeHorizon(riskLevel) {
  if (riskLevel === "low") return "short";
  if (riskLevel === "medium") return "medium";
  if (riskLevel === "high") return "long";
  return "medium";
}

/**
 * Main transformation function.
 * Takes one raw DummyJSON product and returns one financial product
 * with all required attributes for our platform.
 */
function transformToFinancialProduct(apiProduct) {
  const category = categoryMapping[apiProduct.category] || "investment";
  const riskLevel = riskMapping[category];
  const expectedReturn = getExpectedReturn(riskLevel, apiProduct.id);
  const liquidity = getLiquidity(category);
  const timeHorizon = getTimeHorizon(riskLevel);

  // Scale price to PKR-like minimum investment amounts
  const minInvestment = Math.round(apiProduct.price * 1000);

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category: category,
    description: apiProduct.description,
    expectedReturn: expectedReturn,
    riskLevel: riskLevel,
    liquidity: liquidity,
    timeHorizon: timeHorizon,
    minInvestment: minInvestment,
    image: apiProduct.thumbnail
  };
}

export default transformToFinancialProduct;