import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay, Keyboard } from "swiper";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useAppSelector } from "../../../state/hooks";

const data = [
  {
    image: "/assets/watches/7.jpg",
    qoute: "Made From An Actual Meterite.",
    id: 1,
  },
  {
    image: "/assets/watches/11.jpg",
    qoute: "Combining Savior-Faire Offers.",
    id: 2,
  },
  { image: "/assets/watches/5.jpg", qoute: "Discover Our Offers.", id: 3 },
  { image: "/assets/watches/2.jpg", qoute: "Swiss Luxuary Watches.", id: 4 },
  { image: "/assets/watches/4.jpg", qoute: "The New Elegent.", id: 5 },
];

const LatestProducts = ({ products }: { products?: IProduct[] }) => {
  const width = useAppSelector((state) => state.window.width);
  return (
    <Swiper
      autoplay={{
        pauseOnMouseEnter: true,
        disableOnInteraction: false,

        waitForTransition: false,
        delay: 5500,
      }}
      effect={"fade"}
      loop={true}
      slidesPerView={1}
      grabCursor={true}
      keyboard={{ enabled: true }}
      pagination={{
        clickable: true,
      }}
      modules={[Keyboard, EffectFade, Navigation, Pagination, Autoplay]}
      className="mySwiper"
    >
      {data.map(
        (
          slide: { image: string; qoute: string; id: number },
          index: number
        ) => (
          <SwiperSlide
            key={slide.id}
            className="flex justify-center w-screen h-60 bg-white"
          >
            {({ isActive, isVisible }) => (
              <div
                className={`grid justify-center items-center h-80 w-11/12 md:w-8/12 grid-cols-2 gap-4`}
              >
                <motion.div
                  className={`flex justify-center items-center h-full bg-white col-span-1 ${
                    index % 2 === 0 ? "order-first" : "order-last"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={slide.image}
                    width={"200"}
                    height={"200"}
                    alt="1"
                    className="mb-5"
                  />
                </motion.div>
                <motion.div
                  className={`flex col-span-1 text-2xl text-left mb-8 ${
                    index % 2 === 0
                      ? "order-last justify-start"
                      : "order-first justify-end"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={
                    isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                  }
                  transition={{ duration: 1 }}
                >
                  <p>{slide.qoute}</p>
                </motion.div>
              </div>
            )}
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
};

export default LatestProducts;
