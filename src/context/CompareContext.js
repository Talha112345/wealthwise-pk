import { createContext, useState, useContext } from "react";

const CompareContext = createContext();

function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  function addToCompare(product) {
    // Max 2 products at a time
    if (compareList.length >= 2) return;
    // Don't add duplicates
    if (compareList.find(p => String(p.id) === String(product.id))) return;
    setCompareList(prev => [...prev, product]);
  }

  function removeFromCompare(productId) {
    setCompareList(prev => prev.filter(p => String(p.id) !== String(productId)));
  }

  function clearCompare() {
    setCompareList([]);
  }

  function isInCompare(productId) {
    return compareList.some(p => String(p.id) === String(productId));
  }

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

function useCompare() {
  return useContext(CompareContext);
}

export { CompareProvider, useCompare };