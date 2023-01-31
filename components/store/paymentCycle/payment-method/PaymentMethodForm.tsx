import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { setPaymentMethod } from "../../../../state/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../../state/hooks";
import { motion } from "framer-motion";
const PaymentMethodForm = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const paymentMethod = useAppSelector((state) => state.cart.paymentMethod);
  return (
    <Formik
      initialValues={
        !!paymentMethod ? { paymentMethod } : { paymentMethod: "" }
      }
      validationSchema={Yup.object({
        paymentMethod: Yup.string().required("payment method is required !"),
      })}
      onSubmit={(values) => {
        setLoading(true);
        dispatch(setPaymentMethod(values));
        toast("✅ Payment Method Saved.");
        router.push("/place-order");
      }}
    >
      {({ errors, values }) => (
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
          <Form className="card p-6 h-min flex flex-col justify-center mb-16">
            {/* <div id="my-radio-group">Picked</div> */}
            <div
              role="group"
              aria-labelledby="my-radio-group"
              className="flex flex-col w-64"
            >
              <div className="mb-3 ml-6">
                <label>
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    className="outline-none focus:ring-0 accent-black"
                    disabled={loading}
                  />
                  &nbsp; Credit or Debt Card
                </label>
              </div>
              <div
                className={!errors.paymentMethod ? "mb-8 ml-6" : "mb-0 ml-6"}
              >
                <label>
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    disabled={loading}
                    className="outline-none focus:ring-0 accent-black"
                  />
                  &nbsp; Cash on Delivery
                </label>
              </div>
              {errors.paymentMethod ? (
                <div className="mb-2 text-red-600">{errors.paymentMethod}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="main-btn m-auto"
              disabled={loading || !values.paymentMethod}
            >
              Submit
            </button>
          </Form>
        </motion.div>
      )}
    </Formik>
  );
};

export default PaymentMethodForm;
