"use client";

import Navigation from "@/components/custom/navigation";
import { Project, ProjectList } from "@/components/custom/projects-table";
import { ThemeChanger } from "@/components/custom/theme-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setProject } from "@/state/project/projectSlice";
import { AppDispatch } from "@/state/store";
import { getCategories, getTasks } from "@/state/task/taskSlice";
import { gcompanyId, logout } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

type Props = {
  params: { locale: string };
};

export default function DashboardPage({ params: { locale } }: Props) {
  const t = useTranslations("PathnamesPage");

  const [projectName, setProjectName] = useState("");
  const [addProject, setAddProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState<Project[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  useEffect(() => {
    getProjects();
  }, []);

  const handleProjectClick = useCallback(
    (project: Project) => {
      console.log(`Project clicked: ${project.project_name}`);
      setProjectName(project.project_name);

      dispatch(setProject(project));

      dispatch(getTasks(project.id));
      dispatch(getCategories());
      console.log(gcompanyId);
      router.push(`/${gcompanyId}/projects/tasks`);
    },
    [router]
  );

  const getProjects = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");
      const sid = localStorage.getItem("sid");
      const companyId = localStorage.getItem("company_id");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://${companyId}.app.buildsuite.io/api/method/bs_customisations.api.get_projects_list`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
          withCredentials: true,
        }
      );

      // console.log("Get Projects:", response.data);
      setData(response.data.message.projects);
      router.push(`/${companyId}/projects`);
    } catch (error: any) {
      console.log("Get Projects failed:", error.response.status);
      if (error.response.status == 401) {
        logout();
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[90vh] bg-white dark:bg-slate-900 rounded-sm w-full overflow-y-auto px-8 py-6 ">
      <ProjectList
        projects={data}
        onProjectClick={handleProjectClick}
        onAddProjectClick={() => {
          console.log("Add project clicked");
          setAddProject(true);
        }}
      />

      <div
        className={`absolute z-40 right-0 top-0 w-[500px] h-full bg-white shadow-lg p-8 transition-all duration-150 ${
          addProject ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold">Add New Project</h1>
          <MdClose
            onClick={() => setAddProject(false)}
            className="cursor-pointer border-2 border-gray-200 text-3xl p-1 rounded-3xl"
          />
        </div>

        <form className="w-full" onSubmit={() => {}}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Project name</Label>
            <Input
              type="email"
              id="email"
              className=" mb-6 w-full"
              placeholder="Project name"
              onChange={(e) => {}}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Customer Name</Label>
            <Input
              type="password"
              id="password"
              className=" mb-8 w-full"
              placeholder="Customer Name"
              onChange={(e) => {}}
            />
          </div>

          <Button
            type="submit"
            className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
          >
            Add Project
          </Button>
        </form>
      </div>
    </div>
  );
}
