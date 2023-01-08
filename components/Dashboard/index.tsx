import Link from "next/link";
import {TfiShoppingCartFull} from "react-icons/tfi"
import {BsBox} from "react-icons/bs"
import { AiOutlineGroup } from "react-icons/ai";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { ImUsers } from "react-icons/im";
import { ReactNode } from "react";

const links = [
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <TfiShoppingCartFull />,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: <BsBox />,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: <AiOutlineGroup />,
  },
  {
    title: "Sub Categories",
    url: "/admin/sub_categories",
    icon: <HiOutlineRectangleGroup />,
  },
  {
    title: "Brands",
    url: "/admin/brands",
    icon: <MdOutlineBrandingWatermark />,
  },
  {
    title: "Suppliers",
    url: "/admin/suppliers",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <ImUsers />,
  },
];

const Dashboard = ({children}:{children:ReactNode}) => {
  return (
    <div className="w-full h-full min-h-screen font-sans text-slate-800 bg-gray-50 flex">
      <aside className="py-6 px-10 border-r border-gray-200 w-fit min-h-screen">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>

        <ul className="mt-5 flex flex-col gap-3">
          {links.map((link, i) => (
            <Link key={i} href={link.url} className="flex text-lg space-x-3 items-center hover:text-blue-600">
              {link.icon}
              <p className="font-medium">{link.title}</p>
            </Link>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};
export default Dashboard;
