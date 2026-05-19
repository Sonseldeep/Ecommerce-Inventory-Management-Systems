import { Link } from "react-router-dom";

export default function ProductCard({ product, categories, onAddToCart }) {
  const hasDiscount = product.discountPrice > 0;
  const finalPrice = hasDiscount
    ? product.price - product.discountPrice
    : product.price;

  const productCategory = categories.find((c) => c.id === product.categoryId);
  const isCategoryActive = productCategory?.isActive !== false;

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/400"}
          className="h-44 w-full object-cover rounded-lg"
          alt={product.name}
        />
      </Link>

      <h2 className="font-semibold mt-2 line-clamp-1">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.categoryName}</p>
      <p className="text-xs text-gray-500">Stock: {product.quantityInStock}</p>

      {!isCategoryActive && (
        <p className="text-xs font-bold text-red-500 mt-1">Limited Stock</p>
      )}

      <div className="mt-2 flex justify-between items-center">
        <div>
          <p className="font-bold text-green-600">Rs {finalPrice.toFixed(2)}</p>
          {hasDiscount && (
            <p className="text-xs line-through text-gray-400">Rs {product.price}</p>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
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
}