/**
 * products.js
 * Manual financial product dataset — 20 products across 4 categories.
 * Each product follows the mandatory financial data model:
 * - riskLevel must match expectedReturn range (low: 3-7%, medium: 7-12%, high: 12-30%)
 * - liquidity and timeHorizon must be internally consistent
 * - minInvestment is in PKR
 */

const products = [
  {
    id: 1,
    name: "High-Yield Savings Account",
    category: "savings",
    description: " Park your money safely and earn better returns than a regular bank account. Good for emergency funds or short-term goals.",
    expectedReturn: 5.5,
    riskLevel: "low",
    liquidity: "easy",
    timeHorizon: "short",
    minInvestment: 10000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Government Bonds Fund",
    category: "savings",
    description: "Invest in government-backed bonds. Very safe with steady returns over time.",
    expectedReturn: 6.2,
    riskLevel: "low",
    liquidity: "moderate",
    timeHorizon: "medium",
    minInvestment: 25000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Equity Growth Fund",
    category: "investment",
    description: "A diversified fund investing in top Pakistani stocks. Good for long-term wealth building.",
    expectedReturn: 12.8,
    riskLevel: "medium",
    liquidity: "moderate",
    timeHorizon: "long",
    minInvestment: 50000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    name: "Tech Sector Mutual Fund",
    category: "investment",
    description: "Focused on technology companies. Higher potential returns with moderate risk.",
    expectedReturn: 10.5,
    riskLevel: "medium",
    liquidity: "moderate",
    timeHorizon: "medium",
    minInvestment: 30000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 5,
    name: "Blue Chip Stocks Portfolio",
    category: "investment",
    description: "Invest in large, established companies. Balanced risk and reward.",
    expectedReturn: 14.0,
    riskLevel: "high",
    liquidity: "easy",
    timeHorizon: "long",
    minInvestment: 100000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 6,
    name: "Bitcoin Investment",
    category: "crypto",
    description: "Direct exposure to Bitcoin. High potential returns but very volatile.",
    expectedReturn: 25.0,
    riskLevel: "high",
    liquidity: "easy",
    timeHorizon: "long",
    minInvestment: 5000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 7,
    name: "Ethereum Fund",
    category: "crypto",
    description: "Invest in Ethereum, the second largest cryptocurrency. High risk, high reward.",
    expectedReturn: 22.0,
    riskLevel: "high",
    liquidity: "easy",
    timeHorizon: "long",
    minInvestment: 5000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 8,
    name: "Term Life Insurance Plan",
    category: "insurance",
    description: "Comprehensive life coverage with an investment component. Protects your family's future.",
    expectedReturn: 6.5,
    riskLevel: "low",
    liquidity: "locked",
    timeHorizon: "long",
    minInvestment: 15000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 9,
    name: "Health & Investment Plan",
    category: "insurance",
    description: "Covers medical expenses while growing your savings. Dual benefit product.",
    expectedReturn: 5.8,
    riskLevel: "low",
    liquidity: "locked",
    timeHorizon: "long",
    minInvestment: 20000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 10,
    name: "Small Cap Growth Stocks",
    category: "investment",
    description: "High-growth potential through small companies. Significant volatility expected.",
    expectedReturn: 18.5,
    riskLevel: "high",
    liquidity: "easy",
    timeHorizon: "long",
    minInvestment: 75000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 11,
    name: "Fixed Deposit Account",
    category: "savings",
    description: "Lock your money for a fixed period and earn guaranteed returns. No market risk.",
    expectedReturn: 7.0,
    riskLevel: "low",
    liquidity: "locked",
    timeHorizon: "short",
    minInvestment: 50000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 12,
    name: "Balanced Mutual Fund",
    category: "investment",
    description: "Mix of stocks and bonds. Moderate risk for moderate return. Good starting point.",
    expectedReturn: 9.0,
    riskLevel: "medium",
    liquidity: "moderate",
    timeHorizon: "medium",
    minInvestment: 20000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 13,
    name: "Real Estate Investment Trust",
    category: "investment",
    description: "Invest in real estate without buying property. Steady income from rentals.",
    expectedReturn: 11.2,
    riskLevel: "medium",
    liquidity: "moderate",
    timeHorizon: "long",
    minInvestment: 50000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 14,
    name: "Crypto Index Fund",
    category: "crypto",
    description: "Spread across top 10 cryptocurrencies. Less volatile than single crypto bets.",
    expectedReturn: 19.0,
    riskLevel: "high",
    liquidity: "easy",
    timeHorizon: "medium",
    minInvestment: 10000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 15,
    name: "Children Education Fund",
    category: "savings",
    description: "Save systematically for your child's education. Safe and long-term focused.",
    expectedReturn: 6.8,
    riskLevel: "low",
    liquidity: "locked",
    timeHorizon: "long",
    minInvestment: 10000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 16,
    name: "Aggressive Growth Fund",
    category: "investment",
    description: "Maximum growth strategy. Invests in high-risk, high-reward opportunities.",
    expectedReturn: 20.0,
    riskLevel: "high",
    liquidity: "moderate",
    timeHorizon: "long",
    minInvestment: 100000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 17,
    name: "Money Market Fund",
    category: "savings",
    description: "Park your cash safely with slightly better returns than a regular account.",
    expectedReturn: 4.5,
    riskLevel: "low",
    liquidity: "easy",
    timeHorizon: "short",
    minInvestment: 5000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 18,
    name: "Endowment Insurance Plan",
    category: "insurance",
    description: "Life cover plus savings. Matures at a set date with a guaranteed payout.",
    expectedReturn: 7.2,
    riskLevel: "low",
    liquidity: "locked",
    timeHorizon: "long",
    minInvestment: 25000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 19,
    name: "Dividend Income Fund",
    category: "investment",
    description: "Earn regular dividend income from profitable companies. Steady cash flow.",
    expectedReturn: 8.5,
    riskLevel: "medium",
    liquidity: "easy",
    timeHorizon: "medium",
    minInvestment: 30000,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 20,
    name: "DeFi Yield Fund",
    category: "crypto",
    description: "Earn yield through decentralized finance protocols. Cutting-edge but risky.",
    expectedReturn: 30.0,
    riskLevel: "high",
    liquidity: "moderate",
    timeHorizon: "medium",
    minInvestment: 15000,
    image: "https://via.placeholder.com/150"
  }
];

export default products;