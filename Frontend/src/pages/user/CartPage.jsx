
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMyCartApi, removeCartItemApi, updateCartItemApi } from "../../api/cartApi";
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
  useEffect(() => { load(); }, []);

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
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">My Cart</h1>

      {(cart.items || []).map((i) => (
        <div key={getCartItemId(i)} className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{i.productName}</p>
            <p className="text-sm text-gray-500">₹ {i.unitPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 border rounded" onClick={() => updateQty(i, Number(i.quantity) - 1)}>-</button>
            <span>{i.quantity}</span>
            <button className="w-8 h-8 border rounded" onClick={() => updateQty(i, Number(i.quantity) + 1)}>+</button>
            <button className="ml-3 text-red-600" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <p className="font-bold text-lg">Total: ₹ {total.toFixed(2)}</p>
        <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}