import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductByIdApi } from "../../api/productApi";
import { addToCartApi } from "../../api/cartApi";
import { useCart } from "../../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [img, setImg] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductByIdApi(id);
        const p = res.data?.data;
        setProduct(p || null);
        setImg(p?.images?.[0]?.imageUrl || "");

        // If out of stock, set default quantity to 0
        if (p?.quantityInStock <= 0) {
          setQty(0);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
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

  return (
    <div className="p-6 grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* Left Column: Images */}
      <div className="bg-white rounded-2xl shadow p-4">
        <img
          src={img || "https://via.placeholder.com/700x500?text=No+Image"}
          alt={product.name}
          className="w-full h-105 object-cover rounded-xl transition-all duration-300"
        />
        <div className="flex gap-2 mt-3 overflow-auto pb-2">
          {(product.images || []).map((im) => (
            <img
              key={im.id}
              src={im.imageUrl}
              alt="Thumbnail"
              onClick={() => setImg(im.imageUrl)}
              className={`w-16 h-16 rounded border cursor-pointer object-cover ${
                img === im.imageUrl
                  ? "border-black border-2"
                  : "border-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-1 uppercase tracking-wide text-sm">
            {product.categoryName}
          </p>
          <p className="mt-4 text-gray-700 leading-7">{product.description}</p>

          <div className="mt-5 text-2xl font-bold text-green-700">
            Rs {product.discountPrice || product.price}
          </div>

          {/* Stock Display */}
          <p
            className={`text-sm mt-2 font-medium ${product.quantityInStock <= 0 ? "text-red-500" : "text-gray-500"}`}
          >
            {product.quantityInStock > 0
              ? `In Stock: ${product.quantityInStock}`
              : "Out of Stock"}
          </p>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                className="border px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || product.quantityInStock <= 0}
              >
                -
              </button>

              <span className="w-8 text-center font-bold">{qty}</span>

              <button
                className="border px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                onClick={() => setQty((q) => q + 1)}
                disabled={qty >= product.quantityInStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={add}
          disabled={product.quantityInStock <= 0}
          className="mt-8 w-full md:w-max bg-black text-white px-10 py-3 rounded-lg font-semibold transition-transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {product.quantityInStock <= 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
