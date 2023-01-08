import Image from "next/image";
import { MdSecurity, MdOutlineHelpOutline } from "react-icons/md";
import { RiCustomerService2Fill, RiMapPinUserLine } from "react-icons/ri";
import { HiOutlineHeart } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useUser } from "@supabase/auth-helpers-react";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const Top = () => {

  const user = useUser();

  const {
    data: location,
    error,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["country"],
    queryFn: async function () {
      const data = await axios
        .get(
          `https://api.ipregistry.co/2c0f:f4c0:20c2:4bfc:8c11:18f3:aca:b4f2?key=${process.env.NEXT_PUBLIC_IP_REGISTRY}`
        )
        .then((res) => {
          return res.data.location.country;
        })
        .catch((err) => new Error(err));
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


  return (
    <div className="shadow-md px-4 lg:px-0">
      <div id="top" className="flex justify-between max-w-7xl mx-auto">
        <div
          id="top_container"
          className="flex justify-between items-center w-full py-3"
        >
          <div className="flex-1"></div>
          <ul
            id="top_list"
            className="flex items-center text-slate-600 text-xs"
          >
            <li className="flex items-center px-2 border-r-2 border-slate-200 cursor-pointer hover:text-slate-800">
              {isLoading
                ? "Loading..."
                : isSuccess && (
                    <>
                      <Image
                        src={location.flag.emojitwo}
                        width={640}
                        height={427}
                        alt="SA"
                        className="w-8 mr-1 object-cover"
                      />
                      <span>{location.name}/{location.code}</span>
                    </>
                  )}
            </li>
            <li className="items-center px-2 border-r-2 border-slate-200 cursor-pointer hidden lg:flex hover:text-slate-800">
              <MdSecurity className="mr-1" />
              <span>Buyer Protection</span>
            </li>
            <li className="hidden lg:flex items-center px-2 border-r-2 border-slate-200 cursor-pointer hover:text-slate-800">
              <RiCustomerService2Fill className="mr-1" />
              <span>Customer Service</span>
            </li>
            <li className="hidden lg:flex items-center px-2 border-r-2 border-slate-200 cursor-pointer hover:text-slate-800">
              <MdOutlineHelpOutline className="mr-1" />
              <span>Help</span>
            </li>
            <li className="flex items-center px-2 border-r-2 border-slate-200 cursor-pointer hover:text-slate-800">
              <HiOutlineHeart className="mr-1" />
              <span>Wishlist</span>
            </li>
            {!user ? (
              <li className="flex items-center cursor-pointer hover:text-slate-800 px-2">
                <Link href="/sign_in" className="flex items-center">
                  <RiMapPinUserLine className="mr-1" />
                  <span>Sign In</span>
                  <IoMdArrowDropdown />
                </Link>
              </li>
            ) : (
              <li className="flex items-center cursor-pointer hover:text-slate-800 px-2">
                <UserMenu />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Top;
