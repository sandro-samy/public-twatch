import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "react-toastify";
import getError from "../../utils/error";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PaypalBtns = ({
  order,
  totalPrice,
  refetch,
}: {
  order: IOrder;
  totalPrice: number;
  refetch: () => void;
}) => {
  const router = useRouter();

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice.toString() },
          },
        ],
      })
      .then((orderID: any) => {
        return orderID;
      });
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        const { data } = await axios.put(
          `/api/order/pay/${order._id}`,
          details
        );
        router.reload();
        toast.success("Order paid successfully");
      } catch (err: any) {
        toast.error(getError(err));
      }
    });
  }
  function onError(err: any) {
    toast.error(getError(err));
  }
  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    ></PayPalButtons>
  );
};

export default PaypalBtns;
