import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import getError from "../../utils/error";
import uploadImage from "../../utils/uploadImage";

const productSchema = Yup.object().shape({
  name: Yup.string().required("Required!"),
  slug: Yup.string().required("Required!"),
  price: Yup.number().required("Required!").min(1, "Please add price!"),
  image: Yup.string().required("Required!"),
  gender: Yup.string().required("Required!"),
  brand: Yup.string().required("Required!"),
  countInStock: Yup.number().required("Required!"),
  description: Yup.string().required("Required!"),
});

const ProductForm = ({
  type,
  product,
}: {
  type: "create" | "update";
  product?: IProduct;
}) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(product?.image || "");
  const [uploading, setUploading] = useState(false);
  const initialValues = {
    name: product?.name || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    image: image,
    gender: product?.gender || "",
    brand: product?.brand || "",
    countInStock: product?.countInStock || 0,
    description: product?.description || "",
  };

  const router = useRouter();

  const handlerUpload = async (e: any) => {
    setUploading(true);
    try {
      const res = await uploadImage(e);
      setImage(res.secure_url);
      toast.success("image uploaded successfully!");
      setUploading(false);
    } catch (error: any) {
      toast.error(getError(error));
      setUploading(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={async (values) => {
        try {
          if (type === "update") {
            const { data } = await axios.put(
              `/api/admin/products/${product?._id}`,
              { ...values, image: image || values.image }
            );
            toast.success(data.message);
            router.push("/admin/products");
          } else if (type === "create") {
            const { data } = await axios.post("/api/admin/products", {
              ...values,
              image: image || values.image,
            });
            toast.success(data.message);
            router.push("/admin/products");
          }
        } catch (error: any) {
          toast.error(getError(error));
        }
      }}
    >
      {({ errors, touched, values }) => (
        <div>
          <Form className="p-6 grid  gap-3  justify-center ">
            <div className="text-field  md:col-span-1">
              <label htmlFor="name" className="mt-2">
                Name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Product 1"
                disabled={loading}
              />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="slug" className="mt-2">
                Slug
              </label>
              <Field
                id="slug"
                name="slug"
                type="text"
                placeholder="johndoe@example.com"
                disabled={loading}
              />
              {errors.slug && touched.slug ? <div>{errors.slug}</div> : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="price">Price</label>
              <Field
                id="price"
                name="price"
                placeholder="150"
                type="number"
                disabled={loading}
              />
              {errors.price && touched.price ? <div>{errors.price}</div> : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="image">Image</label>
              <Field
                id="image"
                name="image"
                placeholder="/assets/watches/23.jpg"
                type="text"
                value={image || values.image}
                disabled={loading}
              />
              {errors.image && touched.image ? <div>{errors.image}</div> : null}
            </div>

            <div className="text-field md:col-span-1 flex flex-col overflow-hidden">
              <label htmlFor="upload-image">Upload Image</label>
              <Field
                id="upload-image"
                name="upload-image"
                type="file"
                onChange={handlerUpload}
                disabled={loading}
              />
              {uploading ? <span className="ml-3">Uploading...</span> : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="gender">Gender</label>
              <Field
                id="gender"
                name="gender"
                placeholder="Men"
                type="text"
                disabled={loading}
              />
              {errors.gender && touched.gender ? (
                <div>{errors.gender}</div>
              ) : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="brand">brand</label>
              <Field
                id="brand"
                name="brand"
                placeholder="Fossil"
                type="text"
                disabled={loading}
              />
              {errors.brand && touched.brand ? <div>{errors.brand}</div> : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="countInStock">Count In Stock</label>
              <Field
                id="countInStock"
                name="countInStock"
                placeholder="5"
                type="number"
                disabled={loading}
              />
              {errors.countInStock && touched.countInStock ? (
                <div>{errors.countInStock}</div>
              ) : null}
            </div>
            <div className="text-field  md:col-span-1">
              <label htmlFor="description">Description</label>
              <Field
                id="description"
                name="description"
                placeholder="Fossil watch for men metal body, leather strap black and silver watch."
                type="textarea"
                disabled={loading}
              />
              {errors.description && touched.description ? (
                <div>{errors.description}</div>
              ) : null}
            </div>
            <button
              disabled={loading}
              className="main-btn w-40 mx-auto mb-4 md:col-span-2"
              type="submit"
            >
              {type === "update" ? "Update" : "Create"}
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ProductForm;
