"use client";

import * as React from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { MdArrowDownward } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { updateTask } from "@/state/task/taskSlice";
import { useToast } from "./use-toast";

interface ProgressProps {
  selected: String;
}

export function PogressDropdown({ selected }: ProgressProps) {
  const [selectedValue, setSelectedValue] = useState<String>("");
  const dispatch = useDispatch<AppDispatch>();
  const taskDetail = useSelector(
    (state: RootState) => state.task.currentTaskDetails
  );

  const { toast } = useToast();

  useEffect(() => {
    setSelectedValue(selected);
  }, []);

  let values: String[] = [
    "Yet To Start",
    "In Progress",
    "In Delay",
    "Completed",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#143F8C] hover:bg-[#27406d]  text-white hover:text-white"
        >
          {selectedValue} <MdArrowDownward className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {values.map((value) => {
          return (
            <DropdownMenuItem
              className="p-2 cursor-pointer "
              onClick={() => {
                setSelectedValue(value);
                dispatch(
                  updateTask({
                    task_id: taskDetail?.id,
                    data: {
                      status: value,
                    },
                  })
                );
                toast({
                  title: "Task Status Changed",
                  description: "for " + taskDetail?.id,
                });
              }}
            >
              {value}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
