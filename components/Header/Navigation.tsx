import { ShoppingBagIcon } from '@heroicons/react/20/solid';
import { Playfair_Display_SC } from '@next/font/google'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import {RiSearch2Line, RiShoppingBag2Line} from 'react-icons/ri'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const playfair = Playfair_Display_SC({
  weight: ['400', '900'],
  display: "swap",
  subsets: ["latin"],
  preload: true
})

const Navigation = () => {

// const {cart} = useSelector<RootState>((state) => ({...state}))




  return (
    <nav className="py-2 px-4 lg:px-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`${playfair.className} font-black text-slate-700 text-lg sm:text-xl lg:text-2xl tracking-wider`}
        >
          Podium Push
        </Link>

        <div className="flex-1 px-2 lg:px-8">
          <div className="w-full">
            <div className="w-full">

              <form className="mt-1 hidden lg:flex rounded-md shadow-sm  ">
                <label className="sr-only">Search Products</label>
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                  <RiSearch2Line className="text-slate-800 h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-50 focus:ring-indigo-50 sm:text-sm"
                  placeholder="Search"
                />
                <button className="sr-only" type="submit">Search</button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex">
          <nav>
            <Link href="/cart" className="flex items-center relative">
              <ShoppingBagIcon className="h-8 w-8 text-slate-800" />
              <span className="absolute -top-1 h-5 w-5 text-xs bg-green-600 text-white font-bold rounded-full flex items-center justify-center -right-2">0</span>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
