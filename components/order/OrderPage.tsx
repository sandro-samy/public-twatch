import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import getError from "../../utils/error";
import Pagination from "../UI/Pagination/Pagination";
import PaypalBtns from "./PaypalBtns";

const fetcher = async (id: string) => {
  const { data } = await axios.get(`/api/order/${id}`);
  return data;
};

const OrderPage = ({ order }: { order: IOrder }) => {
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [currentPage, setCurrentPage] = useState(1);
  const [{ isPending }] = usePayPalScriptReducer();
  const { data, refetch } = useQuery(order._id, () => fetcher(order._id));

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setUpdatedOrder(data);
    }
  }, [data]);

  const {
    orderItems,
    shippingDetails,
    _id,
    user,
    paymentMethod,
    totalPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
    isDelivered,
    isPaid,
  } = updatedOrder;

  const pagesNum = Math.ceil(orderItems.length / 4);

  const { data: session }: { data: any } = useSession();

  const handlerClick = async (id: string, updateObject: {}) => {
    try {
      const { data: updatedOrder } = await axios.put(
        `/api/admin/orders/${id}`,
        updateObject
      );
      router.reload();
    } catch (error: any) {
      toast.error(getError(error));
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl">Order {_id}</h1>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3 p-5">
          <div className="card p-5 mb-5">
            <h2 className="mb-2 text-xl">Shipping Address</h2>
            <div>
              {shippingDetails.fullName}, {shippingDetails.address},
              {shippingDetails.city}, {shippingDetails.phone}
            </div>
            <div className={isDelivered ? "success-alert" : "error-alert"}>
              {isDelivered && updatedOrder.deliveredAt
                ? updatedOrder.deliveredAt
                : "Not Delivered"}
            </div>
          </div>
          <div className="card p-5 mb-5">
            <h2 className="mb-2 text-xl">Payment Method</h2>
            <div>{paymentMethod}</div>
            <div className={isPaid ? "success-alert" : "error-alert"}>
              {isPaid && updatedOrder.paidAt ? updatedOrder.paidAt : "Not Paid"}
            </div>
          </div>
          <div className="card p-5 overflow-x-auto">
            <h2 className="mb-2 text-lg">Order Items</h2>
            <table
              className="min-w-full"
              style={
                pagesNum > 1 && currentPage !== pagesNum
                  ? { minHeight: "450px" }
                  : {}
              }
            >
              <thead className="border-b">
                <tr>
                  <th className="px-5 pr-7 text-left">Items</th>
                  <th className="px-2 text-right md:px-5">Quantity</th>
                  <th className="px-2 text-right md:px-5">Price</th>
                  <th className="px-2 text-right md:px-5">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderItems
                  .slice((currentPage - 1) * 4, currentPage * 4)
                  .map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.image}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2 text-center md:text-right md:p-5">
                        {item.quantity}
                      </td>
                      <td className="p-2 text-right md:p-5">$ {item.price}</td>
                      <td className="p-2 text-right md:p-5">
                        $ {item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {pagesNum > 1 ? (
            <Pagination
              pagesNum={pagesNum}
              currentPage={currentPage}
              setState={setCurrentPage}
              type="setState"
            />
          ) : null}
        </div>
        <div className="p-5 md:px-0">
          <div className="card p-5 min-w-fit">
            <h2 className="mb-2 text-xl text-center">Order Summery</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>$ {itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Shipping Price</div>
                  <div>$ {shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 pb-2 flex justify-between border-b ">
                  <div>Tax</div>
                  <div>$ {taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total</div>
                  <div>$ {totalPrice}</div>
                </div>
              </li>
            </ul>
            <div className="flex flex-col justify-center">
              {session?.isAdmin && !order.isDelivered && order.isPaid ? (
                <button
                  className="main-btn m-auto"
                  onClick={() => handlerClick(order._id, { isDelivered: true })}
                >
                  Mark as Delivered
                </button>
              ) : null}
              {session?.isAdmin &&
              order.paymentMethod === "cash" &&
              !order.isPaid ? (
                <button
                  className="main-btn m-auto"
                  onClick={() => handlerClick(order._id, { isPaid: true })}
                >
                  Mark as Paid{" "}
                </button>
              ) : null}
              {order.paymentMethod === "paypal" && !order.isPaid ? (
                isPending ? (
                  <div>Loading...</div>
                ) : (
                  <div className="m-auto">
                    <PaypalBtns
                      order={updatedOrder}
                      totalPrice={totalPrice}
                      refetch={refetch}
                    />
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
