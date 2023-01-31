import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../state/hooks";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { BiLoaderCircle } from "react-icons/bi";
import NavbarMenu from "./NavbarMenu";
import ProductSearch from "../UI/Search/ProductSearch";
const Navbar = () => {
  const [popBadge, setPopBadge] = useState(false);
  const items = useAppSelector((state) => state.cart.items);
  const { data: session, status } = useSession();
  useEffect(() => {
    setTimeout(() => {
      setPopBadge(true);
    }, 300);
  }, []);

  return (
    <div
      className={`navbar-bg sticky top-0 z-10 flex w-full justify-between items-center shadow-md mb-5`}
    >
      <div
        className={`navbar py-2.5 md:px-4 flex justify-between
      items-center `}
      >
        <Link href={"/1"}>
          <h2 className="text-3xl tracking-tighter">Twatch</h2>
        </Link>
        <div>
          <ul className="flex justify-center items-center">
            <li className="mr-3">
              <ProductSearch />
            </li>
            <li>
              <Link href={"/cart"} className="p-2 mr-2 relative">
                Cart
                {popBadge && items.length > 0 ? (
                  <motion.div
                    className="flex absolute -top-1 -right-2 justify-center items-center w-6 h-6 font-bold text-white bg-red-500 hover:bg-red-700  rounded-full text-xs drop-shadow-xl opacity-50"
                    initial={{ opacity: 0, scale: 0, y: 15, x: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  >
                    {items.reduce((acc, item) => (acc += item.quantity), 0)}
                  </motion.div>
                ) : (
                  <></>
                )}
              </Link>
            </li>
            <li className="flex ">
              {status === "loading" ? (
                <BiLoaderCircle className="text-xl" />
              ) : session ? (
                <NavbarMenu />
              ) : (
                <Link href={"/login"} className="p-2">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
