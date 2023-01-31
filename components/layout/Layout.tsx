import React, { ReactNode, memo, useEffect } from "react";
import { Montserrat } from "@next/font/google";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useWindowSize from "../../hooks/useWindowSize";
import { CloseButtonProps, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type closeButtonType = (props: CloseButtonProps) => ReactNode;

const closeButton: closeButtonType = ({ closeToast }) => (
  <div className="flex items-center p-2">
    <button
      onClick={closeToast}
      className="relative rounded-full text-black text-base  border-black border-2 p-2.5 hover:bg-black hover:text-white"
    >
      <p className="absolute inset-0 w-full h-full justify-center items-center text-sm">X</p>
    </button>
  </div>
);

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useWindowSize();
  useUser();
  return (
    <div className={`${montserrat.variable} font-sans min-h-screen w-full`}>
      <Navbar />
      <main className="main-container relative">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={4}
          theme="light"
          closeButton={closeButton}
          style={{ color: "#000", fontSize: "1rem" }}
        />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default memo(Layout);
