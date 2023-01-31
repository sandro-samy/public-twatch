import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const NavigationButton = ({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`${
        disabled ? "text-gray-300 border-gray-300" : ""
      } flex justify-center items-center border-2 border-black`}
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Pagination = ({
  pagesNum,
  currentPage = 1,
  type = "route",
  setState = undefined,
}: {
  pagesNum: number;
  currentPage?: number;
  type?: "route" | "setState" | "query";
  setState?: React.Dispatch<React.SetStateAction<number>> | undefined;
}) => {
  const router = useRouter();
  if (pagesNum <= 1) {
    return <></>;
  }

  const pagesArray = [];
  for (let i = 1; i <= pagesNum; i++) {
    pagesArray.push(i);
  }

  const routeTo = (page: number) => {
    if (type === "setState") {
      typeof setState !== "undefined" && setState(page);
    } else if (type === "route") {
      const link: string = router.asPath
        .split("/")
        .map((s: string, i: number) => {
          return router.asPath.split("/").length - 1 === i
            ? (page).toString()
            : s;
        })
        .join("/");
      router.push(link);
    } else if (type === "query") {
      const { query } = router;
      query.page = page.toString();
      router.push({
        pathname: "/",
        query: query,
      });
    }
  };
  return (
    <div className="mt-5 flex justify-center items-center">
      <NavigationButton
        onClick={() =>
          routeTo(currentPage !== 1 ? currentPage - 1 : currentPage)
        }
        disabled={currentPage === 1}
      >
        <IoIosArrowBack className="text-xl" />
      </NavigationButton>
      <div className="flex justify-center items-center gap-2 px-5 text-xl">
        {pagesArray.map((num, i) => (
          <button
            onClick={() => routeTo(num)}
            disabled={num === currentPage}
            className={num === currentPage ? "underline" : "text-gray-900"}
            key={i}
          >
            {num}
          </button>
        ))}
      </div>
      <NavigationButton
        onClick={() =>
          routeTo(currentPage !== pagesNum ? currentPage + 1 : currentPage)
        }
        disabled={currentPage === pagesNum}
      >
        <IoIosArrowForward className="text-xl" />
      </NavigationButton>
    </div>
  );
};

export default Pagination;
