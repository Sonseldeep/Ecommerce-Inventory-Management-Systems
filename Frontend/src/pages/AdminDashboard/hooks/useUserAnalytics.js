import { useEffect, useState } from "react";
import { getUserAnalyticsSummaryApi, getUserPurchaseDetailsApi } from "../../../api/adminApi";

export default function useUserAnalytics() {
  const [userDays, setUserDays] = useState(30);
  const [userSummary, setUserSummary] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getUserAnalyticsSummaryApi(userDays);
      setUserSummary(res.data?.data);
      setSelectedUser(null);
      setUserProducts([]);
    })();
  }, [userDays]);

  const openUser = async (user) => {
    setSelectedUser(user);
    const res = await getUserPurchaseDetailsApi(user.userId, userDays);
    setUserProducts(res.data?.data || []);
  };

  return { userDays, setUserDays, userSummary, selectedUser, userProducts, openUser };
}