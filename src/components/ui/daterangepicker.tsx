"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdEdit, MdOutlineCalendarMonth } from "react-icons/md";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "@/state/task/taskSlice";
import { formatDate, formatDate2 } from "../custom/date-format";
import Image from "next/image";

interface DatePickerProps {
  className: string;
  title: string;
  selectedDate: string;
}

export function DatePickerWithRange({
  className,
  title,
  selectedDate,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const taskDetail = useSelector(
    (state: RootState) => state.task.currentTaskDetails
  );

  const project = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (taskDetail && taskDetail?.start_date) {
      const dateObject = new Date(taskDetail.start_date);
      const dateObject2 = new Date(taskDetail.end_date);

      setDate({
        from: dateObject,
        to: dateObject2,
      });
    }
  }, [taskDetail]);

  const isDateDisabled = (date: Date) => {
    if (project && project?.expected_end_date) {
      const cutoffDate = new Date(project?.expected_end_date);
      console.log(taskDetail?.end_date);
      return date > cutoffDate;
    } else {
      console.log(false);
      return false;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            onClick={() => setPopoverOpen(!popoverOpen)}
            className="flex flex-1 p-2 items-center justify-start cursor-pointer transition-all duration-500 rounded-sm hover:bg-neutral-100"
          >
            <Image
              src="/images/date.png"
              alt="category"
              width={16}
              height={16}
              className="mr-3 w-6 h-6 text-slate-600 "
            />
            <div>
              <p className="mr-6 text-[12px] text-neutral-500">{title}</p>
              <p className="font-medium text-[#5A74B8]">
                {formatDate(selectedDate)}
              </p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => {
              setDate(date);
              if (date && date?.from && date?.to && taskDetail) {
                dispatch(
                  updateTask({
                    task_id: taskDetail?.id,
                    data: {
                      exp_start_date: formatDate2(date?.from),
                      exp_end_date: formatDate2(date?.to),
                    },
                  })
                );
                setPopoverOpen(false); // Close the calendar after selection
              }
            }}
            numberOfMonths={1}
            disabled={isDateDisabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
