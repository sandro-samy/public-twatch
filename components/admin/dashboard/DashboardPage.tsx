import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import LoadingPage from "../../UI/Loading/LoadingPage";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminNav from "../adminNav";

const fetcher = async () => {
  const { data } = await axios("/api/admin/summary");
  return data;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    ordersPrice: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
    salesData: [{ _id: "", totalSales: "" }],
  });
  const [stat, setStat] = useState<{
    labels: string[];
    datasets: { label: string; backgroundColor: string; data: number[] }[];
  }>({
    labels: [""],
    datasets: [{ label: "Sales", backgroundColor: "#00a780", data: [0] }],
  });

  const { data, isLoading } = useQuery("summary", fetcher);

  useEffect(() => {
    if (data) {
      setSummary(data);
      setLoading(isLoading);

      if (data.salesData.length > 0) {
        setStat({
          labels: data.salesData.map((x: any) => x?._id),
          datasets: [
            {
              label: "Sales",
              backgroundColor: "#00deaa",
              data: data.salesData.map((x: any) => parseInt(x.totalSales)),
            },
          ],
        });
      }
    }
  }, [data, isLoading]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
      <AdminNav currentPage="dashboard" />
      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl text-center">Admin Dashboard</h1>
        {loading ? (
          <LoadingPage />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div className="card m-5 p-5">
                <p className="text-3xl">$ {summary.ordersPrice.toFixed(0)}</p>
                <p>Sales</p>
                <Link className="font-bold underline" href="/admin/orders">
                  View Sales
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.ordersCount}</p>
                <p>Orders</p>
                <Link className="font-bold underline" href="/admin/orders">
                  View Orders
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.productsCount}</p>
                <p>Products</p>
                <Link className="font-bold underline" href="/admin/products">
                  View Products
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.usersCount}</p>
                <p>Users</p>
                <Link className="font-bold underline" href="/admin/orders">
                  View Users
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text=xl">Sales</h2>

              <Bar
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "right",
                    },
                  },
                }}
                data={stat}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
