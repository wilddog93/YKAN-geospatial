import { SelectTypes } from "@/utils/propTypes";
import { Accordion, AccordionItem, Tab, Tabs } from "@nextui-org/react";
import React, { Fragment, Key, useEffect, useMemo } from "react";
import { MdInfo } from "react-icons/md";
import AreaCharts from "../AreaCharts";
import {
  CarbonLittersStatisticsProp,
  CarbonSoilsStatisticsProp,
  CarbonTreesStatisticsProp,
  CarbonWoodyStatisticsProp,
  useCarbonLittersStatisticsApi,
  useCarbonSoilsStatisticsApi,
  useCarbonTreesStatisticsApi,
  useCarbonWoodyStatisticsMonthlyApi,
  useCarbonWoodyStatisticsYearlyApi,
} from "@/api/carbon-stocks.api";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import WoodyCharts from "./woody/WoodyCharts";
import LittersCharts from "./litter/LitterCharts";
import NSoilCharts from "./soils/NSoilCharts";
import CSoilCharts from "./soils/CSoilCharts";
import NMGSoilCharts from "./soils/NMGSoilCharts";
import CMGSoilCharts from "./soils/CMGSoilCharts";
import DBHTreesCharts from "./trees/DBHTreesCharts";
import NoteTreesCharts from "./trees/NoteTreesCharts";
import TAGBTreesCharts from "./trees/TAGBTreesCharts";
import PlotTreesCharts from "./trees/PlotTreesCharts";
import PlotRadiusTreesCharts from "./trees/PlotRadiusTreesCharts";
import WoodTreesCharts from "./trees/WoodTreesCharts";

type Props = {
  chartData: {
    woody: CarbonWoodyStatisticsProp[];
    litter: CarbonLittersStatisticsProp[];
    soils: CarbonSoilsStatisticsProp[];
    trees: CarbonTreesStatisticsProp[];
  };
  sidebar: boolean;
  query: {
    location: any;
    landCover: any;
  };
  categoryKey: Key | null;
  locationKey: Key | null;
};

export default function CarbonStockCharts({
  chartData,
  sidebar,
  query,
  categoryKey,
  locationKey,
}: Props) {
  // cchart

  // carbon-stock

  return (
    <Fragment>
      <div className={`w-full mt-5 ${sidebar ? "" : "hidden"}`}>
        <Tabs variant="underlined" aria-label="Tabs variants">
          <Tab key="litters" title="Litters">
            <div className="w-full flex flex-col gap-2 px-2">
              <div className="w-full flex justify-between items-center text-sm">
                <h3 className="text-default-700 font-bold">Aboveground Stock</h3>
                <MdInfo className="w-3 h-4" />
              </div>
              <div className="border-1 border-b border-default-300 w-full"></div>
            </div>
            <Accordion>
              <AccordionItem
                key={`litters-2`}
                aria-label={`litters-2`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Litter Mass <span>(Mg/ha)</span></p>
                  </div>
                }
                aria-selected="true"
              >
                <div className="w-full flex flex-col relative">
                  <LittersCharts data={chartData.litter} />
                </div>
              </AccordionItem>
            </Accordion>
          </Tab>
          <Tab key="woody" title="Woody Debris">
            <div className="w-full flex flex-col gap-2 px-2">
              <div className="w-full flex justify-between items-center text-sm">
                <h3 className="text-default-700 font-bold">Aboveground Stock</h3>
                <MdInfo className="w-3 h-4" />
              </div>
              <div className="border-1 border-b border-default-300 w-full"></div>
            </div>
            <Accordion>
              <AccordionItem
                key={`woody-1`}
                aria-label={`woody-1`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Total <span>(Mg/ha)</span></p>
                  </div>
                }
                aria-selected="true"
              >
                <div className="w-full flex flex-col relative">
                  <WoodyCharts data={chartData.woody} />
                </div>
              </AccordionItem>
            </Accordion>
          </Tab>
          <Tab key="trees" title="Trees">
            <div className="w-full flex flex-col gap-2 px-2">
              <div className="w-full flex justify-between items-center text-sm">
                <h3 className="text-sm font-bold">Aboveground Stock</h3>
                <MdInfo className="w-3 h-4" />
              </div>
              <div className="border-1 border-b border-default-300 w-full"></div>
            </div>
            <Accordion>
              <AccordionItem
                key={`trees-1`}
                aria-label={`trees-1`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>
                      Diameter Breast Height <span>(g/cm)<sup>3</sup></span>
                    </p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <DBHTreesCharts data={chartData.trees} />
                </div>
              </AccordionItem>

              <AccordionItem
                key={`trees-2`}
                aria-label={`trees-2`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>
                      Total Aboveground Biomass <span>(Mg/ha)</span>
                    </p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <TAGBTreesCharts data={chartData.trees} />
                </div>
              </AccordionItem>

              <AccordionItem
                key={`trees-6`}
                aria-label={`trees-6`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Wood Density <span>(g/cm)<sup>3</sup></span></p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <WoodTreesCharts data={chartData.trees} />
                </div>
              </AccordionItem>
            </Accordion>
          </Tab>
          <Tab key="soils" title="Soils">
            <div className="w-full flex flex-col gap-2 px-2">
              <div className="w-full flex justify-between items-center text-sm">
                <h3 className="text-default-700 font-bold">Belowground Stock</h3>
                <MdInfo className="w-3 h-4" />
              </div>
              <div className="border-1 border-b border-default-300 w-full"></div>
            </div>
            <Accordion>
              <AccordionItem
                key={`soil-1`}
                aria-label={`soil-1`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Nitrogen (%)</p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <NSoilCharts data={chartData.soils} />
                </div>
              </AccordionItem>

              <AccordionItem
                key={`soil-2`}
                aria-label={`soil-2`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Carbon (%)</p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <CSoilCharts data={chartData.soils} />
                </div>
              </AccordionItem>

              <AccordionItem
                key={`soil-3`}
                aria-label={`soil-3`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Nitrogen <span>(Mg/ha)</span></p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <NMGSoilCharts data={chartData.soils} />
                </div>
              </AccordionItem>

              <AccordionItem
                key={`soil-4`}
                aria-label={`soil-4`}
                title={
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold`}>Carbon <span>(Mg/ha)</span></p>
                  </div>
                }
              >
                <div className="w-full flex flex-col relative">
                  <CMGSoilCharts data={chartData.soils} />
                </div>
              </AccordionItem>
            </Accordion>
          </Tab>
        </Tabs>
      </div>

      <div
        className={`w-full flex flex-col gap-3 mt-5 ${sidebar ? "hidden" : ""}`}
      >
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center text-sm">
            <h3 className="text-default-700 font-bold">Aboveground Stock</h3>
            <MdInfo className="w-3 h-4" />
          </div>
          <div className="border-1 border-b border-default-300 w-full"></div>
        </div>
        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 py-5`}
        >
          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Litter Mass <span>(Mg/ha)</span>
            </h3>
            <LittersCharts data={chartData.litter} />
          </div>
          
          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Woody Debris <span>(Mg/ha)</span>
            </h3>
            <WoodyCharts data={chartData.woody} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Diameter Breast Height Trees <span>(g/cm)<sup>3</sup></span>
            </h3>
            <DBHTreesCharts data={chartData.trees} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Total Aboveground Biomass Trees <span>(Mg/ha)</span>
            </h3>
            <TAGBTreesCharts data={chartData.trees} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Wood Density Trees <span>(g/cm)<sup>3</sup></span>
            </h3>
            <WoodTreesCharts data={chartData.trees} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center text-sm">
            <h3 className="text-default-700 font-bold">Belowground Stock</h3>
            <MdInfo className="w-3 h-4" />
          </div>
          <div className="border-1 border-b border-default-300 w-full"></div>
        </div>
        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 py-5`}
        >
          {/* lowground */}
          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Nitrogen Soils (%)
            </h3>
            <NSoilCharts data={chartData.soils} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Carbon Soils (%)
            </h3>
            <CSoilCharts data={chartData.soils} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Nitrogen Soils <span>(Mg/ha)</span>
            </h3>
            <NMGSoilCharts data={chartData.soils} />
          </div>

          <div className="w-full flex flex-col relative">
            <h3 className="font-semibold text-xs lg:text-sm">
              Carbon Soils <span>(Mg/ha)</span>
            </h3>
            <CMGSoilCharts data={chartData.soils} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
