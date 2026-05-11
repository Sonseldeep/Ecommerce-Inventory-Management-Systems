/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { addToCartApi } from "../../api/cartApi";
import { getCategoriesApi } from "../../api/categoryApi";
import { getProductsApi } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import useProductRealtime from "../../hooks/userProductRealtime";

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

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchDraft.trim());
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

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
  }, [
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
  ]);

  const addToCart = async (productId) => {
    // Find the product to check category status
    const product = items.find(p => p.id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const productCategory = categories.find(c => c.id === product.categoryId);
    if (productCategory?.isActive === false) {
      toast.error(`Cannot add '${product.name}' to cart. This product's category ('${product.categoryName}') is temporarily unavailable.`);
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

  const pageInfo = useMemo(() => {
    if (!totalCount) return "No products found";
    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalCount);
    return `Showing ${start}-${end} of ${totalCount}`;
  }, [pageNumber, pageSize, totalCount]);

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

  const handleRealtimeProduct = useCallback(
    (product, isNew = false) => {
      setItems((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (isNew && pageNumber === 1) return [product, ...prev];
        if (exists) return prev.map((p) => (p.id === product.id ? product : p));
        return prev;
      });
    },
    [pageNumber],
  );

  useProductRealtime(handleRealtimeProduct);

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Products</h1>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          className="border rounded-lg p-2"
          placeholder="Search..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPageNumber(1);
            }}
          />
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="border rounded-lg p-2 w-full"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPageNumber(1);
            }}
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>

          <select
            className="border rounded-lg p-2 w-full"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPageNumber(1);
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="lg:col-span-4 flex justify-between text-sm text-gray-500">
          <p>{pageInfo}</p>
          <button
            onClick={resetFilters}
            className="border px-3 py-1 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="bg-white h-80 rounded-2xl shadow animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => {
            const hasDiscount = p.discountPrice > 0;
            const finalPrice = hasDiscount
              ? p.price - p.discountPrice
              : p.price;
            const productCategory = categories.find(c => c.id === p.categoryId);
            const isCategoryActive = productCategory?.isActive !== false;

            return (
              <div key={p.id} className="bg-white rounded-2xl shadow p-4">
                <Link to={`/products/${p.id}`}>
                  <img
                    src={
                      p.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/400"
                    }
                    className="h-44 w-full object-cover rounded-lg"
                    alt={p.name}
                  />
                </Link>

                <h2 className="font-semibold mt-2 line-clamp-1">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.categoryName}</p>
                <p className="text-xs text-gray-500">
                  Stock: {p.quantityInStock}
                </p>
                {!isCategoryActive && (
                  <p className="text-xs font-bold text-red-500 mt-1">
                    Limited Stock
                  </p>
                )}

                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-green-600">
                      Rs {finalPrice.toFixed(2)}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs line-through text-gray-400">
                        Rs {p.price}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={!isCategoryActive}
                    className={`px-3 py-1 rounded-lg ${
                      isCategoryActive
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isCategoryActive ? "Add" : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setPageNumber(page)}
            className={`px-3 py-1 border rounded-lg ${
              pageNumber === page ? "bg-black text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}