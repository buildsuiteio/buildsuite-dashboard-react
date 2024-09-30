"use client";

import { Task, TaskTable } from "@/components/custom/task-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppDispatch, RootState, store } from "@/state/store";
import {
  addTask,
  getCategories,
  setTask,
  setTaskDetails,
  setTaskFiles,
  setUnits,
} from "@/state/task/taskSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { Provider, useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { gcompanyId } from "@/utils/utils";

export default function TasksPage() {
  const t = useTranslations("PathnamesPage");
  const [showAddTask, setShowAddTask] = useState(false);
  const [project, setProject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Task[]>([]);

  const tasks = useSelector((state: RootState) => state.task.tasks);
  const categories = useSelector((state: RootState) => state.task.categories);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <Provider store={store}>
      <div className="h-full w-full bg-white dark:bg-slate-900 overflow-y-hidden p-8 shadow-sm">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={`/${gcompanyId}/projects`}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={`/${gcompanyId}/projects`}>Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Tasks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-lg font-semibold text-slate-900 mb-4">Tasks</p>
        <TaskTable
          onTaskClick={(task: Task) => {
            dispatch(setTask(task));
            dispatch(
              setUnits([
                {
                  name: "Percentage",
                  symbol: "%",
                },
                {
                  name: "Feet",
                  symbol: "ft",
                },
                {
                  name: "Meter",
                  symbol: "m",
                },
                {
                  name: "Inch",
                  symbol: "in",
                },
                {
                  name: "Square Feet",
                  symbol: "sq ft",
                },
                {
                  name: "Square Meter",
                  symbol: "sq m",
                },
                {
                  name: "Cubic Feet",
                  symbol: "cu ft",
                },
                {
                  name: "Cubic Meter",
                  symbol: "cu m",
                },
                {
                  name: "Number",
                  symbol: "nos",
                },
              ])
            );
            dispatch(setTaskDetails(task.task_id));
            dispatch(setTaskFiles(task.task_id));
            dispatch(getCategories());
            router.replace(`/${gcompanyId}/projects/tasks/task-detail`);
          }}
          tasks={tasks}
          categories={categories}
        />

        <div
          className={`absolute z-40 right-0 top-0 w-[500px] h-full bg-white shadow-lg p-8 transition-all duration-150 ${
            showAddTask ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-semibold">Add New Task</h1>
            <MdClose
              onClick={() => setShowAddTask(false)}
              className="cursor-pointer border-2 border-gray-200 text-3xl p-1 rounded-3xl"
            />
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="task-name">Task name</Label>
              <Input
                type="text"
                id="task-name"
                className="mb-6 w-full"
                placeholder="Task name"
                onChange={(e) => {}}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Categories</Label>
              <Input
                type="text"
                id="category"
                className="mb-8 w-full"
                placeholder="Select Category"
                onChange={(e) => {}}
              />
            </div>

            <Button
              type="submit"
              className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
            >
              Add Task
            </Button>
          </form>
        </div>
      </div>
    </Provider>
  );
}
