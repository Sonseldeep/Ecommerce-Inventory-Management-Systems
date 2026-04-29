import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductsApi } from "../../api/productApi";
import { addToCartApi } from "../../api/cartApi";
import { useCart } from "../../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [img, setImg] = useState("");
  const [qty, setQty] = useState(1);
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await getProductsApi();
      const p = (res.data?.data || []).find((x) => x.id === id);
      setProduct(p || null);
      setImg(p?.images?.[0]?.imageUrl || "");
    })();
  }, [id]);

  const add = async () => {
    try {
      await addToCartApi({ productId: id, quantity: qty });
      await refreshCartCount();
      toast.success("Added to cart");
      navigate("/cart");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow p-4">
        <img src={img || "https://via.placeholder.com/700x500?text=Product"} className="w-full h-[420px] object-cover rounded-xl" />
        <div className="flex gap-2 mt-3 overflow-auto">
          {(product.images || []).map((im) => (
            <img
              key={im.id}
              src={im.imageUrl}
              onClick={() => setImg(im.imageUrl)}
              className="w-16 h-16 rounded border cursor-pointer object-cover"
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.categoryName}</p>
        <p className="mt-4 text-gray-700 leading-7">{product.description}</p>

        <div className="mt-5 text-2xl font-bold">Rs {product.discountPrice || product.price}</div>

        <div className="mt-4 flex items-center gap-3">
          <button className="border px-3 py-1 rounded" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
          <span>{qty}</span>
          <button className="border px-3 py-1 rounded" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>

        <button onClick={add} className="mt-6 bg-black text-white px-5 py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
}