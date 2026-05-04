import { useCallback, useEffect, useMemo, useState } from "react";
import { getInventoryAnalyticsApi } from "../../../api/adminApi";
import useAdminAnalyticsRealtime from "../../../hooks/useAdminAnalyticsRealtime";

export default function useInventoryAnalytics() {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await getInventoryAnalyticsApi();
    setData(res.data?.data);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);
  useAdminAnalyticsRealtime(fetchData);

  return {
    data,
    stockBar: useMemo(() => data?.topStockProducts || [], [data]),
    bestSellers: useMemo(() => data?.bestSellersLast30Days || [], [data]),
    notSelling: useMemo(() => data?.notSellingLast30Days || [], [data]),
    categoryStock: useMemo(() => data?.categoryStock || [], [data]),
  };
}