import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../state/hooks";
import LoadingPage from "../UI/Loading/LoadingPage";
import Pagination from "../UI/Pagination/Pagination";
import EmptyOrderHistory from "./EmptyOrderHistory";

const fetcher = async (page = 1) => {
  const { data } = await axios.get(`/api/order/history?page=` + page);
  return data;
};

const OrderHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [pagesNum, setPagesNum] = useState(1);
  const { data, isLoading, isError } = useQuery(["history", page], () =>
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
    <div className="min-h-full h-full w-full flex flex-col items-center ">
      <h1 className="text-3xl mb-5 h-1/6">Orders History</h1>
      {loading ? (
        <LoadingPage />
      ) : isError ? (
        <div className="alert-error"></div>
      ) : orders.length > 0 ? (
        <div className="md:overflow-x-auto max-w-full md:max-w-none">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-1 md:px-5 text-left">ID</th>
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
                    {width < 768
                      ? order._id.substring(
                          order._id.length - 4,
                          order._id.length
                        )
                      : order._id}
                  </td>
                  <td className="p-1 md:p-5">
                    {width < 768
                      ? order.createdAt.substring(0, 10)
                      : order.createdAt}
                  </td>
                  <td className="p-1 md:p-5">
                    $
                    {width < 768
                      ? order.totalPrice.toFixed(0)
                      : order.totalPrice}
                  </td>
                  <td className="p-1 md:p-5">
                    {order.isPaid ? order.paidAt?.substring(0, 10) : "Not Paid"}
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
          {pagesNum > 1 ? (
            <Pagination
              currentPage={page}
              setState={setPage}
              type="setState"
              pagesNum={pagesNum}
            />
          ) : null}
        </div>
      ) : (
        <EmptyOrderHistory />
      )}
    </div>
  );
};

export default OrderHistoryPage;
