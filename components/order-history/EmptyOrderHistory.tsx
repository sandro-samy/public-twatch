import Link from "next/link";
import React from "react";
import Lottie from "react-lottie";
import { motion } from "framer-motion";
import { BsArrowLeft } from "react-icons/bs";

const EmptyOrderHistory = () => {
  return (
    <div className="inner-container flex flex-col items-center justify-center gap-10 mx-auto w-4/5">
      <h2 className="text-xl">Order History is empty</h2>
      <div className="w-full" style={{ maxWidth: "450px" }}>
        <Lottie
          options={{
            loop: 0,
            autoplay: true,
            animationData: require("../../public/assets/lottie/empty-table.json"),
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          speed={0.8}
        />
      </div>
      <Link
        href={"/1"}
        className="text-2xl flex items-center gap-4 transition-transform hover:scale-105 hover:underline "
      >
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: -25, opacity: 0 }}
          transition={{
            repeat: Infinity,
            repeatDelay: 0.7,
            duration: 1,
            stiffness: 200,
          }}
        >
          <BsArrowLeft className="text-3xl translate-x-2 " />
        </motion.div>
        Order Now
      </Link>
    </div>
  );
};

export default EmptyOrderHistory;
