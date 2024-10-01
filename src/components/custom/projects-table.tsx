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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { RiBuilding2Line } from "react-icons/ri";
import { Progress } from "../ui/progress";
import { formatDate, getDaysLeft } from "./date-format";
import DataTable from "./table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useRouter } from "next/router";

export type Project = {
  id: string;
  project_name: string;
  status: "Ongoing" | "Completed" | "Delayed" | "New";
  expected_end_date: string;
  percent_complete: number;
};

function getColor(status: string) {
  if (status == "New") {
    return "bg-[#BAF8F1]";
  }

  if (status == "Delayed") {
    return "bg-[#FAA0A0]";
  }

  if (status == "Ongoing") {
    return "bg-[#ADF3C9]";
  }

  if (status == "Completed") {
    return "bg-[#D0D0D0]";
  }
}

const createColumns = (
  onProjectClick: (project: Project) => void
): ColumnDef<Project>[] => [
  {
    accessorKey: "project_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="capitalize ml-4 cursor-pointer flex items-center"
        onClick={() => {
          onProjectClick(row.original);
        }}
      >
        <div className="bg-green-50  border-green-300 border-[1px] rounded-md p-2 mr-2">
          <RiBuilding2Line className="text-4xl text-green-700 dark:text-white " />
        </div>
        <div>
          <p className="text-md font-semibold mb-1  hover:underline">
            {row.getValue("project_name")}
          </p>
          <p className="!text-sm text-slate-400">{row.original.id}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onProjectClick(row.original);
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
    accessorKey: "percent_complete",
    header: "Progress",
    cell: ({ row }) => (
      <div
        onClick={() => {
          onProjectClick(row.original);
        }}
      >
        <Progress
          className="h-2 bg-green-100 w-[80%] mb-1"
          indicatorColor="bg-green-500"
          value={parseInt(row.getValue("percent_complete"), 10)}
        />
        <p className="capitalize">
          {String(row.getValue("percent_complete")).split(".")[0]} %
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
            onProjectClick(row.original);
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
  // {
  //     accessorKey: "issues",
  //     header: () => <div className="text-left">Issues</div>,
  //     cell: ({ row }) => {
  //         return <div onClick={() => {
  //             onProjectClick(row.original);
  //         }} className="text-left font-medium">2</div>
  //     },
  // },
];

type DataTableDemoProps = {
  projects: Project[];
  onProjectClick: (projectName: Project) => void;
  onAddProjectClick: () => void;
};

export function ProjectList({
  onProjectClick,
  onAddProjectClick,
  projects,
}: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [tab, setTab] = React.useState("all");

  const columns = React.useMemo(
    () => createColumns(onProjectClick),
    [onProjectClick]
  );

  const table = useReactTable({
    data: projects,
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
      tab === "all" ? undefined : tab.charAt(0).toUpperCase() + tab.slice(1);
    setColumnFilters((filters) => {
      const newFilters = filters.filter((filter) => filter.id !== "status");
      return statusFilter
        ? [...newFilters, { id: "status", value: statusFilter }]
        : newFilters;
    });
  }, [tab]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Tabs defaultValue="all" className="w-full h-full ">
      <div className="flex items-center justify-between pb-4 h-[10%]">
        <TabsList className="font-semibold text-black text-xl h-14 px-2">
          <TabsTrigger onClick={() => setTab("all")} value="all">
            All
            <p className="px-2 py-1 ml-2 bg-[#FFF1BF] rounded-sm ">
              {projects.length}
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("new")} value="new">
            New
            <p className="px-2 py-1  ml-2 bg-[#BAF8F1] rounded-sm ">
              {projects.filter((project) => project.status === "New").length}
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("ongoing")} value="ongoing">
            Ongoing
            <p className="px-2 py-1  ml-2 bg-[#ADF3C9] rounded-sm ">
              {
                projects.filter((project) => project.status === "Ongoing")
                  .length
              }
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("delayed")} value="delayed">
            Delayed
            <p className="px-2 py-1  ml-2 bg-[#FAA0A0] rounded-sm ">
              {
                projects.filter((project) => project.status === "Delayed")
                  .length
              }
            </p>
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab("completed")} value="completed">
            Completed
            <p className="px-2 py-1  ml-2 bg-[#D0D0D0] rounded-sm ">
              {
                projects.filter((project) => project.status === "Completed")
                  .length
              }
            </p>
          </TabsTrigger>
        </TabsList>

        {/* <Dialog>
          <DialogTrigger className="w-max">
            <Button>Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
            </DialogHeader>
            <div>
              <div className="grid w-full items-center gap-1.5 mt-3">
                <Label htmlFor="task-name">Project name</Label>
                <Input
                  type="text"
                  id="task-name"
                  className="mb-6 w-full"
                  placeholder="Project name"
                  onChange={(e) => {}}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="category">Description</Label>
                <Input
                  type="text"
                  id="Description"
                  className="mb-8 w-full"
                  placeholder="Project Description"
                  onChange={(e) => {}}
                />
              </div>
            </div>
            <DialogClose className="w-full">
              <Button className="bg-green-600 mt-2 w-full">Update</Button>
            </DialogClose>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className="flex items-center pb-4 h-[10%]">
        <Input
          placeholder="Filter Project Name..."
          value={
            (table.getColumn("project_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("project_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
      </div>

      <div className="h-[80%]">
        <DataTable colLength={columns.length} tableData={table} />
      </div>
    </Tabs>
  );
}
