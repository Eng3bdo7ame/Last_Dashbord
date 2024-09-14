"use client";
import React, { memo } from "react";
import { FaFileExport } from "react-icons/fa";
import { LuUserCheck } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbScreenShareOff } from "react-icons/tb";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

 const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("../Charts/ChartTwo"), { ssr: false });
const ChartThree = dynamic(() => import("../Charts/ChartThree"), {
  ssr: false,
});
const ChartSix = dynamic(() => import("../Charts/ChartSix"), { ssr: false });
const ChartSeven = dynamic(() => import("../Charts/ChartSeven"), {
  ssr: false,
});
const MapOne = dynamic(() => import("../Maps/MapOne"), { ssr: false });

import Card from "./Card";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

const cardsData = [
  {
    icon: AiOutlineUsergroupAdd,
    label: "Total Sales",
    h1: "1k$",
    value: "8% from yesterday",
    colorClass: "bg-red-100",
    colorIcon: "bg-[#FA5A7D]",
  },
  {
    icon: LuUserCheck,
    label: "Total Booking",
    h1: "300$",
    value: "5% from yesterday",
    colorClass: "bg-[#FFF4DE]",
    colorIcon: "bg-[#FF947A]",
  },
  {
    icon: AiOutlineUsergroupAdd,
    label: "Cancel Booking",
    h1: "5$",
    value: "3% from yesterday",
    colorClass: "bg-[#F8B5B5]",
    colorIcon: "bg-red-500",
  },
  {
    icon: TbScreenShareOff,
    label: "New Booking",
    h1: "400$",
    value: "2% from yesterday",
    colorClass: "bg-[#F3E8FF]",
    colorIcon: "bg-[#BF83FF]",
  },
];

const MemoizedCard = memo(Card);

const ECommerce: React.FC = () => {
  return (
    <div className={`${inter.className} flex flex-col gap-4`}>
      <section className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-3xl bg-white px-8 py-5 shadow-md dark:bg-gray-dark xl:w-[48vw]">
            <div className={`flex justify-between pb-12 ${inter.className}`}>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Today’s Sales
                </h1>
                <h2 className="text-gray-400">Sales Summary</h2>
              </div>
              <button className="flex items-center gap-3 rounded-3xl border-2 border-blue-300 px-3 py-2">
                <FaFileExport /> Export
              </button>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {cardsData.map((card) => (
                <MemoizedCard key={card.label} {...card} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-white px-3 pt-5 shadow-md dark:bg-gray-dark lg:w-[30vw]">
          <h3 className="text-lg font-bold">Reserved rooms / Empty rooms</h3>
          <ChartTwo />
        </div>
      </section>

      <div className="flex flex-col flex-wrap items-center justify-between  md:flex-row lg:flex-row xl:flex-row">
        <div className="py-8">
          <ChartSix />
        </div>
        <div className="py-8">
          <MapOne />
        </div>
        <div className="py-8">
          <ChartSeven />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row lg:flex-row xl:flex-row">
        <div className="w-full rounded-lg md:w-1/2 xl:w-1/2">
          <ChartThree />
        </div>
        <div className="w-full rounded-lg md:w-1/2 xl:w-1/2">
          <ChartOne />
        </div>
      </div>
    </div>
  );
};

export default memo(ECommerce);
