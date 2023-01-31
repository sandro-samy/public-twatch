import dynamic from "next/dynamic";
import React, { ReactNode } from "react";
import ProgressStep from "./ProgressStep";
const ShippingProgressBar = ({
  cartState,
  steps,
  links,
  entered = [false, false, false],
  disables = [false, false, false],
  current = 1,
}: {
  cartState: number;
  steps: string[];
  links: string[];
  entered: boolean[];
  disables: boolean[];
  current: number;
}) => {
  const afterShift =
    current === 2
      ? "after:-translate-x-1/2"
      : current === 3
      ? "after:-translate-x-0"
      : "after:-translate-x-full";

  const after =
    "after:absolute after:top-0 after:bottom-0 after:right-0 after:left-0 after:bg-green-600";

  return (
    <div className="relative w-full h-auto">
      <div className="absolute w-full -z-10" style={{ top: "1.15rem" }}>
        <div
          className={`w-11/12 max-w-2xl m-auto  relative overflow-x-hidden  bg-gray-300 h-1 transition-transform ${after} ${afterShift} `}
        ></div>
      </div>
      <div className="grid grid-cols-3 justify-between items-start w-11/12 max-w-2xl m-auto">
        {steps?.map((step, index) => (
          <ProgressStep
            cartState={cartState}
            text={step}
            index={index + 1}
            key={index}
            total={3}
            link={links[index]}
            isEntered={entered[index]}
            disabled={disables[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ShippingProgressBar), {
  ssr: false,
});
