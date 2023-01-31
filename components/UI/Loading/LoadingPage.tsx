import React from "react";
import Lottie from "react-lottie";

const LoadingPage = () => {
  return (
    <div className="loading-container h-screen flex justify-center items-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: require("../../../public/assets/lottie/SandGlass.json"),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={400}
        width={400}
        speed={0.5}
      />
    </div>
  );
};

export default LoadingPage;
