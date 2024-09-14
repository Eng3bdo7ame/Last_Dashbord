 import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartSix: React.FC = () => {
   const onlineOfflineSeries = [
     { name: "Online", data: [100, 120, 140, 130, 150, 170, 160] },
     { name: "Offline", data: [80, 90, 85, 95, 100, 110, 105] },
   ];


   const onlineOfflineOptions = {
      xaxis: {
       categories: [
         "Monday",
         "Tuesday",
         "Wednesday",
         "Thursday",
         "Friday",
         "Saturday",
         "Sunday",
       ],
     },
     yaxis: { title: { text: "Counts" } },
     plotOptions: {
       bar: {
         horizontal: false,
         borderRadius: 10,
         dataLabels: { position: "top" },
       },
     },
     colors: ["#00E396", "#FF4560"],
     fill: {
       type: "gradient",
       gradient: {
         shade: "light",
         type: "vertical",
         shadeIntensity: 0.5,
         gradientToColors: ["#00E396", "#FF4560"],
         inverseColors: false,
         opacityFrom: 0.5,
         opacityTo: 0.5,
         stops: [0, 100],
       },
     },
   };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="  justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xl font-bold text-dark dark:text-white">
            Profit this week
          </h4>
        </div>
        <div>
          <DefaultSelectOption options={["This Week", "Last Week"]} />
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={onlineOfflineOptions}
            series={onlineOfflineSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSix;
