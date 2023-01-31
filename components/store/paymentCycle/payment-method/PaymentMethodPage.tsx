import React, { useState } from "react";
import { useAppSelector } from "../../../../state/hooks";
import ShippingContainer from "../../../UI/ShippingContainer/ShippingContainer";
import ShippingProgressBar from "../../../UI/Stepper/ShippingProgressBar";
import PaymentMethodForm from "./PaymentMethodForm";

const PaymentMethodPage = () => {
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
      <h1 className="text-3xl">Payment Method</h1>
      <ShippingProgressBar
        cartState={cartState}
        steps={["Shipping Address", "Payment Method", "Place Order"]}
        links={["shipping-details", "payment-method", "place-order"]}
        entered={[isShippingDetailsEntered, !!paymentMethod, false]}
        disables={[!isShippingDetailsEntered, !paymentMethod, !paymentMethod]}
        current={2}
      ></ShippingProgressBar>
      <ShippingContainer
        prevLink="/shipping-details"
        prevDisabled={false}
        nextLink="/place-order"
        nextDisabled={!paymentMethod}
        className="flex justify-center items-center"
        loading={loading}
        setLoading={setLoading}
      >
        <PaymentMethodForm loading={loading} setLoading={setLoading} />
      </ShippingContainer>
    </div>
  );
};

export default PaymentMethodPage;
