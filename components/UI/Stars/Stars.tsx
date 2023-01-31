import dynamic from "next/dynamic";
import { memo } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
const Stars = ({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) => {
  const starsArray = [0, 0, 0, 0, 0];

  for (let i = 0; i <= rating; i++) {
    if (rating - i > 0) {
      if (rating - i >= 1) {
        starsArray[i] = 1;
      } else {
        starsArray[i] = 0.5;
      }
    }
  }
  const convertNumToStar = (num: number, index: number) => {
    if (num === 1) {
      return <TiStarFullOutline key={index} />;
    }
    if (num === 0.5) {
      return <TiStarHalfOutline key={index} />;
    }
    if (num === 0) {
      return <TiStarOutline key={index} />;
    }
  };

  return (
    <div className={`${className} flex text-yellow-400 items-center`}>
      {starsArray.map((val, i) => convertNumToStar(val, i))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(memo(Stars)), { ssr: false });
