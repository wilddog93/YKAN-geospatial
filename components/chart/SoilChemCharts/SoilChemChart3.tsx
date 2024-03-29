import { SelectTypes } from "@/utils/propTypes";
import { Accordion, AccordionItem, Tab, Tabs } from "@nextui-org/react";
import React, { Fragment, Key, useEffect, useMemo } from "react";
import { MdInfo } from "react-icons/md";
import { SoilsStatisticsProp } from "@/api/soils.api";
import PHCharts from "./PHCharts/PHCharts";
import RedoxCharts from "./RedoxCharts/RedoxCharts";
import NitrogenCharts from "./NitrogenCharts/NitrogenCharts";
import CarbonCharts from "./CarbonCharts/CarbonCharts";

type Props = {
  chartData: SoilsStatisticsProp[];
  sidebar: boolean;
};

export default function SoilChemChar3({ chartData, sidebar }: Props) {
  // cchart

  // carbon-stock

  return (
    <Fragment>
      <div className={`w-full mt-5 ${sidebar ? "" : "hidden"}`}>
        <div className="w-full flex flex-col gap-2 px-2">
          <div className="w-full flex justify-between items-center text-sm">
            <h3 className="text-default-700 font-bold">Latest Record</h3>
            <MdInfo className="w-3 h-4" />
          </div>
          <div className="border-1 border-b border-default-300 w-full"></div>
        </div>
        <Accordion>
          <AccordionItem
            key={`chem-2`}
            aria-label={`chem-2`}
            title={
              <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold`}>Carbon Content <span>(Mg/ha)</span></p>
              </div>
            }
            aria-selected="true"
          >
            <div className="w-full flex flex-col relative">
              <CarbonCharts data={chartData} />
            </div>
          </AccordionItem>

          <AccordionItem
            key={`chem-1`}
            aria-label={`chem-1`}
            title={
              <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold`}>Nitrogen Content <span>(Mg/ha)</span></p>
              </div>
            }
            aria-selected="true"
          >
            <div className="w-full flex flex-col relative">
              <NitrogenCharts data={chartData} />
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <div
        className={`w-full flex flex-col gap-3 mt-5 ${sidebar ? "hidden" : ""}`}
      >
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center text-sm">
            <h3 className="text-default-700 font-bold">Latest Record</h3>
            <MdInfo className="w-3 h-4" />
          </div>
          <div className="border-1 border-b border-default-300 w-full"></div>
        </div>

        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-5`}
        >
          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm -mb-5">
              Carbon Content <span>(Mg/ha)</span>
            </h3>
            <CarbonCharts data={chartData} />
          </div>
          
          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm -mb-5">Nitrogen Content <span>(Mg/ha)</span></h3>
            <NitrogenCharts data={chartData} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
