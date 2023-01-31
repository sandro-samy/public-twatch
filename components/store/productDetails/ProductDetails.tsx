import Link from "next/link";
import React, { useRef } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { addToCart } from "../../../state/cartSlice";
import { useInView, motion } from "framer-motion";
import { useRouter } from "next/router";
import Stars from "../../UI/Stars/Stars";
import { useQuery } from "react-query";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import useWishList from "../../../hooks/useWishList";
import { addWishItem, removeWishItem } from "../../../state/authSlice";
import { useSession } from "next-auth/react";

const fetcher = async (id: string) => {
  const { data: product } = await axios.get(`/api/product/${id}`);
  return product;
};

const ProductDetails = ({ product }: { product: IProduct }) => {
  const { data } = useQuery(
    product.name,
    async () => await fetcher(product._id)
  );
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const detailsRef = useRef(null);
  const actionRef = useRef(null);
  const detailsInView = useInView(detailsRef, { margin: "-150px", once: true });
  const actionInView = useInView(actionRef, { margin: "-150px", once: true });
  const router = useRouter();
  const width = useAppSelector((state) => state.window.width);
  const { wishList } = useAppSelector((state) => state.auth);

  const handleWishList = async (id: string) => {
    if (status !== "authenticated") {
      toast.warning("You Have to Login First");
      return;
    }
    if (wishList.includes(id)) {
      try {
        dispatch(removeWishItem({ id }));
        await axios.delete(`/api/wishlist?productId=${id}`);
        toast.success(`${product.name} removed from wishlist`);
      } catch (error: any) {
        console.log(error.message);
      }
    } else {
      try {
        dispatch(addWishItem({ id }));
        await axios.post(`/api/wishlist?productId=${id}`);
        toast.success(`${product.name} added from wishlist`);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="mx-5">
      <div className="my-3">
        <Link href="/1" className="flex items-center gap-1 underline">
          <BsArrowLeft /> Back To Store
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="overflow-hidden "
          >
            <Image
              src={product.image}
              alt={product.name}
              width={width > 767 ? 200 : 150}
              height={150}
              className="w-auto h-full m-auto"
              placeholder="blur"
              blurDataURL={product.image}
              priority
            />
          </motion.div>
          <button
            className="absolute top-0 md:top-2 right-10 lg:right-32 p-3 rounded-full bg-white shadow-around text-red-500 text-2xl"
            onClick={() => handleWishList(product._id)}
          >
            {wishList.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={detailsInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.15 }}
          ref={detailsRef}
        >
          <ul className="my-5 md:my-0 mx-auto">
            <li>
              <h1 className="text-3xl text-center mb-3">{product.name}</h1>
            </li>
            <li>Gender : {product.gender}</li>
            <li>Brand : {product.brand}</li>
            <li className="flex items-center gap-1">
              <Stars rating={product.rating} className="text-lg" /> (
              {product.rating})
            </li>
            <li>Description : {product.description}</li>
          </ul>
        </motion.div>
        <motion.div
          className="p-5 h-max card mx-auto w-fit"
          initial={{ y: 20, opacity: 0 }}
          animate={actionInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.3 }}
          ref={actionRef}
        >
          <div className="flex justify-between gap-6 mb-2 ">
            <div>Price</div>
            <div>{product.price}$</div>
          </div>
          <div className="flex justify-between gap-6  mb-4">
            <div>Status</div>
            <div className="ml-1 text-right">
              {product.countInStock > 0 ? "In Stock" : " Out Of Stock"}
            </div>
          </div>
          <div className="flex justify-center">
            {product.countInStock > 0 ? (
              <button
                className="main-btn"
                onClick={() => {
                  dispatch(addToCart(product));
                  router.push("/cart");
                }}
              >
                Add to Cart
              </button>
            ) : (
              <></>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
