import { Menu, Transition } from "@headlessui/react";
import { Fragment  } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function UserMenu() {

const router = useRouter()

  const supabase = useSupabaseClient();

  const user = useUser()

  console.log(user)

  const signOut = async () => {
    const data = await supabase.auth.signOut();
    console.log({data, message: "Sign Out"})
     router.push('/')
  }

  const toggleOpenState = (state: boolean) => {
    if(state === true) {
      state = false;
    } else {
      state = true;
    }
  }


  return (
    <div className=" text-right">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex w-full justify-center border-2 border-slate-200 bg-slate-900 py-1 px-2  rounded-full text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <div className="flex items-center">
                  {/* <Image
                    src="/images/profile.jpg"
                    width={640}
                    height={960}
                    alt="Profile"
                    className="mr-1 w-8 aspect-1 rounded-full object-cover"
                  /> */}

                  <p className="text-xs text-slate-50">{user?.email}</p>

                  <ChevronDownIcon className="text-slate-200 w-6 h-6 lg:h-8 lg:w-8" />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push(`/account`)}
                        className={`${
                          active ? "bg-slate-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Account
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push(`/account/orders`)}
                        className={`${
                          active ? "bg-slate-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        My Orders
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push(`/account/address`)}
                      className={`${
                        active ? "bg-slate-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      My Address
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push(`/account/wishlist`)}
                      className={`${
                        active ? "bg-slate-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Wishlist
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={`${
                        active ? "bg-slate-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}



