import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import ShippingCycleRouting from "./ShippingCycleRouting";
const ShippingContainer = ({
  prevLink = "#",
  prevDisabled = true,
  nextLink = "#",
  nextDisabled = false,
  className = "",
  children,
  loading,
  setLoading,
}: {
  prevLink: string;
  prevDisabled: boolean;
  nextLink: string;
  nextDisabled: boolean;
  className?: string;
  children?: ReactNode;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className={`shipping-container  max-w-screen relation ${className}`}>
      {children}
      <ShippingCycleRouting
        prevLink={prevLink}
        nextLink={nextLink}
        nextDisabled={nextDisabled}
        prevDisabled={prevDisabled}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default React.memo(ShippingContainer);
