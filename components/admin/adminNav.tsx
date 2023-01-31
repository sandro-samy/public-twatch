import Link from "next/link";
import React from "react";

const AdminNav = ({ currentPage }: { currentPage: string }) => {
  return (
    <div>
      <ul>
        <li>
          <Link
            href="/admin/dashboard"
            className={`hover:underline ${
              currentPage === "dashboard" ? "font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className={`hover:underline ${
              currentPage === "orders" ? "font-bold" : ""
            }`}
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/admin/products"
            className={`hover:underline ${
              currentPage === "products" ? "font-bold" : ""
            }`}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className={`hover:underline ${
              currentPage === "users" ? "font-bold" : ""
            }`}
          >
            Users
          </Link>
        </li>
        {/* <li>
              <Link href="/admin/reviews" className="hover:underline">
                Reviews
              </Link>
            </li> */}
      </ul>
    </div>
  );
};

export default AdminNav;
