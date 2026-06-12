// Mock stock data mapping product IDs (from fake store API) to size variant stock states.
// States can be: "available", "low_stock", or "sold_out".
export const stockData = {
  1: { S: "available", M: "low_stock", L: "sold_out", XL: "available" },
  2: { S: "sold_out", M: "available", L: "available", XL: "low_stock" },
  3: { S: "low_stock", M: "sold_out", L: "available", XL: "available" },
  4: { S: "available", M: "available", L: "low_stock", XL: "sold_out" },
  5: { S: "sold_out", M: "sold_out", L: "available", XL: "available" },
  6: { S: "available", M: "low_stock", L: "available", XL: "low_stock" },
  7: { S: "low_stock", M: "available", L: "sold_out", XL: "available" },
  8: { S: "available", M: "sold_out", L: "low_stock", XL: "available" },
  9: { S: "sold_out", M: "available", L: "available", XL: "available" },
  10: { S: "available", M: "low_stock", L: "sold_out", XL: "sold_out" },
  11: { S: "low_stock", M: "sold_out", L: "available", XL: "available" },
  12: { S: "available", M: "available", L: "low_stock", XL: "low_stock" },
  13: { S: "available", M: "sold_out", L: "available", XL: "sold_out" },
  14: { S: "sold_out", M: "available", L: "low_stock", XL: "available" },
  15: { S: "available", M: "available", L: "available", XL: "available" },
  16: { S: "low_stock", M: "low_stock", L: "low_stock", XL: "low_stock" },
  17: { S: "sold_out", M: "sold_out", L: "sold_out", XL: "sold_out" },
  18: { S: "available", M: "sold_out", L: "available", XL: "available" },
  19: { S: "low_stock", M: "available", L: "available", XL: "low_stock" },
  20: { S: "available", M: "low_stock", L: "sold_out", XL: "available" }
};

export function getProductStock(productId) {
  const id = Number(productId);
  return stockData[id] || { S: "available", M: "available", L: "low_stock", XL: "sold_out" };
}

export function getMaxQuantity(stockState) {
  switch (stockState) {
    case "available":
      return 10;
    case "low_stock":
      return 3;
    case "sold_out":
    default:
      return 0;
  }
}
