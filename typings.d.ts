import { Session } from "next-auth";

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  brand: string;
  countInStock: number;
  gender: string;
  numOfReviews: number;
}

interface ICartProduct extends IProduct {
  quantity: number;
}

interface ISession {
  data: null | Session;
  status: "loading" | "unauthenticated" | "authenticated";
}

interface IOrder {
  _id: string;
  user: string | { _id: string; name: string };
  orderItems: {
    _id: string;
    name: string;
    slug: string;
    quantity: number;
    image: string;
    price: number;
  }[];
  shippingDetails: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: "" | "paypal" | "cash";
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  paymentResult?: { id: string; status: string; email_address: string };
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
