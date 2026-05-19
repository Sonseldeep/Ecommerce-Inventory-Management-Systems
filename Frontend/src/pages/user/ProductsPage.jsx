/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */




import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { addToCartApi } from "../../api/cartApi";
import { getCategoriesApi } from "../../api/categoryApi";
import { getProductsApi } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import useProductRealtime from "../../hooks/userProductRealtime";


import ProductFilters from "../../components/products/ProductFilters";
import ProductCard from "../../components/products/ProductCard";
import ProductPagination from "../../components/products/ProductPagination";

export default function ProductsPage() {
  const { refreshCartCount } = useCart();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [categories, setCategories] = useState([]);
  const [searchDraft, setSearchDraft] = useState("");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchDraft.trim());
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // Load categories once
  useEffect(() => {
    (async () => {
      try {
        const res = await getCategoriesApi({
          pageNumber: 1,
          pageSize: 100,
          sortBy: "name",
          sortOrder: "asc",
        });
        setCategories(res.data?.data?.items || []);
      } catch {
        toast.error("Failed to load categories");
      }
    })();
  }, []);

  // Load products whenever filters / page change
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductsApi({
        search,
        categoryId,
        minPrice: minPrice !== "" ? minPrice : undefined,
        maxPrice: maxPrice !== "" ? maxPrice : undefined,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize,
      });

      const payload = res.data?.data;
      if (payload && Array.isArray(payload.items)) {
        setItems(payload.items);
        setTotalPages(payload.totalPages || 1);
        setTotalCount(payload.totalCount || 0);
      } else {
        setItems([]);
      }
    } catch {
      toast.error("Failed to load products");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, categoryId, minPrice, maxPrice, sortBy, sortOrder, pageNumber, pageSize]);

  // Add to cart
  const addToCart = async (productId) => {
    const product = items.find((p) => p.id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const productCategory = categories.find((c) => c.id === product.categoryId);
    if (productCategory?.isActive === false) {
      toast.error(
        `Cannot add '${product.name}' to cart. This product's category ('${product.categoryName}') is temporarily unavailable.`
      );
      return;
    }

    try {
      await addToCartApi({ productId, quantity: 1 });
      await refreshCartCount();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    }
  };

  // Pagination info label
  const pageInfo = useMemo(() => {
    if (!totalCount) return "No products found";
    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalCount);
    return `Showing ${start}-${end} of ${totalCount}`;
  }, [pageNumber, pageSize, totalCount]);

  // Reset all filters
  const resetFilters = () => {
    setSearchDraft("");
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPageNumber(1);
  };

  // Real-time product updates
  const handleRealtimeProduct = useCallback(
    (product, isNew = false) => {
      setItems((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (isNew && pageNumber === 1) return [product, ...prev];
        if (exists) return prev.map((p) => (p.id === product.id ? product : p));
        return prev;
      });
    },
    [pageNumber]
  );

  useProductRealtime(handleRealtimeProduct);

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Products</h1>

      {/* FILTERS */}
      <ProductFilters
        searchDraft={searchDraft}
        setSearchDraft={setSearchDraft}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        pageInfo={pageInfo}
        onReset={resetFilters}
        onPageReset={() => setPageNumber(1)}
      />

      {/* PRODUCTS */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="bg-white h-80 rounded-2xl shadow animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categories}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <ProductPagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={setPageNumber}
      />
    </div>
  );
}
