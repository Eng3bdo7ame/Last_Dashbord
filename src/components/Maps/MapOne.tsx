"use client";
import jsVectorMap from "jsvectormap";
import React, { useEffect } from "react";
import "../../js/us-aea-en";  

const MapOne: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {

    const mapElement = document.getElementById("mapOne");

    if (!mapElement) {
      console.error("Map element not found");
      return;
    }

    let vectorMapOne: any;

    try {
      vectorMapOne = new jsVectorMap({
        selector: "#mapOne",
        map: "us_aea_en",
        zoomButtons: true,

        regionStyle: {
          initial: {
            fill: "#C8D0D8",
          },
          hover: {
            fillOpacity: 1,
            fill: "#3056D3",
          },
        },
        regionLabelStyle: {
          initial: {
             fontWeight: "semibold",
            fill: "#fff",
          },
          hover: {
            cursor: "pointer",
          },
        },
        labels: {
          regions: {
            render(code: string) {
              return code.split("-")[1];
            },
          },
        },
      });
    } catch (error) {
      console.error("Error initializing the vector map:", error);
    }

    return () => {
      if (vectorMapOne) {
        
      } else {
        console.error("Vector map instance not found during cleanup");
      }
    };
  }  }, []);

  return (
    <div className="col-span-12 rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
        Booking maps by country
      </h4>
      <div className="h-[310px]">
        <div id="mapOne" className="mapOne map-btn"></div>
      </div>
    </div>
  );
};

export default MapOne;
