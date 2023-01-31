import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../state/hooks";
import { BiEditAlt, BiEdit } from "react-icons/bi";
import Image from "next/image";
import Pagination from "../../../UI/Pagination/Pagination";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetCart } from "../../../../state/cartSlice";
import { toast } from "react-toastify";
import getError from "../../../../utils/error";

const PlaceOrderContent = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();

  const { shippingDetails, paymentMethod, items } = useAppSelector(
    (state) => state.cart
  );
  useEffect(() => {
    if (!loading) {
      if (items.length === 0) {
        setLoading(true);
        router.push("/cart");
      } else if (shippingDetails === null) {
        setLoading(true);
        router.push("/shipping-details");
      } else if (paymentMethod === null) {
        setLoading(true);
        router.push("/payment-method");
      }
    }
  }, [items, shippingDetails, paymentMethod, router]);

  const pagesNum = Math.ceil(items.length / 4);

  const itemsPrice = Number(
    items
      .reduce((acc, item) => {
        acc += item.price * item.quantity;
        return acc;
      }, 0)
      .toFixed(2)
  );

  const shippingPrice = itemsPrice > 250 ? 0 : 15;
  const taxPrice = Number((itemsPrice * 0.14).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/order", {
        orderItems: items,
        shippingDetails,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      dispatch(resetCart());
      router.push(`/order/${data._id}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <div className="grid md:grid-cols-4 md:gap-5 w-screen  max-w-screen-xl mb-10">
      <div className="overflow-x-auto  md:col-span-3 p-5">
        <div className="card p-5 mb-5">
          <h2 className="mb-2 text-lg flex gap-3">
            <span>Shipping Details</span>
            <span>
              <Link
                href="/shipping-details"
                className="flex items-center gap-1 font-bold text-sky-800"
              >
                Edit <BiEdit className="text-xl" />
              </Link>
            </span>
          </h2>
          <div className="flex gap-3 text-gray-600 items-center">
            <span>
              {shippingDetails?.fullName}, {shippingDetails?.address},{" "}
              {shippingDetails?.city}, {shippingDetails?.phone}
            </span>
          </div>
        </div>
        <div className="card p-5 mb-5">
          <h2 className="mb-2 text-lg flex gap-3">
            <span>Payment Method </span>
            <span>
              <Link
                href="/payment-method"
                className="flex items-center gap-1 font-bold text-sky-800"
              >
                Edit <BiEdit className="text-xl" />
              </Link>
            </span>
          </h2>
          <div className="text-gray-600 items-center">
            <span>
              {paymentMethod === "paypal"
                ? "Credit or Debt Card"
                : paymentMethod}
            </span>
          </div>
        </div>
        <div className="card p-5  md:mb-5">
          <div className="overflow-x-auto">
            <h2 className="mb-2 text-lg flex gap-3">
              <span> Order Items</span>
              <span>
                <Link
                  href="/cart"
                  className="flex items-center gap-1 font-bold text-sky-800 text-lg"
                >
                  Edit <BiEdit className="text-xl" />
                </Link>
              </span>
            </h2>
            <table
              className={`min-w-full`}
              style={
                pagesNum > 1 && currentPage !== pagesNum
                  ? { minHeight: "450px" }
                  : {}
              }
            >
              <thead className="border-b">
                <tr>
                  <th className="px-5 pr-7 text-left">Item</th>
                  <th className="px-2 text-right md:px-5">Quantity</th>
                  <th className="px-2 text-right md:px-5">Price</th>
                  <th className="px-2 text-right md:px-5">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items
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
                            className="my-2"
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
              type="setState"
              currentPage={currentPage}
              setState={setCurrentPage}
              pagesNum={pagesNum}
            />
          ) : null}
        </div>
      </div>
      <div className="md:col-span-1 mb-10 md:m-0 p-5 md:px-0 ">
        <div className="card p-5">
          <h2 className="mb-2 text-lg text-center">Order Summary</h2>
          <ul>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Items</div>
                <div>$ {itemsPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Tax</div>
                <div>$ {taxPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between border-b pb-2">
                <div>Shipping</div>
                <div>$ {shippingPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>total</div>
                <div>$ {totalPrice}</div>
              </div>
            </li>
            <li className="flex justify-center">
              <button
                disabled={loading}
                onClick={placeOrder}
                className="main-btn"
              >
                {loading ? "loading..." : "Place Order"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(React.memo(PlaceOrderContent)), {
  ssr: false,
});
