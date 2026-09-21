import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareProducts, setCompareProducts] = useState([]);

  function addToCompare(product) {
    setCompareProducts((currentProducts) => {
      if (currentProducts.some((item) => item._id === product._id)) {
        return currentProducts;
      }

      if (currentProducts.length >= 5) {
        return currentProducts;
      }

      if (
        currentProducts.length > 0 &&
        currentProducts[0].comparisonGroup !== product.comparisonGroup
      ) {
        return currentProducts;
      }

      return [...currentProducts, product];
    });
  }

  function removeFromCompare(productId) {
    setCompareProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== productId),
    );
  }

  function isInCompare(productId) {
    return compareProducts.some((product) => product._id === productId);
  }

  function clearCompare() {
    setCompareProducts([]);
  }

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
