# WealthWise.pk — Dynamic Financial Product Discovery Platform

A React-based financial product discovery platform that allows users to explore, filter, and compare investment products across savings, mutual funds, insurance, and crypto categories. Built with genuine financial logic including a dynamic recommendation engine, portfolio management system, and risk-return calculations.

---

## Live Demo

🔗 [https://wealthwise-pk.vercel.app](https://wealthwise-pk.vercel.app)

---


## Features

### Core Features
- **40 Financial Products** — 20 manually created + 20 fetched and transformed from DummyJSON API
- **6-Filter Product Search** — risk level, category, liquidity, time horizon, return range, and budget — all working simultaneously with AND logic
- **Dynamic Recommendation Engine** — filters products based on user's risk tolerance, investment horizon, liquidity preference and monthly budget
- **Portfolio Builder** — add products, allocate amounts, track weighted return and risk distribution
- **Product Comparison** — compare any 2 products side by side with winner highlighting
- **Return Projection Calculator** — compound interest calculator with adjustable years slider
- **Decision Insight Generator** — dynamically describes product suitability based on attributes
- **Risk Visualization** — color-coded progress bars for risk level representation
- **404 Not Found Page** — for invalid routes
- **Live Market Ticker** — scrolling strip showing PKR market indicators

### Financial Logic
- Weighted return calculation across entire portfolio
- Risk distribution breakdown (low/medium/high percentages)
- High-risk warning when portfolio exceeds 70% high-risk products
- Conservative/moderate/aggressive profile-to-product mapping
- Deterministic API product transformation (same product always gets same attributes)

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | Frontend framework |
| React Router v6 | Client-side routing |
| Context API | Global state management |
| DummyJSON API | External product data source |
| Plain CSS + CSS Variables | Styling (no UI libraries) |
| Vercel | Deployment |
| Git + GitHub | Version control |

---

## Project Structure
src/
├── components/
│   ├── Navbar.js          ← Sticky nav with active route + portfolio badge
│   ├── ProductCard.js     ← Reusable card with hover overlay
│   ├── RiskBadge.js       ← Color-coded risk level badge
│   └── Footer.js          ← Site footer
├── context/
│   ├── PortfolioContext.js    ← Global portfolio state + calculations
│   ├── UserProfileContext.js  ← Global profile state + recommendation engine
│   └── CompareContext.js      ← Product comparison state
├── data/
│   └── products.js        ← 20 manually created financial products
├── pages/
│   ├── Home.js            ← Landing page with featured products
│   ├── Products.js        ← Product listing with 6 filters
│   ├── ProductDetail.js   ← Single product view with calculator
│   ├── Profile.js         ← User financial profile form
│   ├── Recommendations.js ← Personalized product recommendations
│   ├── Portfolio.js       ← Portfolio management page
│   └── NotFound.js        ← 404 page
├── styles/
│   ├── variables.css      ← CSS custom properties (color, spacing, radius)
│   └── global.css         ← Global styles, navbar, cards, animations
└── utils/
├── fetchProducts.js       ← API fetch with error handling
└── transformProducts.js   ← DummyJSON → financial product transformation

---

## Installation and Setup

### Prerequisites
- Node.js v16 or above
- npm v8 or above

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Talha112345/wealthwise-pk.git
cd wealthwise-pk
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm start
```

**4. Open in browser**
http://localhost:3000

---

## Financial Logic Explained

### Data Model
Every product has 8 mandatory attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string/number | Unique identifier |
| name | string | Product name |
| category | enum | savings, investment, insurance, crypto |
| expectedReturn | number | Annual return % |
| riskLevel | enum | low, medium, high |
| liquidity | enum | easy, moderate, locked |
| timeHorizon | enum | short, medium, long |
| minInvestment | number | Minimum amount in PKR |

### Risk-Return Consistency
Data is internally consistent — no low risk product has a return above 7.2%:

| Risk Level | Return Range | Categories |
|-----------|-------------|------------|
| Low | 3% — 7% | Savings, Insurance |
| Medium | 7% — 12% | Investment funds |
| High | 12% — 30% | Crypto assets |

### Recommendation Engine
Products are recommended only when they pass ALL 4 conditions simultaneously:
Step 1 — Risk filter:
conservative → [low]
moderate     → [low, medium]
aggressive   → [low, medium, high]
Step 2 — Horizon filter:
short  → [short]
medium → [short, medium]
long   → [short, medium, long]
Step 3 — Liquidity filter:
easy     → [easy]
moderate → [easy, moderate]
locked   → [easy, moderate, locked]
Step 4 — Budget filter:
product.minInvestment <= user.monthlyCapacity
Step 5 — Sort:
conservative → lowest return first (safest first)
others       → highest return first

### Portfolio Weighted Return Formula
weightedReturn = Σ (allocation / totalInvested) × product.expectedReturn
Example:
₨10,000 at 5.5% + ₨20,000 at 12.8% = ₨30,000 total
= (10000/30000 × 5.5) + (20000/30000 × 12.8)
= 1.83 + 8.53
= 10.37% weighted return

### Return Projection Calculator
Uses compound interest formula:
A = P × (1 + r/100)^t
Where:
A = final amount
P = principal invested
r = expected return %
t = number of years

### API Transformation
DummyJSON products are transformed deterministically:
- Category mapped to financial category (e.g. smartphones → crypto)
- Risk level derived from financial category
- Expected return uses `productId % n` for consistent values (not random)
- ID prefixed with `api-` to avoid collision with manual product IDs

---

## Context Architecture

### PortfolioContext
State:  { items, totalInvested, weightedReturn, riskDistribution }
Functions: addToPortfolio, removeFromPortfolio, updateAllocation
Used by: Navbar, ProductCard, ProductDetail, Portfolio

### UserProfileContext
State:  { profile }
Functions: updateProfile, getRecommendations, isProfileComplete
Used by: Profile, Recommendations, Home

### CompareContext
State:  { compareList } — max 2 products
Functions: addToCompare, removeFromCompare, isInCompare, clearCompare
Used by: ProductDetail

---

## Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with featured products and stats |
| `/products` | Products | All products with 6-filter sidebar |
| `/product/:id` | ProductDetail | Dynamic product detail with calculator |
| `/profile` | Profile | Financial profile form |
| `/recommendations` | Recommendations | Profile-based product recommendations |
| `/portfolio` | Portfolio | Portfolio builder and statistics |
| `*` | NotFound | 404 page for invalid routes |

---

## Key Design Decisions

**Why DummyJSON instead of FakeStore API?**
FakeStore API blocked requests from localhost with a CORS policy error. DummyJSON supports cross-origin requests and has a similar product structure.

**Why Context API instead of prop drilling?**
Portfolio state needs to be accessible in Navbar (for the badge count), ProductCard (to check if already added), and the Portfolio page simultaneously. Passing this through props would require threading it through multiple unrelated components.

**Why prefix API product IDs with `api-`?**
Manual products use IDs 1-20. DummyJSON also returns IDs 1-20. Without prefixing, React would show duplicate key warnings and filters would behave incorrectly when both datasets were combined.

**Why use `productId % n` for return values instead of Math.random()?**
Random values would change on every render, violating the assignment requirement that the same API product always maps to the same financial attributes. Using modulo on the fixed product ID produces consistent, deterministic results.

---

## Styling

- No UI libraries used — all CSS written from scratch
- CSS custom properties defined in `variables.css` for consistent theming
- Finance-themed color scheme: dark charcoal background, gold highlights, green/red for market indicators
- Responsive design for mobile, tablet and desktop
- Smooth CSS transitions for card hover, button state changes and page fade-in

---

## Bonus Features Implemented

| Feature | Details |
|---------|---------|
| Product Comparison | Side by side table with winner highlighting per attribute |
| Return Calculator | Compound interest with adjustable year slider |
| GitHub Repository | 15+ meaningful commits showing progressive development |
| Vercel Deployment | Live application deployed at wealthwise-pk.vercel.app |

---

## Academic Note

This project was built for the Web Programming course at FAST NUCES Islamabad as part of the BS Financial Technology program. All financial logic, data modeling, and transformation functions were implemented with genuine understanding of risk-return relationships, portfolio theory, and investment product characteristics.

AI tools were used for learning React concepts, debugging errors, and understanding CSS techniques. All financial domain logic, data consistency rules, and architectural decisions were made with full understanding of the underlying concepts.

---

*© 2025 WealthWise.pk — For educational purposes only. Data shown is simulated and not financial advice.*