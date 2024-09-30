import { Card } from "@/components/ui/card";
import React from "react";
import { MdAnalytics, MdOutlineAnalytics } from "react-icons/md";

export default function page() {
  return (
    <div className="bg-neutral-100 h-full w-full flex items-center rounded-sm justify-between">
      <div className="bg-white h-full w-[65%] p-6">
        <div className="h-[5%] w-max flex items-center justify-start cursor-pointer">
          <p className="w-[120px] text-center text-blue-800 border-b-[2px] border-blue-800 pb-2">
            Overview
          </p>
          <p className="w-[180px] text-center  border-b-[1px] border-neutral-200 pb-2">
            Financial Insights
          </p>
          <p className="w-[120px] text-center  border-b-[1px] border-neutral-200 pb-2">
            Resources
          </p>
          <p className="w-[120px] text-center  border-b-[1px] border-neutral-200 pb-2">
            Vendors
          </p>
        </div>

        <div className="w-full flex items-center justify-between my-4 gap-4">
          <Card className="h-[100px] w-[300px] flex items-center justify-start p-4">
            <div className="p-5 bg-blue-50 rounded-full">
              <MdOutlineAnalytics className="text-blue-800 text-3xl" />
            </div>
            <div className="flex flex-col items-start justify-start ml-3">
              <p className="text-[12px] font-semibold text-slate-400 mb-1">
                All tasks
              </p>
              <p className="text-[16px] font-medium text-slate-700">52</p>
            </div>
          </Card>
          <Card className="h-[100px] w-[300px] flex items-center justify-start p-4">
            <div className="p-5 bg-blue-50 rounded-full">
              <MdOutlineAnalytics className="text-blue-800 text-3xl" />
            </div>
            <div className="flex flex-col items-start justify-start ml-3">
              <p className="text-[12px] font-semibold text-slate-400 mb-1">
                Task in Progress
              </p>
              <p className="text-[16px] font-medium text-slate-700">52</p>
            </div>
          </Card>
          <Card className="h-[100px] w-[300px] flex items-center justify-start p-4">
            <div className="p-5 bg-blue-50 rounded-full">
              <MdOutlineAnalytics className="text-blue-800 text-3xl" />
            </div>
            <div className="flex flex-col items-start justify-start ml-3">
              <p className="text-[12px] font-semibold text-slate-400 mb-1">
                Task in Delay
              </p>
              <p className="text-[16px] font-medium text-slate-700">52</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white h-full w-[34%] flex flex-col justify-between p-3"></div>
    </div>
  );
}
