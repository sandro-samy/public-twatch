import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ProgressStep = ({
  text = "",
  link = "",
  index,
  total,
  cartState,
  isEntered = false,
  disabled,
}: {
  text: string;
  link?: string;
  index: number;
  total: number;
  cartState: number;
  isEntered: boolean;
  disabled: boolean;
}) => {
  const router = useRouter();
  const circlePosition =
    index === 1
      ? "items-start "
      : index === total
      ? "items-end"
      : "items-center";

  const circleColor = isEntered ? "bg-green-500" : "bg-gray-300";
  const textPosition =
    index === 1 ? "text-left" : index === total ? "text-right" : "text-center";

  return (
    <button
      className={`flex flex-col justify-center ${circlePosition} col-span-1`}
      onClick={() => router.push(link)}
      disabled={disabled}
    >
      <div
        className={`p-5 rounded-full relative ${circleColor} transition-colors`}
      >
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
          {index}
        </div>
      </div>
      <h3 className={textPosition}>{text}</h3>
    </button>
  );
};

export default ProgressStep;
