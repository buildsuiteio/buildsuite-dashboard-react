"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { RiBuilding2Line } from "react-icons/ri";
import { Progress } from "../ui/progress";
import { formatDate, getDaysLeft } from "./date-format";
import DataTable from "./table";
import { addTask, getTasks, TaskCategory } from "@/state/task/taskSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

export interface Task {
  task_id: string;
  title: string;
  category: string;
  status: "In Progress" | "Completed" | "In Delay" | "Yet To Start";
  expected_end_date: string | null;
  estimated_work: number;
  unit: string;
  progress: number;
  progress_percentage: number;
}

export interface TimelineEntry {
  title: string;
  photo: string[];
  status_update: string;
  date: string;
  task_update_id: string;
  task_progress: number;
  unit: string;
  remark: string;
  updated_by: string;
}

export interface TaskDetails {
  id: string;
  task_name: string;
  priority: string;
  category: string;
  status: "In Progress" | "Completed" | "In Delay" | "Yet To Start";
  task_progress: number;
  total_task_progress: number;
  project_id: string;
  unit: string;
  estimated_work: number;
  start_date: string;
  end_date: string;
  assignee: Assignee[];
  estimated_cost: number;
  description: string;
  timeline: Timeline[];
  unit_change_limit_reached: boolean;
  tags: string[];
}

export interface Assignee {
  user_email: string;
  user_name: string;
}

export interface Timeline {
  title: string;
  photo: Photo[];
  status_update: string;
  date: string;
  task_update_id: string;
  task_progress: number;
  unit: string;
  remark: string;
  updated_by: string;
}

export interface Photo {
  id: string;
  filename: string;
  file_url: string;
  file_url_with_protocol: string;
  filetype: string;
  timestamp_of_upload: string;
}

function getColor(status: string) {
  if (status == "Yet To Start") {
    return "bg-[#BAF8F1]";
  }

  if (status == "In Delay") {
    return "bg-[#FAA0A0]";
  }

  if (status == "In Progress") {
    return "bg-[#ADF3C9]";
  }

  if (status == "Completed") {
    return "bg-[#D0D0D0]";
  }
}

const createColumns = (
  onTaskClick: (task: Task) => void
): ColumnDef<Task>[] => [
  {
    accessorKey: "task_id",
    header: "Task ID",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onTaskClick(row.original);
        }}
        className={`capitalize w-max px-2 py-1 rounded-sm`}
      >
        {row.getValue("task_id")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div
          className="capitalize ml-4 cursor-pointer flex items-center"
          onClick={() => {
            onTaskClick(row.original);
            console.log(row.original.category);
          }}
        >
          <div className="bg-green-50 border-green-300 border-[1px] rounded-md p-2 mr-2">
            <RiBuilding2Line className="text-4xl text-green-700 dark:text-white " />
          </div>
          <div>
            <p className="text-md font-semibold mb-1  hover:underline">
              {row.getValue("title")}
            </p>
            <p className="text-slate-400">{category}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: undefined,
    cell: undefined,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onTaskClick(row.original);
        }}
        className={`capitalize w-max px-2 py-1 rounded-sm ${getColor(
          row.getValue("status")
        )}`}
      >
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "progress_percentage",
    header: "Progress",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onTaskClick(row.original);
        }}
      >
        <Progress
          className="h-2 bg-green-100 w-[80%] mb-1"
          indicatorColor="bg-green-500"
          value={parseInt(row.getValue("progress_percentage"), 10)}
        />
        <p className="capitalize">
          {String(row.getValue("progress_percentage")).split(".")[0]} %
        </p>
      </div>
    ),
  },
  {
    accessorKey: "expected_end_date",
    header: () => <div className="text-left">End Date</div>,
    cell: ({ row }) => {
      return (
        <div
          onClick={() => {
            onTaskClick(row.original);
          }}
          className="text-left font-medium"
        >
          <p>{formatDate(row.getValue("expected_end_date"))}</p>
          <p className="text-sm text-slate-400">
            {getDaysLeft(row.getValue("expected_end_date")) == 0 &&
            row.getValue("status") != "Completed"
              ? "Delayed"
              : row.getValue("status") == "Completed"
              ? "Completed"
              : ` ${getDaysLeft(row.getValue("expected_end_date"))}`}
          </p>
        </div>
      );
    },
  },
];

type DataTableDemoProps = {
  tasks: Task[];
  categories: TaskCategory[];
  onTaskClick: (task: Task) => void;
};

export function TaskTable({ onTaskClick, categories }: DataTableDemoProps) {
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const project = useSelector(
    (state: RootState) => state.project.currentProject
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      task_id: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [tab, setTab] = React.useState("All");
  const [category, setCategory] = React.useState("All");

  const [newTaskCategory, setNewTaskCategory] = React.useState<string | null>(
    null
  );

  const [taskName, setTaskName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { toast } = useToast();

  const columns = React.useMemo(
    () => createColumns(onTaskClick),
    [onTaskClick]
  );

  React.useEffect(() => {
    createColumns(onTaskClick);
  }, [tasks]);

  let table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const statusFilter =
      tab === "All" ? undefined : tab.charAt(0).toUpperCase() + tab.slice(1);
    setColumnFilters((filters) => {
      const newFilters = filters.filter((filter) => filter.id !== "status");
      return statusFilter
        ? [...newFilters, { id: "status", value: statusFilter }]
        : newFilters;
    });
  }, [tab]);

  React.useEffect(() => {
    const categoryFilter = category === "All" ? undefined : category;
    setColumnFilters((filters) => {
      const newFilters = filters.filter((filter) => filter.id !== "category");
      return categoryFilter
        ? [...newFilters, { id: "category", value: categoryFilter }]
        : newFilters;
    });
  }, [category]);

  const handleSubmit = () => {
    if (!newTaskCategory) {
      toast({
        title: "Category is required",
        description: `to create a task`,
      });
    }

    if (taskName.length === 0) {
      toast({
        title: "Task name is required",
        description: `to create a task`,
      });
    }

    dispatch(
      addTask({
        project_id: project?.id,
        category: newTaskCategory,
        name: taskName,
        description: description,
      })
    );

    setNewTaskCategory(null);
    setTaskName("");
    setDescription("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Tabs defaultValue="All" className="w-full h-full ">
      <div className="flex items-center justify-between pb-4 h-[10%] ">
        <TabsList className="font-semibold text-black text-xl h-14 px-2">
          <TabsTrigger onClick={() => setTab("All")} value="All">
            All
            <p className="px-2 py-1 ml-2 bg-[#FFF1BF] rounded-sm ">
              {tasks.length}
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("Yet To Start")} value="New">
            Yet to start
            <p className="px-2 py-1  ml-2 bg-[#BAF8F1] rounded-sm ">
              {tasks.filter((task) => task.status === "Yet To Start").length}
            </p>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setTab("In Progress")}
            value="In Progress"
          >
            In Progress
            <p className="px-2 py-1  ml-2 bg-[#ADF3C9] rounded-sm ">
              {tasks.filter((task) => task.status === "In Progress").length}
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("In Delay")} value="In Delay">
            In Delay
            <p className="px-2 py-1 ml-2 bg-[#FAA0A0] rounded-sm ">
              {tasks.filter((task) => task.status === "In Delay").length}
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("Completed")} value="Completed">
            Completed
            <p className="px-2 py-1 ml-2 bg-[#D0D0D0] rounded-sm ">
              {tasks.filter((task) => task.status === "Completed").length}
            </p>
          </TabsTrigger>
        </TabsList>

        <Dialog>
          <DialogTrigger>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="task-name">Task name</Label>
                <Input
                  type="text"
                  id="task-name"
                  className="mb-6 w-full"
                  placeholder="Task name"
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                />
              </div>

              <Label htmlFor="category">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`ml-auto w-full capitalize justify-start  ${
                      !newTaskCategory && "text-slate-400"
                    } `}
                  >
                    {newTaskCategory ? newTaskCategory : "Select Category"}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px]">
                  {categories.map((ccategory: TaskCategory) => {
                    return (
                      <DropdownMenuItem
                        key={ccategory.name}
                        className={`px-2 w-full cursor-pointer capitalize ${
                          category == ccategory.name ? "bg-slate-100" : ""
                        }`}
                        onClick={() => setNewTaskCategory(ccategory.name)}
                      >
                        {ccategory.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="grid w-full items-center gap-1.5 mt-6">
                <Label htmlFor="category">Description</Label>
                <Input
                  type="text"
                  id="Description"
                  className="mb-8 w-full"
                  placeholder="Task Description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogClose className="w-full">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
              >
                Add Task
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between pb-4 h-[10%]">
        <Input
          placeholder="Filter Task Name..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: Boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-4"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto capitalize">
                {category} <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                key={"All"}
                className={`px-2 cursor-pointer capitalize ${
                  category == "All" ? "bg-slate-100" : ""
                }`}
                onClick={() => setCategory("All")}
              >
                All ({tasks.length})
              </DropdownMenuItem>
              {categories.map((ccategory) => {
                return (
                  <DropdownMenuItem
                    key={ccategory.name}
                    className={`px-2 cursor-pointer capitalize ${
                      category == ccategory.name ? "bg-slate-100" : ""
                    }`}
                    onClick={() => setCategory(ccategory.name)}
                  >
                    {ccategory.name} (
                    {
                      tasks.filter((task) => task.category == ccategory.name)
                        .length
                    }
                    )
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-[72%]">
        <DataTable colLength={columns.length} tableData={table} />
      </div>
    </Tabs>
  );
}
