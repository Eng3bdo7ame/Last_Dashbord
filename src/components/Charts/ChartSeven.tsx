import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartSeven: React.FC = () => {
    const customerSatisfactionOptions = {
       xaxis: {
        categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      },
      yaxis: { title: { text: "Satisfaction (%)" } },
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

    const customerSatisfactionSeries = [
      { name: "This Month", data: [70, 75, 80, 85] },
      { name: "Last Month", data: [65, 70, 78, 80] },
    ];

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
            options={customerSatisfactionOptions}
            series={customerSatisfactionSeries}
            type="line"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSeven;
