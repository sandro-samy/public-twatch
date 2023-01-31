import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../../state/hooks";
import LoadingPage from "../../UI/Loading/LoadingPage";
import Pagination from "../../UI/Pagination/Pagination";
import { IoMdAdd } from "react-icons/io";
import AdminNav from "../adminNav";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const fetcher = async (page = 1) => {
  const { data } = await axios.get(`/api/admin/products?page=` + page);
  return data;
};

const ProductsAdmin = () => {
  const [pagesNum, setPagesNum] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setOrders] = useState([]);

  const { data, isLoading, isError, refetch } = useQuery(
    ["products", page],
    () => fetcher(page)
  );

  useEffect(() => {
    setLoading(isLoading);
    if (data?.products.length > 0) {
      setOrders(data.products);
      setPagesNum(data.pagesNum);
    }
  }, [isLoading, data]);

  const width = useAppSelector((state) => state.window.width);
  const router = useRouter();

  const deleteHandler = async (id: string) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/admin/products/${id}`);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 ">
      <AdminNav currentPage="products" />
      <div className="md:col-span-3">
        <div className="grid justify-center w-full">
          <h1 className="text-xl text-center">Products Dashboard</h1>
        </div>
        <div className="flex justify-end w-full">
          <Link
            href={"/admin/products/new-product"}
            className="text-right flex justify-center items-center text-green-500 hover:text-green-700 w-fit  py-2 px-5 "
          >
            <IoMdAdd className="text-2xl" /> Create Product
          </Link>
        </div>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div
              className=" md:col-span-3  overflow-x-auto"
              style={{ maxWidth: "100vw" }}
            >
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-2 md:px-5 text-left">ID</th>
                    <th className="px-2 md:px-5 text-left">Name</th>
                    <th className="p-2 md:p-5 text-left">Price</th>
                    <th className="p-2 md:p-5 text-left">Brand</th>
                    <th className="p-2 md:p-5 text-left">Gender</th>
                    <th className="p-2 md:p-5 text-left">Count</th>
                    <th className="p-2 md:p-5 text-left">Rating</th>
                    <th className="p-2 md:p-5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: IProduct) => (
                    <tr className="border-b" key={product._id}>
                      <td className="px-2 md:px-5">
                        {product._id.substring(
                          product._id.length - 4,
                          product._id.length
                        )}
                      </td>
                      <td className="p-2 md:p-5">{product?.name}</td>
                      <td className="p-2 md:p-5">${product.price}</td>
                      <td className="p-2 md:p-5">{product.brand}</td>
                      <td className="p-2 md:p-5">{product.gender}</td>
                      <td className="p-2 md:p-5">{product.countInStock}</td>
                      <td className="p-2 md:p-5">{product.rating}</td>
                      <td className="p-2 md:p-5">
                        <Link
                          className="font-bold hover:underline "
                          href={`/admin/product/${product._id}`}
                          onClick={() => setLoading(true)}
                        >
                          Edit
                        </Link>
                        <span className="px-0.5">|</span>
                        <button
                          className="font-bold hover:underline text-red-600"
                          onClick={() => deleteHandler(product._id)}
                        >
                          Delete
                        </button>
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

export default ProductsAdmin;
