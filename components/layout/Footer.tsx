import Link from "next/link";
import React from "react";

const Footer = () => {
  
  return (
    <div className="w-full flex justify-center items-center md:py-5 py-2 text-center text-black shadow-inner text-sm">
      <div className="w-5/6">
        All Right received to&nbsp;
        <Link
          href="/"
          className="text-black tracking-tighter font-bold text-base"
        >
          Twatch&nbsp;
        </Link>
        developed by&nbsp;
        <Link
          href="https://sandrosamy.vercel.app"
          target="_blank"
          className="text-stone-700 tracking-tighter font-bold transform hover:scale-105 text-base"
        >
          Sandro Samy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
