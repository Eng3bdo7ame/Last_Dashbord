"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import logo from "../../../public/images/logo.png";
import ClickOutside from "../ClickOutside";
import { IoMdHome } from "react-icons/io";
import { SlBasket } from "react-icons/sl";
import { LuLayers } from "react-icons/lu";
import { FaBox, FaTasks } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <IoMdHome className="text-[red]" />,
        label: "Dashboard",
        route: "/",
      },
      {
        icon: <SlBasket className="text-[red]" />,
        label: "Clients",
        route: "/clients",
      },

      {
        icon: <LuLayers className="text-[red]" />,
        label: "Projects",
        route: "/projects",
      },
      {
        icon: <FaBox className="text-[red]" />,
        label: "Versions",
        route: "/versions",
      },
      {
        icon: <FiFilePlus className="text-[red]" />,
        label: "Stages",
        route: "/stages",
      },

      {
        icon: <FaTasks className="text-[red]" />,
        label: "Tasks",
        route: "/tasks",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-40 flex min-h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5 xl:pb-8 xl:pt-4">
          <Link href="/">
            <div className="aside-content  flex items-center justify-evenly text-3xl font-bold md:justify-start">
              <Image
                src={logo}
                alt="Zayer Logo"
                width={60}
                priority
                className="relative   rounded-full shadow-md shadow-gray-200 sm:hidden lg:block"
              />
            </div>
          </Link>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
