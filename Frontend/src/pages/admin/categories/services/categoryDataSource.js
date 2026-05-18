import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { getCategoriesApi } from "../../../../api/categoryApi";

function extractSearchValue(filter) {
  if (!filter) return "";
  if (typeof filter[0] === "string") return filter[2] ?? "";
  return extractSearchValue(filter[0]);
}

function createCategoryStore() {
  return new CustomStore({
    key: "id",

    load: async (loadOptions) => {
      const pageSize = loadOptions.take ?? 10;
      const skip = loadOptions.skip ?? 0;
      const pageNumber = Math.floor(skip / pageSize) + 1;

      const sort = loadOptions.sort?.[0];
      const sortBy = sort?.selector ?? "name";
      const sortOrder = sort?.desc ? "desc" : "asc";

      const search = extractSearchValue(loadOptions.filter);

      try {
        const res = await getCategoriesApi({
          pageNumber,
          pageSize,
          sortBy,
          sortOrder,
          search,
        });

        const result = res.data?.data;

        return {
          data: result?.items ?? [],
          totalCount: result?.totalCount ?? 0,
        };
      } catch {
        return { data: [], totalCount: 0 };
      }
    },
  });
}

export const categoryDataSource = new DataSource({
  store: createCategoryStore(),
  paginate: true,
  remoteOperations: true,
});