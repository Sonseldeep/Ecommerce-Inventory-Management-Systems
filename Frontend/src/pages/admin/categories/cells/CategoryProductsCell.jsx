export default function CategoryProductsCell({ value }) {
  return <span className="products-count">{value ?? 0}</span>;
}