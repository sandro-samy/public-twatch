import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import { removeItem, updateCount } from "../../../state/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import EmptyCart from "./EmptyCart";
import { motion, useInView } from "framer-motion";
import Pagination from "../../UI/Pagination/Pagination";

const CartPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const items = useAppSelector((store) => store.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { margin: "-100px", once: true });
  const pagesNum = Math.ceil(items.length / 5);
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full">
      <h1 className="text-3xl mb-5">Shopping Cart</h1>
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 max-w-11/12">
          <div className="overflow-x-auto md:col-span-3 mb-6">
            <div className="overflow-y-hidden">
              <table
                className="min-w-full"
                // style={
                //   pagesNum > 1 && currentPage !== pagesNum
                //     ? { minHeight: "500px" }
                //     : {}
                // }
              >
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="px-4">Quantity</th>
                    <th className="px-4">Price</th>
                    <th className="px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .slice((currentPage - 1) * 5, currentPage * 5)
                    .map((item, index) => (
                      <motion.tr
                        className="border-b"
                        key={item._id}
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <th>
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
                        </th>
                        <th>
                          <select
                            name="quantity"
                            id="quantity"
                            value={item.quantity}
                            onChange={(e) =>
                              dispatch(
                                updateCount({
                                  _id: item._id,
                                  count: Number(e.target.value),
                                })
                              )
                            }
                            className="ml-10"
                          >
                            {[
                              ...Array(item.countInStock).fill(
                                0,
                                0,
                                item.countInStock
                              ),
                            ].map((num, index) => (
                              <option value={index + 1} key={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                          </select>
                        </th>
                        <th>$ {item.price}</th>
                        <th>
                          <button
                            className="rounded-full text-rose-700 border-red-700 border-2 px-1.5 hover:bg-rose-700 hover:text-white"
                            onClick={() => dispatch(removeItem(item._id))}
                          >
                            X
                          </button>
                        </th>
                      </motion.tr>
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
          <motion.div
            className="card p-5 md:p-3 lg:p-5 w-fit mx-auto"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={
              isCardInView
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    y: 30,
                  }
            }
            transition={{ delay: 0.35 }}
            ref={cardRef}
          >
            <ul>
              <li className="mb-4">
                <span className="mx-2 whitespace-nowrap">
                  SubTotal{" "}
                  {items.reduce((acc, item) => (acc += item.quantity), 0)}
                </span>
                <span className="mx-2">:</span>
                <span className="mx-2 ">
                  $
                  {items.reduce(
                    (acc, item) => (acc += item.quantity * item.price),
                    0
                  )}
                </span>
              </li>
              <li className="flex justify-center">
                <button
                  className="main-btn m-auto"
                  onClick={() => router.push("/shipping-details")}
                >
                  Check Out
                </button>
              </li>
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(React.memo(CartPage)), {
  ssr: false,
});
