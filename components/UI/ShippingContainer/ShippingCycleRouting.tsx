import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

const ShippingCycleRouting = ({
  prevLink = "#",
  prevDisabled = true,
  nextLink = "#",
  nextDisabled = false,
  loading,
  setLoading,
}: {
  prevLink: string;
  prevDisabled: boolean;
  nextLink: string;
  nextDisabled: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [nextDisable, setNextDisable] = useState(false);
  const [prevDisable, setPrevDisable] = useState(false);
  const router = useRouter();
  const routeTo = (link: string) => {
    setLoading(true);
    router.push(link);
  };
  useEffect(() => {
    setNextDisable(nextDisabled);
    setPrevDisable(prevDisabled);
  }, []);
  return (
    <div className="absolute bottom-0 right-0 left-0">
      <div className="flex justify-between w-11/12 max-w-2xl mx-auto">
        <button
          className="main-btn flex gap-1 items-center"
          onClick={() => routeTo(prevLink)}
          disabled={loading || prevDisable}
        >
          <RxDoubleArrowLeft /> Prev
        </button>
        <button
          className="main-btn flex gap-1 items-center"
          onClick={() => routeTo(nextLink)}
          disabled={loading || nextDisable}
        >
          Next <RxDoubleArrowRight />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ShippingCycleRouting);
