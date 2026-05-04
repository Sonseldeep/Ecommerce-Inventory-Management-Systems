export function buildStockChartData(products) {
  return products
    .slice()
    .sort((a, b) => b.quantityInStock - a.quantityInStock)
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      stock: p.quantityInStock,
      reorder: p.reorderLevel ?? 0,
    }));
}

export function buildCategoryChartData(products, categories) {
  const map = {};
  categories.forEach((c) => (map[c.id] = { category: c.name, count: 0 }));
  products.forEach((p) => {
    if (map[p.categoryId]) map[p.categoryId].count += 1;
  });
  return Object.values(map).filter((d) => d.count > 0);
}

export function buildPriceRangeData(products) {
  const buckets = {
    "0–500": 0,
    "501–1000": 0,
    "1001–2000": 0,
    "2001–5000": 0,
    "5000+": 0,
  };
  products.forEach(({ price }) => {
    if (price <= 500) buckets["0–500"]++;
    else if (price <= 1000) buckets["501–1000"]++;
    else if (price <= 2000) buckets["1001–2000"]++;
    else if (price <= 5000) buckets["2001–5000"]++;
    else buckets["5000+"]++;
  });
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

export function buildInventoryValueData(products) {
  return products
    .map((p) => ({
      name: p.name,
      value: (p.price || 0) * (p.quantityInStock || 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

export function computeKPIs(products, categories) {
  const totalValue = products.reduce(
    (s, p) => s + (p.price || 0) * (p.quantityInStock || 0),
    0
  );
  const lowStock = products.filter(
    (p) => p.quantityInStock <= (p.reorderLevel || 5)
  ).length;
  const activeCount = products.filter((p) => p.isActive).length;

  return {
    total: products.length,
    active: activeCount,
    inactive: products.length - activeCount,
    lowStock,
    categoryCount: categories.length,
    totalValue,
  };
}