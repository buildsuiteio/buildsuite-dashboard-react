"use client";

import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineBook, MdOutlineGroup } from "react-icons/md";
import { RiBuilding2Fill, RiBuilding2Line } from "react-icons/ri";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/custom/navigation";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { Toaster } from "@/components/ui/toaster";
import { gcompanyId } from "@/utils/utils";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const [navItem, setNavItem] = useState("dashboard");

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <Provider store={store}>
      <main className="w-full h-[100vh] overflow-x-hidden bg-neutral-100 dark:bg-slate-800 flex justify-start box-border">
        <div
          className={`h-[100vh] bg-white p-4 relative transition-all duration-800 dark:bg-slate-900 ${
            collapsed ? "w-[5%]" : "w-[300px]"
          }`}
        >
          {!collapsed ? (
            <Image
              priority={true}
              className="w-[60%] mb-4 ml-1"
              src="/images/logo.png"
              width={150}
              height={50}
              alt={""}
            />
          ) : (
            <Link href={`/${gcompanyId}/projects`}>
              <Image
                priority={true}
                className="w-[80%] ml-[10%] scale-60 rounded-md mb-8"
                src="/images/logo2.png"
                width={50}
                height={50}
                alt={""}
              />
            </Link>
          )}
          {!collapsed && (
            <p className="text-sm text-slate-400 mb-2 ml-2">Overview</p>
          )}
          <Link
            onClick={() => setNavItem("dashboard")}
            href={`/${gcompanyId}/projects`}
          >
            <div className="flex flex-col items-center justify-center mb-4">
              <div
                className={`text-md px-4 py-2 mb-1 flex items-center bg-green-50 dark:bg-slate-800 text-sm rounded-md cursor-pointer ${
                  navItem == "dashboard" ? "bg-green-50" : "bg-slate-50"
                }`}
              >
                <RiBuilding2Line
                  className={`text-xl  dark:text-white ${
                    navItem == "dashboard" ? "text-green-700" : "text-slate-950"
                  }`}
                />
                {!collapsed && (
                  <p className="ml-2 text-green-700 dark:text-white">
                    Projects
                  </p>
                )}
              </div>
              {collapsed && (
                <p
                  className={`ml-2 text-sm dark:text-white ${
                    navItem == "dashboard" ? "text-green-700" : "text-slate-950"
                  }`}
                >
                  Projects
                </p>
              )}
            </div>
          </Link>
          <p
          // onClick={() => setNavItem("book")}
          // href={`/${gcompanyId}/projects/book`}
          >
            <div className="flex flex-col items-center justify-center mb-4">
              <div
                className={`text-md px-4 py-2 mb-1 flex items-center bg-green-50 dark:bg-slate-800 text-sm rounded-md cursor-pointer ${
                  navItem == "book" ? "bg-green-50" : "bg-slate-50"
                }`}
              >
                <MdOutlineBook
                  className={`text-xl  dark:text-white ${
                    navItem == "book" ? "text-green-700" : "text-slate-950"
                  }`}
                />
                {!collapsed && <p className="ml-2  dark:text-white">Book</p>}
              </div>
              {collapsed && (
                <p
                  className={`ml-2 text-sm dark:text-white ${
                    navItem == "book" ? "text-green-700" : "text-slate-950"
                  }`}
                >
                  Book
                </p>
              )}
            </div>
          </p>

          <p
          // onClick={() => setNavItem("teams")}
          // href={`/${gcompanyId}/projects/teams`}
          >
            <div className="flex flex-col items-center justify-center mb-4">
              <div
                className={`text-md px-4 py-2 mb-1 flex items-center bg-green-50 dark:bg-slate-800 text-sm rounded-md cursor-pointer ${
                  navItem == "teams" ? "bg-green-50" : "bg-slate-50"
                }`}
              >
                <MdOutlineGroup
                  className={`text-xl  dark:text-white ${
                    navItem == "teams" ? "text-green-700" : "text-slate-950"
                  }`}
                />
                {!collapsed && <p className="ml-2  dark:text-white">Team</p>}
              </div>
              {collapsed && (
                <p
                  className={`ml-2 text-sm dark:text-white ${
                    navItem == "teams" ? "text-green-700" : "text-slate-950"
                  }`}
                >
                  Team
                </p>
              )}
            </div>
          </p>
          {/* <div onClick={() => {
                    setCollapsed(!collapsed);
                }} className="absolute top-8 z-10 right-[-24px] p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-white shadow-lg hover:shadow-md rounded-full cursor-pointer">
                    {!collapsed ? <IoIosArrowBack className="text-xl transition-all transform duration-800 rotate-0" /> : <IoIosArrowBack className="text-xl transition-all transform duration-800 rotate-180" />}
                </div> */}
        </div>
        <div className="w-[95%] h-[100vh] p-6">
          <Navigation />
          {children}
        </div>

        <Toaster />
      </main>
    </Provider>
  );
}
