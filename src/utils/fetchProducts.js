/**
 * fetchProducts.js
 * Fetches 20 products from DummyJSON API and transforms them
 * into our financial product format using transformToFinancialProduct().
 *
 * Why DummyJSON? The original FakeStore API blocked requests from
 * localhost due to CORS policy. DummyJSON allows cross-origin requests.
 *
 * Each API product gets a prefixed ID ("api-1", "api-2") to avoid
 * key conflicts with our manual products which use IDs 1-20.
 */
import transformToFinancialProduct from "./transformProducts.js";

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=20");

    // If server returns error status, throw immediately
    if (!response.ok) {
      throw new Error("API request failed with status: " + response.status);
    }

    const data = await response.json();

    // DummyJSON wraps products inside a "products" key
    const financialProducts = data.products.map(product => {
      const transformed = transformToFinancialProduct(product);
      // Prefix ID to avoid collisions with manual product IDs
      transformed.id = `api-${product.id}`;
      return transformed;
    });

    return financialProducts;

  } catch (error) {
    // Log error but return empty array so app doesn't crash
    // Manual products will still be shown even if API fails
    console.error("Error fetching products:", error);
    return [];
  }
}

export default fetchProducts;