import Link from "next/link";
import React from "react";
import AdminNav from "../adminNav";
import ProductForm from "../productForm";

const ProductEditPage = ({ product }: { product: IProduct }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
      <AdminNav currentPage="products" />

      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl text-center">Update {product.name}</h1>
        <ProductForm type="update" product={product} />
      </div>
    </div>
  );
};

export default ProductEditPage;
