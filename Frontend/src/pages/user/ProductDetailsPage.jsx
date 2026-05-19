import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductByIdApi } from "../../api/productApi";
import { addToCartApi } from "../../api/cartApi";
import { getCategoriesApi } from "../../api/categoryApi";
import { useCart } from "../../context/CartContext";

import "./ProductDetailsPage.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const catRes = await getCategoriesApi({
          pageNumber: 1,
          pageSize: 100,
          sortBy: "name",
          sortOrder: "asc",
        });
        setCategories(catRes.data?.data?.items || []);

        const res = await getProductByIdApi(id);
        const p = res.data?.data;
        setProduct(p || null);
        setImg(p?.images?.[0]?.imageUrl || "");

        if (p?.quantityInStock <= 0) {
          setQty(0);
        }
      } catch {
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const add = async () => {
    if (product.quantityInStock <= 0) {
      toast.error("Item is out of stock");
      return;
    }

    const productCategory = categories.find(c => c.id === product.categoryId);
    if (productCategory?.isActive === false) {
      toast.error("Category unavailable");
      return;
    }

    try {
      await addToCartApi({ productId: id, quantity: qty });
      await refreshCartCount();
      toast.success("Added to cart");
      navigate("/cart");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading product...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  const productCategory = categories.find(c => c.id === product.categoryId);
  const isCategoryActive = productCategory?.isActive !== false;

  return (
    <div className="product-page">

      {/* LEFT */}
      <div className="product-images">
        <img
          src={img || "https://via.placeholder.com/700x500"}
          alt={product.name}
          className="product-main-image"
        />

        <div className="product-thumbs">
          {(product.images || []).map(im => (
            <img
              key={im.id}
              src={im.imageUrl}
              onClick={() => setImg(im.imageUrl)}
              className={`product-thumb ${img === im.imageUrl ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="product-details">

        <div>
          <h1 className="product-title">{product.name}</h1>

          <p className="product-category">
            {product.categoryName}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-price">
            Rs {product.discountPrice || product.price}
          </div>

          <p className={`product-stock ${product.quantityInStock <= 0 ? "out" : ""}`}>
            {product.quantityInStock > 0
              ? `In Stock: ${product.quantityInStock}`
              : "Out of Stock"}
          </p>

          {!isCategoryActive && (
            <p className="product-warning">
              This product's category is temporarily unavailable
            </p>
          )}

          <div className="qty-wrapper">
            <span>Quantity:</span>

            <div className="qty-controls">
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1 || product.quantityInStock <= 0 || !isCategoryActive}
              >
                -
              </button>

              <span className="qty-value">{qty}</span>

              <button
                className="qty-btn"
                onClick={() => setQty(q => q + 1)}
                disabled={qty >= product.quantityInStock || !isCategoryActive}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={add}
          disabled={product.quantityInStock <= 0 || !isCategoryActive}
          className="add-cart-btn"
        >
          {!isCategoryActive
            ? "Unavailable"
            : product.quantityInStock <= 0
            ? "Sold Out"
            : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}
