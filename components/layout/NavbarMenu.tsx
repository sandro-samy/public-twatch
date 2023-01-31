import React from "react";
import DropdownLink from "../UI/Dropdown/DropdownLink";
import { Menu } from "@headlessui/react";
import { IoIosLogOut } from "react-icons/io";
import { useAppDispatch } from "../../state/hooks";
import { signOut, useSession } from "next-auth/react";
import { resetCart } from "../../state/cartSlice";
import dynamic from "next/dynamic";

const NavbarMenu = () => {
  const dispatch = useAppDispatch();
  const { data, status } = useSession();
  const session: any = data;
  const logout = () => {
    signOut({ callbackUrl: "/login" });
    dispatch(resetCart());
  };
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button className="text-shadow">{session?.user?.name}</Menu.Button>
      <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
        <Menu.Item>
          {({ close }) => (
            <DropdownLink
              className="dropdown-link"
              href="/profile"
              onClick={close}
            >
              Profile
            </DropdownLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ close }) => (
            <DropdownLink
              className="dropdown-link"
              href="/wishlist"
              onClick={close}
            >
              Wishlist
            </DropdownLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ close }) => (
            <DropdownLink
              className="dropdown-link"
              href="/order-history"
              onClick={close}
            >
              Order History
            </DropdownLink>
          )}
        </Menu.Item>
        {session?.isAdmin ? (
          <Menu.Item>
            {({ close }) => (
              <DropdownLink
                className="dropdown-link"
                href="/admin/dashboard"
                onClick={close}
              >
                Admin Dashboard
              </DropdownLink>
            )}
          </Menu.Item>
        ) : null}
        <Menu.Item
          as={"button"}
          className="w-full dropdown-link"
          onClick={() => {
            logout();
          }}
        >
          {({ close }) => (
            <div className="w-full flex items-center gap-2 " onClick={close}>
              Log Out
              <IoIosLogOut className="text-2xl" />
            </div>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default dynamic(() => Promise.resolve(React.memo(NavbarMenu)), {
  ssr: false,
});
