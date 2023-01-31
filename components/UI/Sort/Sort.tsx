import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment, useEffect } from "react";
import { MdOutlineSort } from "react-icons/md";
import { motion } from "framer-motion";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const Sort = ({
  dir,
  disabled = false,
  setLoading,
}: {
  dir: "left" | "right";
  disabled?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [badge, setBadge] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBadge(true);
    }, 0);
  }, []);

  useEffect(() => {
    router.query.sort ? setBadge(1) : setBadge(0);
  }, [router.query.sort]);
  return (
    <div className="flex justify-center items-center gap-1 relative">
      <button
        onClick={() => (disabled ? null : setIsOpen((prev) => !prev))}
        className={`flex items-center gap-1 ${
          disabled ? "text-gray-500" : "text-black"
        }`}
      >
        {dir === "right" ? "Sort" : ""}
        <MdOutlineSort className="mb-0.5 text-2xl" />
        {dir === "left" ? "Sort" : ""}
        {showBadge && badge > 0 ? (
          <motion.div
            className={`flex absolute -top-3 ${
              dir === "right" ? " -right-3" : " -left-3"
            } justify-center items-center w-6 h-6 font-bold text-white ${
              disabled
                ? "bg-red-300 hover:bg-red-300"
                : "bg-red-500 hover:bg-red-700"
            }  rounded-full text-xs drop-shadow-xl opacity-50`}
            initial={
              dir === "left"
                ? { opacity: 0, scale: 0, y: 15, x: 20 }
                : { opacity: 0, scale: 0, y: 15, x: -20 }
            }
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          >
            {badge}
          </motion.div>
        ) : (
          <></>
        )}
      </button>

      <Transition
        show={isOpen}
        enter="transition duration-150 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-125 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => setIsOpen(false)}
          className="fixed flex justify-center items-start md:items-center right-0 left-0 top-0 bottom-0 min-h-screen h-full z-10 bg-rgba"
        >
          <Dialog.Panel className="bg-white p-7 rounded-xl card mt-28 md:mt-0 md:mb-36 flex flex-col justify-center">
            <Dialog.Title className="text-xl mb-5 flex justify-center items-center">
              Sort Products...
              <MdOutlineSort className="text-2xl" />
            </Dialog.Title>
            <Formik
              initialValues={{ sort: router.query.sort || "all" }}
              validationSchema={Yup.object({
                sort: Yup.string().required("payment method is required !"),
              })}
              onSubmit={(values) => {
                let { query } = router;
                setLoading(values.sort !== "all");
                values.sort !== "all"
                  ? (query.sort = values.sort)
                  : delete query.sort;

                if (Object.keys(query).length <= 1) {
                  query = {};
                } else if (values.sort !== "all") {
                  query.page = "1"
                }
                router.push({
                  pathname: "/",
                  query: query,
                });
                setIsOpen(false);
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
                  <Form className="h-min flex flex-col justify-center">
                    {/* <div id="my-radio-group">Picked</div> */}
                    <div
                      role="group"
                      aria-labelledby="my-radio-group"
                      className="flex flex-col w-64"
                    >
                      <div className="mb-3 ">
                        <label>
                          <Field
                            type="radio"
                            name="sort"
                            value="all"
                            className="outline-none focus:ring-0 accent-black"
                          />
                          &nbsp; All
                        </label>
                      </div>
                      <div className={"mb-3 "}>
                        <label>
                          <Field
                            type="radio"
                            name="sort"
                            value="highest"
                            className="outline-none focus:ring-0 accent-black"
                          />
                          &nbsp; Highest to Lowest Price
                        </label>
                      </div>
                      <div className={"mb-3 "}>
                        <label>
                          <Field
                            type="radio"
                            name="sort"
                            value="lowest"
                            className="outline-none focus:ring-0 accent-black"
                          />
                          &nbsp; Lowest to Highest Price
                        </label>
                      </div>
                      <div className={"mb-3 "}>
                        <label>
                          <Field
                            type="radio"
                            name="sort"
                            value="toprated"
                            className="outline-none focus:ring-0 accent-black"
                          />
                          &nbsp; Top Rated Products
                        </label>
                      </div>
                      <div className={"mb-5"}>
                        <label>
                          <Field
                            type="radio"
                            name="sort"
                            value="newest"
                            className="outline-none focus:ring-0 accent-black"
                          />
                          &nbsp; Newest Products
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="main-btn m-auto">
                      Sort Products
                    </button>
                  </Form>
                </motion.div>
              )}
            </Formik>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Sort;
