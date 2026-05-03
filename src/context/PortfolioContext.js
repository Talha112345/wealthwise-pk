/**
 * PortfolioContext.js
 * Global state for the user's investment portfolio.
 * Provides add, remove, and update functions to all components.
 *
 * Key calculation — Weighted Return:
 * weightedReturn = sum((allocation / total) * product.expectedReturn)
 * This gives the overall expected return of the entire portfolio
 * proportional to how much is invested in each product.
 */
import { createContext, useState, useContext } from "react";

const PortfolioContext = createContext();

function PortfolioProvider({ children }) {

  const [portfolio, setPortfolio] = useState({
    items: [],
    totalInvested: 0,
    weightedReturn: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  });

  // Add a product to portfolio with an allocated amount
  // Prevents duplicate entries by checking ID first
  function addToPortfolio(product, amount) {
    const alreadyExists = portfolio.items.find(item => item.id === product.id);
    if (alreadyExists) return;

    const newItem = { ...product, allocatedAmount: amount };
    const newItems = [...portfolio.items, newItem];
    setPortfolio(calculateStats(newItems));
  }

  // Remove a product from portfolio by ID and recalculate stats
  function removeFromPortfolio(productId) {
    const newItems = portfolio.items.filter(item => item.id !== productId);
    setPortfolio(calculateStats(newItems));
  }

  // Update how much money is allocated to a specific product
  function updateAllocation(productId, newAmount) {
    const newItems = portfolio.items.map(item =>
      item.id === productId ? { ...item, allocatedAmount: newAmount } : item
    );
    setPortfolio(calculateStats(newItems));
  }

  /**
   * Recalculates all portfolio statistics whenever items change.
   * Called after every add, remove, or update operation.
   *
   * Weighted return formula:
   * Each product contributes (its share of total) * (its return rate)
   * Example: Rs.10k in 5% + Rs.20k in 12% with Rs.30k total
   * = (10/30 * 5) + (20/30 * 12) = 1.67 + 8 = 9.67%
   */
  function calculateStats(items) {
    if (items.length === 0) {
      return {
        items: [],
        totalInvested: 0,
        weightedReturn: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 }
      };
    }

    // Sum all allocated amounts
    const totalInvested = items.reduce((sum, item) => sum + item.allocatedAmount, 0);

    // Weighted return — each product weighted by its share of total
   let weightedReturn = 0;
for (let i = 0; i < items.length; i++) {
  let share = items[i].allocatedAmount / totalInvested;
  weightedReturn = weightedReturn + (share * items[i].expectedReturn);
}
weightedReturn = parseFloat(weightedReturn.toFixed(2));

    // How much money is in each risk category
    const riskTotals = { low: 0, medium: 0, high: 0 };
    items.forEach(item => {
      riskTotals[item.riskLevel] += item.allocatedAmount;
    });

    // Convert risk totals to percentages
    const riskDistribution = {
      low: parseFloat(((riskTotals.low / totalInvested) * 100).toFixed(1)),
      medium: parseFloat(((riskTotals.medium / totalInvested) * 100).toFixed(1)),
      high: parseFloat(((riskTotals.high / totalInvested) * 100).toFixed(1))
    };

    return {
      items,
      totalInvested,
      weightedReturn: parseFloat(weightedReturn.toFixed(2)),
      riskDistribution
    };
  }

  return (
    <PortfolioContext.Provider value={{
      portfolio,
      addToPortfolio,
      removeFromPortfolio,
      updateAllocation,
      calculateStats
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook — use this instead of useContext(PortfolioContext) directly
function usePortfolio() {
  return useContext(PortfolioContext);
}

export { PortfolioProvider, usePortfolio };