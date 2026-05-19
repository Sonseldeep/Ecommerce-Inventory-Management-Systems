export default function ProductFilters({
  searchDraft,
  setSearchDraft,
  categoryId,
  setCategoryId,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
  pageInfo,
  onReset,
  onPageReset,
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Search */}
      <input
        className="border rounded-lg p-2"
        placeholder="Search..."
        value={searchDraft}
        onChange={(e) => setSearchDraft(e.target.value)}
      />

      {/* Category */}
      <select
        className="border rounded-lg p-2"
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          onPageReset();
        }}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Price range */}
      <div className="flex gap-2">
        <input
          type="number"
          className="border rounded-lg p-2 w-full"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            onPageReset();
          }}
        />
        <input
          type="number"
          className="border rounded-lg p-2 w-full"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            onPageReset();
          }}
        />
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        <select
          className="border rounded-lg p-2 w-full"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            onPageReset();
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
            onPageReset();
          }}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Footer row: count + reset */}
      <div className="lg:col-span-4 flex justify-between text-sm text-gray-500">
        <p>{pageInfo}</p>
        <button onClick={onReset} className="border px-3 py-1 rounded-lg">
          Reset
        </button>
      </div>
    </div>
  );
}