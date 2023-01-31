import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../../state/hooks";
import LoadingPage from "../../UI/Loading/LoadingPage";
import Pagination from "../../UI/Pagination/Pagination";
import AdminNav from "../adminNav";

const fetcher = async (page = 1) => {
  const { data } = await axios.get(`/api/admin/orders?page=` + page);
  return data;
};

const OrdersAdmin = () => {
  const [pagesNum, setPagesNum] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const { data, isLoading, isError } = useQuery(["orders", page], () =>
    fetcher(page)
  );

  useEffect(() => {
    setLoading(isLoading);
    if (data?.orders.length > 0) {
      setOrders(data.orders);
      setPagesNum(data.pagesNum);
    }
  }, [isLoading, data]);

  const width = useAppSelector((state) => state.window.width);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
      <AdminNav currentPage="orders" />
      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl text-center">Orders Dashboard</h1>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div
              className="overflow-x-auto md:col-span-3 max-w-full md:max-w-none"
              style={{ maxWidth: "100vw" }}
            >
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-1 md:px-5 text-left">ID</th>
                    <th className="px-1 md:px-5 text-left">User</th>
                    <th className="p-1 md:p-5 text-left">Date</th>
                    <th className="p-1 md:p-5 text-left">Total</th>
                    <th className="p-1 md:p-5 text-left">Paid</th>
                    <th className="p-1 md:p-5 text-left">Delivered</th>
                    <th className="p-1 md:p-5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: IOrder) => (
                    <tr className="border-b" key={order._id}>
                      <td className="px-1 md:px-5">
                        {order._id.substring(
                          order._id.length - 4,
                          order._id.length
                        )}
                      </td>
                      <td className="p-1 md:p-5">
                        {typeof order?.user === "object"
                          ? order?.user?.name
                          : "Deleted User"}
                      </td>
                      <td className="p-1 md:p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-1 md:p-5">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="p-1 md:p-5">
                        {order.isPaid
                          ? order.paidAt?.substring(0, 10)
                          : "Not Paid"}
                      </td>
                      <td className="p-1 md:p-5">
                        {order.isDelivered
                          ? order.deliveredAt?.substring(0, 10)
                          : "Not Delivered"}
                      </td>
                      <td className="p-1 md:p-5">
                        <Link
                          className="underline font-bold"
                          href={`/order/${order._id}`}
                          onClick={() => setLoading(true)}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagesNum > 1 ? (
              <Pagination
                currentPage={page}
                setState={setPage}
                type="setState"
                pagesNum={pagesNum}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
