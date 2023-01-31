import Link from "next/link";
import React, { Children, ForwardedRef, ReactNode } from "react";

const DropdownLink = (
  {
    href,
    children,
    className = "",
    onClick,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
    onClick: () => void;
  },
  ref: ForwardedRef<unknown>
) => {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default React.forwardRef(DropdownLink);
