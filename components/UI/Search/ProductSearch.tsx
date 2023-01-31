import React, { useState, Fragment, useEffect } from "react";
import Select, { components } from "react-select";
import { BsSearch } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";

const fetcher = async () => {
  const { data } = await axios("/api/product/search");
  return data;
};

const ProductSearch = () => {
  const [optionSelected, setOptionSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const { data } = useQuery("search", fetcher);
  const router = useRouter();

  useEffect(() => {
    if (
      data &&
      typeof data.options !== "undefined" &&
      data?.options?.length > 0
    ) {
      setOptions(data.options);
    }
  }, [data]);
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  const handleRoute = (e: { label: string; value: string } | null) => {
    router.push(`/product/${e?.value}`);
    setIsOpen(false);
  };
  return (
    <div className="flex justify-center items-center gap-1 relative">
      <BsSearch
        className="text-xl mb-0.5"
        onClick={() => setIsOpen((prev) => !prev)}
      />

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
          <Dialog.Panel className="bg-white p-10 pt-7 rounded-xl card mt-28 md:mt-0 md:mb-36">
            <Dialog.Title className="text-xl mb-5 flex justify-center items-center">
              Search Products...
              <BsSearch className="text-2xl" />
            </Dialog.Title>
            
            <Select
              options={options}
              isSearchable={true}
              onChange={(e) => handleRoute(e)}
              className="select"
              // escapeClearsValue
            />
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductSearch;
