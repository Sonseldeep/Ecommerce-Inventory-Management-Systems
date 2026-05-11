/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getMyCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../../api/cartApi";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const load = async () => {
    const res = await getMyCartApi();
    setCart(res.data?.data || { items: [] });
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => Number(cart?.totalAmount || 0), [cart]);

  const getCartItemId = (item) => item.cartItemId || item.id; // critical fix

  const updateQty = async (item, nextQty) => {
    if (nextQty < 1) return;
    const cartItemId = getCartItemId(item);
    try {
      await updateCartItemApi(cartItemId, nextQty);
      await load();
      await refreshCartCount();
    } catch (e) {
      console.log("update cart error", e?.response?.data);
      toast.error(e?.response?.data?.message || "Failed to update cart");
    }
  };

  const removeItem = async (item) => {
    const cartItemId = getCartItemId(item);
    try {
      await removeCartItemApi(cartItemId);
      await load();
      await refreshCartCount();
      toast.success("Item removed");
    } catch (e) {
      console.log("remove cart error", e?.response?.data);
      toast.error(e?.response?.data?.message || "Failed to remove item");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

      {(cart.items || []).length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Your cart is empty 🛒</p>
        </div>
      )}

      {(cart.items || []).map((i) => (
        <div
          key={getCartItemId(i)}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex gap-4 items-center"
        >
          {/* Product Image */}
          <img
            src={i.imageUrl || "/placeholder.png"}
            alt={i.productName}
            className="w-20 h-20 object-cover rounded-xl border"
          />

          {/* Product Info */}
          <div className="flex-1">
            <p className="font-semibold text-lg">{i.productName}</p>
            <p className="text-gray-500 text-sm">Rs  {i.unitPrice}</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => updateQty(i, Number(i.quantity) - 1)}
              >
                −
              </button>
              <span className="px-4">{i.quantity}</span>
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => updateQty(i, Number(i.quantity) + 1)}
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              className="text-sm text-red-500 hover:text-red-700 transition"
              onClick={() => removeItem(i)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Summary Section */}
      {(cart.items || []).length > 0 && (
        <div className="sticky bottom-4 bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-bold">Rs  {total.toFixed(2)}</p>
          </div>

          <button
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            onClick={() => navigate("/checkout")}
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
