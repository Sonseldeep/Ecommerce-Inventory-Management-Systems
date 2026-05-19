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

import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const load = async () => {
    const res = await getMyCartApi();
    setCart(res.data?.data || { items: [] });
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => Number(cart?.totalAmount || 0), [cart]);

  const getCartItemId = (item) => item.cartItemId || item.id;

  const updateQty = async (item, nextQty) => {
    if (nextQty < 1) return;
    const cartItemId = getCartItemId(item);

    try {
      await updateCartItemApi(cartItemId, nextQty);
      await load();
      await refreshCartCount();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Out of Stock");
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
      toast.error(e?.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <div className="cart-container">

      <h1 className="cart-title">Shopping Cart</h1>

      {(cart.items || []).length === 0 && (
        <div className="cart-empty">
          Your cart is empty 🛒
        </div>
      )}

      {(cart.items || []).map((i) => (
        <div key={getCartItemId(i)} className="cart-item">

          <img
            src={i.imageUrl || "/placeholder.png"}
            className="cart-image"
            alt={i.productName}
          />

          <div className="cart-info">
            <p className="cart-name">{i.productName}</p>
            <p className="cart-price">Rs {i.unitPrice}</p>
          </div>

          <div className="qty-wrapper">

            <div className="qty-box">
              <button
                className="qty-btn"
                onClick={() => updateQty(i, Number(i.quantity) - 1)}
              >
                −
              </button>

              <span className="qty-value">{i.quantity}</span>

              <button
                className="qty-btn"
                onClick={() => updateQty(i, Number(i.quantity) + 1)}
              >
                +
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(i)}
            >
              Remove
            </button>

          </div>
        </div>
      ))}

      {(cart.items || []).length > 0 && (
        <div className="cart-summary">

          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-bold">Rs {total.toFixed(2)}</p>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Checkout →
          </button>

        </div>
      )}

    </div>
  );
}
