import React, { useState } from "react";
import { useAppSelector } from "../../../../state/hooks";
import ShippingContainer from "../../../UI/ShippingContainer/ShippingContainer";
import ProgressStep from "../../../UI/Stepper/ProgressStep";
import ShippingProgressBar from "../../../UI/Stepper/ShippingProgressBar";
import ShippingForm from "./ShippingForm";

const ShippingPage = () => {
  const [loading, setLoading] = useState(false);

  const cartState = useAppSelector((state) => state.cart.cartState);
  const shippingDetails = useAppSelector((state) => state.cart.shippingDetails);
  const paymentMethod = useAppSelector((state) => state.cart.paymentMethod);
  const isShippingDetailsEntered =
    !!shippingDetails?.fullName &&
    !!shippingDetails?.city &&
    !!shippingDetails?.phone &&
    !!shippingDetails?.address;
  return (
    <div className="pageContainer">
      <h1 className="text-3xl">Shipping Address</h1>
      <ShippingProgressBar
        cartState={cartState}
        steps={["Shipping Address", "Payment Method", "Place Order"]}
        links={["shipping-details", "payment-method", "place-order"]}
        entered={[isShippingDetailsEntered, false, false]}
        disables={[!isShippingDetailsEntered, !paymentMethod, !paymentMethod]}
        current={1}
      ></ShippingProgressBar>
      <ShippingContainer
        prevLink=""
        prevDisabled={true}
        nextLink="/payment-method"
        nextDisabled={!shippingDetails}
        className="flex justify-center items-center"
        loading={loading}
        setLoading={setLoading}
      >
        <ShippingForm setLoading={setLoading} loading={loading} />
      </ShippingContainer>
    </div>
  );
};

export default ShippingPage;
