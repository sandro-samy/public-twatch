import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { string } from "yup";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import getError from "../../utils/error";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

interface IFormInit {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginSchema = Yup.object().shape({
  name: Yup.string()
    .required("Required")
    .min(2, "Minimun 2 Characters")
    .max(15, "Maximum 15 Characters"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .min(5, "Minimum 10 Characters")
    .max(40, "Maximum 40 Characters"),
  password: Yup.string()
    .required("Required")
    .min(6, "Minimun 6 Characters")
    .max(40, "Maximum 40 Characters"),
  confirmPassword: Yup.string()
    .min(6, "Minimun 6 Characters")
    .max(40, "Maximum 40 Characters")
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const UpdateProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirect = router?.query?.redirect;
  const { data } = useSession();
  const session: any = data;
  const initialValues: IFormInit = {
    name: session?.user?.name,
    email: session?.user?.email,
    password: "",
    confirmPassword: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={async (values, actions) => {
        const { name, email, password } = values;
        setLoading(true);
        try {
          await axios.put("/api/auth/update", {
            name,
            email,
            password,
          });

          const res = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
          });

          if (res?.error) {
            toast.error(res.error);
          } else {
            router.push(redirect ? `/${redirect}` : "/");
            toast.success("loged successfully");
          }
        } catch (error: any) {
          console.log(getError(error));
          toast.error(getError(error));
          setLoading(false);
        }
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
          <Form className="card p-6 h-min w-min flex flex-col justify-center ">
            <div className="text-field">
              <label htmlFor="name" className="mt-2">
                Name*
              </label>
              <Field id="name" name="name" type="text" placeholder="john Deo" />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
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
              <label htmlFor="password">Password</label>
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
            <div className="text-field ">
              <label htmlFor="confirmPassword">Comfirm Password</label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                placeholder="p@$$W0rd"
                type="password"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <div>{errors.confirmPassword}</div>
              ) : null}
            </div>
            <button
              disabled={loading}
              className="main-btn w-40 mx-auto mb-4"
              type="submit"
            >
              Update
            </button>
          </Form>
        </motion.div>
      )}
    </Formik>
  );
};

export default UpdateProfileForm;
