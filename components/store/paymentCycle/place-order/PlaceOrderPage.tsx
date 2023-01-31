import React, { useState } from "react";
import { useAppSelector } from "../../../../state/hooks";
import LoadingPage from "../../../UI/Loading/LoadingPage";
import ShippingContainer from "../../../UI/ShippingContainer/ShippingContainer";
import ShippingProgressBar from "../../../UI/Stepper/ShippingProgressBar";
import PlaceOrderContent from "./PlaceOrderContent";

const PlaceOrderPage = () => {
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
      <h1 className="text-3xl">Place Order</h1>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <ShippingProgressBar
            cartState={cartState}
            steps={["Shipping Address", "Payment Method", "Place Order"]}
            links={["shipping-details", "payment-method", "place-order"]}
            entered={[
              !!isShippingDetailsEntered,
              !!paymentMethod,
              !!paymentMethod,
            ]}
            disables={[
              !isShippingDetailsEntered,
              !paymentMethod,
              !paymentMethod,
            ]}
            current={3}
          ></ShippingProgressBar>
          <ShippingContainer
            prevLink="/payment-method"
            prevDisabled={false}
            nextLink="#"
            nextDisabled={true}
            loading={loading}
            setLoading={setLoading}
          >
            <PlaceOrderContent loading={loading} setLoading={setLoading} />
          </ShippingContainer>
        </>
      )}
    </div>
  );
};

export default PlaceOrderPage;
