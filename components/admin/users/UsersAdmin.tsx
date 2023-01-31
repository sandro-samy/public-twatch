import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../state/hooks";
import getError from "../../../utils/error";
import LoadingPage from "../../UI/Loading/LoadingPage";
import Pagination from "../../UI/Pagination/Pagination";
import AdminNav from "../adminNav";

const fetcher = async (page = 1) => {
  const { data } = await axios.get(`/api/admin/users?page=` + page);
  return data;
};

const UsersAdmin = () => {
  const [pagesNum, setPagesNum] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const { data, isLoading, isError, refetch } = useQuery(["users", page], () =>
    fetcher(page)
  );

  useEffect(() => {
    setLoading(isLoading);
    if (data?.users.length > 0) {
      setUsers(data.users);
      setPagesNum(data.pagesNum);
    }
  }, [isLoading, data]);

  const deleteHandler = async (id: string) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/admin/users/${id}`);
      toast.success(message);
      refetch();
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const width = useAppSelector((state) => state.window.width);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
      <AdminNav currentPage="users" />
      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl text-center">Users Dashboard</h1>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div
              className="overflow-x-auto md:col-span-3 max-w-full md:max-w-none"
              style={{ maxWidth: "100vw" }}
            >
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-1 md:px-5 text-left">ID</th>
                    <th className="px-1 md:px-5 text-left">Name</th>
                    <th className="p-1 md:p-5 text-left">Email</th>
                    <th className="p-1 md:p-5 text-left">IsAdmin</th>
                    <th className="p-1 md:p-5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: IUser) => (
                    <tr className="border-b" key={user._id}>
                      <td className="px-1 md:px-5">
                        {user._id.substring(
                          user._id.length - 4,
                          user._id.length
                        )}
                      </td>
                      <td className="p-1 md:p-5">{user?.name}</td>
                      <td className="p-1 md:p-5">{user.email}</td>
                      <td className="p-1 md:p-5">
                        {user.isAdmin ? "Yes" : "No"}
                      </td>
                      <td className="p-1 md:p-5">
                        <button
                          className="font-bold text-red-600 hover:text-red-700 hover:underline"
                          onClick={() => deleteHandler(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagesNum > 1 ? (
              <Pagination
                currentPage={page}
                setState={setPage}
                type="setState"
                pagesNum={pagesNum}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;
