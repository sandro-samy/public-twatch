import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import Select, { GroupBase } from "react-select";
import { motion } from "framer-motion";

const Filter = ({
  brands = [],
  disabled = true,
  setLoading,
}: {
  brands: string[];
  disabled?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [gender, setGender] = useState(router.query.gender || "all");
  const [brand, setBrand] = useState(router.query.brand || "all");
  const [price, setPrice] = useState(router.query.price || "all");
  const [badge, setBadge] = useState(5);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBadge(true);
    }, 0);
  }, []);

  useEffect(() => {
    setGender(router.query.gender || "all");
    setBrand(router.query.brand || "all");
    setPrice(router.query.price || "all");
    let calcBadge = 0;
    router.query.gender && calcBadge++;
    router.query.brand && calcBadge++;
    router.query.price && calcBadge++;
    setBadge(calcBadge);
  }, [isOpen]);

  const genderOptions = [
    { value: "all", label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
  ];
  const brandOptions = [
    { value: "all", label: "All" },
    ...brands.map((brand) => {
      return { value: brand, label: brand };
    }),
  ];
  const priceOptions = [
    { value: "all", label: "All" },
    {
      value: "50-100",
      label: "from 50 to 100",
    },
    {
      value: "100-150",
      label: "from 100 to 150",
    },
    {
      value: "150-200",
      label: "from 150 to 200",
    },
    {
      value: "200-250",
      label: "from 200 to 250",
    },
  ];
  const handleClick = () => {
    let { query } = router;
    setLoading(gender !== "all" || brand !== "all" || price !== "all");
    gender !== "all" ? (query.gender = gender) : delete query.gender;
    brand !== "all" ? (query.brand = brand) : delete query.brand;
    price !== "all" ? (query.price = price) : delete query.price;
    if (Object.keys(query).length <= 1) {
      query = {};
    } else if (gender !== "all" || brand !== "all" || price !== "all") {
      query.page = "1";
    }
    router.push({
      pathname: "/",
      query: query,
    });
    setIsOpen(false);
  };
  return (
    <div className="flex justify-center items-center gap-1 relative">
      <button
        onClick={() => (disabled ? null : setIsOpen((prev) => !prev))}
        className={`flex items-center ${
          disabled ? "text-gray-500" : "text-black"
        } `}
      >
        Filter
        <BiFilterAlt className=" mb-0.5 text-2xl" />
        {showBadge && badge > 0 ? (
          <motion.div
            className={`flex absolute -top-3 -right-3 justify-center items-center w-6 h-6 font-bold text-white ${
              disabled
                ? "bg-red-300 hover:bg-red-300"
                : "bg-red-500 hover:bg-red-700"
            } rounded-full text-xs drop-shadow-xl opacity-50`}
            initial={{ opacity: 0, scale: 0, y: 15, x: -20 }}
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
          <Dialog.Panel className="bg-white p-10 pt-7 rounded-xl card mt-28 md:mt-0 md:mb-36 flex flex-col justify-center">
            <Dialog.Title className="text-xl mb-5 flex justify-center items-center">
              Filter Products...
              <BiFilterAlt className="text-2xl" />
            </Dialog.Title>
            <motion.div
              className="flex flex-col justify-center"
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
              <div className="mb-5">
                <h3 className="text-lg fw-semibold">Gender</h3>
                <Select
                  options={genderOptions}
                  onChange={(e: any) => setGender(e?.value)}
                  isSearchable={false}
                  className="select"
                  value={genderOptions.find(
                    (option: any) => option.value === gender
                  )}
                />
              </div>
              <div className="mb-5">
                <h3 className="text-lg fw-semibold">Brand</h3>
                <Select
                  options={brandOptions}
                  onChange={(e: any) => setBrand(e?.value)}
                  isSearchable={false}
                  className="select"
                  value={brandOptions.find(
                    (option: any) => option.value === brand
                  )}
                />
              </div>
              <div className="mb-7">
                <h3 className="text-lg fw-semibold">Price</h3>
                <Select
                  options={priceOptions}
                  onChange={(e: any) => setPrice(e?.value)}
                  isSearchable={false}
                  className="select"
                  value={priceOptions.find(
                    (option: any) => option.value === price
                  )}
                />
              </div>
              <button className="main-btn m-auto" onClick={handleClick}>
                Show Product
              </button>
            </motion.div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Filter;
