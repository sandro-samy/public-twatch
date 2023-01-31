import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import getError from "../../utils/error";
import Link from "next/link";
import { useRouter } from "next/router";

interface IFormInit {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .min(5, "Minimum 10 Characters")
    .max(40, "Maximum 40 Characters"),
  password: Yup.string()
    .min(6, "Minimun 6 Characters")
    .max(40, "Maximum 40 Characters")
    .required("Required"),
});

const initialValues: IFormInit = { email: "", password: "" };

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirect = router?.query?.redirect;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={async (values, actions) => {
        setLoading(true);
        try {
          const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });
          if (res?.error) {
            toast.error(res.error);
            setLoading(false);
          } else {
            router.push(redirect ? `/${redirect}` : "/");
            toast.success("loged successfully");
          }
        } catch (error: any) {
          setLoading(false);
          toast.error(getError(error));
        }
      }}
    >
      {({ errors, touched }) => (
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
          <Form className="card p-6 h-min w-min flex flex-col justify-center ">
            <div className="text-field">
              <label htmlFor="email" className="mt-2">
                Email*
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
              />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
            </div>
            <div className="text-field ">
              <label htmlFor="password">Password*</label>
              <Field
                id="password"
                name="password"
                placeholder="p@$$W0rd"
                type="password"
              />
              {errors.password && touched.password ? (
                <div>{errors.password}</div>
              ) : null}
            </div>
            <button
              disabled={loading}
              className="main-btn w-40 mx-auto mb-4"
              type="submit"
            >
              Login
            </button>
            <div className="text-sm text-center">
              Don{"'"}t have Account?{" "}
              <Link
                href={redirect ? `/signup?redirect=${redirect}` : "/signup"}
                className="underline font-bold"
              >
                Signup
              </Link>
            </div>
          </Form>
        </motion.div>
      )}
    </Formik>
  );
};

export default LoginForm;
