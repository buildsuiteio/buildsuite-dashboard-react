"use client";

import { RootState } from "@/state/store";
import { gcompanyId } from "@/utils/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useSelector } from "react-redux";

type Props = {
  children: ReactNode;
};

export default function TaskLayout({ children }: Props) {
  const t = useTranslations("PathnamesPage");
  const [addTask, setAddTask] = useState(false);

  const [navItem, setNavItem] = useState("tasks");

  const project = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const router = useRouter();

  return (
    <main className="relative w-full h-[90vh] flex items-center justify-between box-border">
      <div className="!w-[15%] h-full  p-4 rounded-sm">
        <div className="w-full flex items-center justify-center">
          <div
            onClick={() => {
              router.push(`/${gcompanyId}/projects`);
            }}
            className="w-max flex items-center rounded-sm shadow-sm justify-center cursor-pointer mb-6 px-4 py-1 text-slate-900 bg-white"
          >
            <MdArrowBackIos />
            <p className="text-sm font-semibold ml-1">Go to Projects</p>
          </div>
        </div>

        <div className="w-[100%] flex flex-col items-center justify-center">
          <img
            src="https://cdn.cpdonline.co.uk/wp-content/uploads/2023/03/04151341/Everything-you-need-to-know-about-Construction-Site-Safety.jpg"
            className="h-[150px] w-[150px] object-cover rounded-md"
          />
          <p className="text-lg font-semibold text-slate-900 dark:text-white  mt-2 mb-6">
            {project ? project?.project_name : "NA"}
          </p>
        </div>

        <Link
          onClick={() => setNavItem("dashboard")}
          href={`/${gcompanyId}/projects/tasks/project-dashboard`}
        >
          <div
            className={`text-md px-4 py-2 mb-1 flex items-center  rounded-sm dark:bg-slate-800 text-sm cursor-pointer ${
              navItem == "dashboard"
                ? "bg-[#37AD4A]  text-white"
                : "text-slate-950"
            }`}
          >
            <p className="ml-2">Dashboard</p>
          </div>
        </Link>

        <Link
          onClick={() => setNavItem("tasks")}
          href={`/${gcompanyId}/projects/tasks`}
        >
          <div
            className={`text-md px-4 py-2 mb-1 flex items-center  rounded-sm dark:bg-slate-800 text-sm cursor-pointer ${
              navItem == "tasks" ? "bg-[#37AD4A]  text-white" : "text-slate-950"
            }`}
          >
            <p className="ml-2">Tasks</p>
          </div>
        </Link>

        <Link
          onClick={() => setNavItem("attendance")}
          href={`/${gcompanyId}/projects/tasks/attendance`}
        >
          <div
            className={`text-md px-4 py-2 mb-1 flex items-center  rounded-sm dark:bg-slate-800 text-sm cursor-pointer ${
              navItem == "attendance"
                ? "bg-[#37AD4A]  text-white"
                : "text-slate-950"
            }`}
          >
            <p className="ml-2">Attendance</p>
          </div>
        </Link>

        <Link
          onClick={() => setNavItem("files")}
          href={`/${gcompanyId}/projects/tasks/files`}
        >
          <div
            className={`text-md px-4 py-2 mb-1 flex items-center  rounded-sm dark:bg-slate-800 text-sm cursor-pointer ${
              navItem == "files" ? "bg-[#37AD4A]  text-white" : "text-slate-950"
            }`}
          >
            <p className="ml-2">Files</p>
          </div>
        </Link>
      </div>

      <div className="w-[85%] h-full pl-5 relative">{children}</div>
    </main>
  );
}
