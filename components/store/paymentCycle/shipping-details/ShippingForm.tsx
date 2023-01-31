import { Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import getError from "../../../../utils/error";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../../state/hooks";
import { useRouter } from "next/router";
import { setShippingDetails } from "../../../../state/cartSlice";
interface IFormInit {
  fullName: string;
  city: string;
  address: string;
  phone: string;
}

const LoginSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Required")
    .min(8, "Minimum 8 Characters")
    .max(40, "Maximum 40 Characters"),
  city: Yup.string()
    .min(8, "Minimun 4 Characters")
    .max(20, "Maximum 20 Characters")
    .required("Required"),
  address: Yup.string()
    .min(8, "Minimun 6 Characters")
    .max(40, "Maximum 40 Characters")
    .required("Required"),
  phone: Yup.string()
    .min(8, "Minimun 8 Characters")
    .max(40, "Maximum 40 Characters")
    .matches(/^(201|\+201|01)[0-2,5]{1}[0-9]{8}$/, "InValid Phone Number!")
    .required("Required"),
});

const initialValues: IFormInit = {
  fullName: "",
  city: "",
  address: "",
  phone: "",
};

const ShippingForm = ({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const shipingDetails = useAppSelector((state) => state.cart.shippingDetails);
  return (
    <Formik
      initialValues={shipingDetails !== null ? shipingDetails : initialValues}
      validationSchema={LoginSchema}
      onSubmit={(values, actions) => {
        dispatch(setShippingDetails(values));
        toast("✅ Shipping details Saved.");
        router.push("/payment-method");
        setLoading(true);
      }}
      
    >
      {({ errors, touched, values }) => (
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ delay: 0.25 }}
        >
          <Form className="card p-8 h-min w-min flex flex-col justify-center mb-16">
            <div className="text-field">
              <label htmlFor="fullName">fullName</label>
              <Field
                id="fullName"
                name="fullName"
                type="text"
                placeholder="john doe"
                disabled={loading}
              />
              {errors.fullName && touched.fullName ? (
                <div>{errors.fullName}</div>
              ) : null}
            </div>
            <div className="text-field">
              <label htmlFor="city">city</label>
              <Field
                id="city"
                name="city"
                type="text"
                placeholder="Alexandria"
                disabled={loading}
              />
              {errors.city && touched.city ? <div>{errors.city}</div> : null}
            </div>
            <div className="text-field">
              <label htmlFor="address">address</label>
              <Field
                id="address"
                name="address"
                placeholder="1234 NW Bobcat Lane, St. R...."
                as="textarea"
                rows="1"
                disabled={loading}
              />
              {errors.address && touched.address ? (
                <div>{errors.address}</div>
              ) : null}
            </div>
            <div className="text-field">
              <label htmlFor="phone">phone</label>
              <Field
                id="phone"
                name="phone"
                placeholder="+201212345678"
                type="text"
                disabled={loading}
              />
              {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}
            </div>
            <button
              className="main-btn w-auto mx-auto"
              type="submit"
              disabled={
                loading ||
                !values.fullName ||
                !values.address ||
                !values.city ||
                !values.phone ||
                !!errors.fullName ||
                !!errors.address ||
                !!errors.city ||
                !!errors.phone
              }
            >
              Submit
            </button>
          </Form>
        </motion.div>
      )}
    </Formik>
  );
};

export default ShippingForm;
