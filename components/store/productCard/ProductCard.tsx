import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { addToCart } from "../../../state/cartSlice";
import { toast } from "react-toastify";
import Stars from "../../UI/Stars/Stars";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";
import { useSession } from "next-auth/react";
import { addWishItem, removeWishItem } from "../../../state/authSlice";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
const ProductCard = ({
  product,
  i,
  refetch,
}: {
  product: IProduct;
  i: number;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}) => {
  const { data: session, status } = useSession();
  const { wishList = [] } = useAppSelector((state) => state.auth);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-60px", once: true });
  const width = useAppSelector((state) => state.window.width);
  const dispatch = useAppDispatch();
  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart.`);
  };

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
    typeof refetch !== "undefined" && refetch();
  };

  return (
    <motion.div
      className="m-auto rounded-md w-60 h-96 shadow-around relative"
      initial={{ opacity: 0, y: 20 }}
      animate={(isInView && { opacity: 1, y: 0 }) || { opacity: 0, y: 20 }}
      transition={
        width > 767
          ? { delay: i * 0.15, duration: 0.35 }
          : { delay: 0.15, duration: 0.7 }
      }
      ref={ref}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="card-image h-1/2">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="w-auto h-full m-auto my-5"
            placeholder="blur"
            blurDataURL={product.image}
          />
        </div>
      </Link>

      <button
        className="absolute top-2 right-4 p-3 rounded-full bg-white shadow-around text-red-500 text-2xl"
        onClick={() => handleWishList(product._id)}
      >
        {wishList.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
      </button>
      <div className="h-auto p-4 card-caption">
        <Link href={`/product/${product.slug}`}>
          <h4 className="text-lg text-center card-title">{product.name}</h4>
          <div className="flex justify-center items-center gap-1">
            <Stars rating={product.rating} className="text-lg" />
          </div>
          <p className="text-center text-gray-500">{product.brand}</p>
          <p className="text-center text-gray-500">$ {product.price}</p>
        </Link>

        <div className="flex flex-col items-center justify-center card-actions">
          {/* <Link href={`/product/${product.slug}`}>
            <button className="flex items-center leading-7 btn hover:underline ">
              View <HiArrowLongRight className="ml-1 text-xl" />
            </button>
          </Link> */}
          {product.countInStock > 0 ? (
            <button
              className="btn main-btn "
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="px-4 py-2 text-zinc-700"
            >
              Out Of Stock
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
