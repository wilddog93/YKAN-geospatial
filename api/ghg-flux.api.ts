import useAxios from "@/hooks/use-axios";
import type { AxiosRequestConfig } from "axios";
import { useState } from "react";
import Meta from "./meta.interface";
import defaultMeta from "./utils";

export interface GHGFlux {
  id: number;
  date: string;
  plot: string;
  landCover: string;
  type: "Heterothropic" | "Total";
  airTemperature: number | null;
  soilTemperature: number | null;
  soilMoisture: number | null;
  waterTable: number | null;
  ch4: number | null;
  co2: number | null;
  heterothropic_co2?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GHGFluxStatisticsProp {
  land_cover: string;
  datetime: string;
  avg_airTemperature: number;
  avg_soilTemperature: number;
  avg_soilMoisture: number;
  avg_waterTable: number;
  avg_ch4: number;
  avg_co2: number;
  sum_airTemperature: number;
  sum_soilTemperature: number;
  sum_soilMoisture: number;
  sum_waterTable: number;
  sum_ch4: number;
  sum_co2: number;
  avg_heterothropic_soilTemperature: number;
  avg_heterothropic_soilMoisture: number;
  avg_heterothropic_waterTable: number;
  avg_heterothropic_ch4: number;
  avg_heterothropic_co2: number;
  avg_heterothropic_airTemperature: number;
  sum_heterothropic_soilTemperature: number;
  sum_heterothropic_soilMoisture: number;
  sum_heterothropic_waterTable: number;
  sum_heterothropic_ch4: number;
  sum_heterothropic_co2: number;
  sum_heterothropic_airTemperature: number;
}

export const PREFIX = "/ghg-flux";
export const PREFIX_YEARLY = "/ghg-flux/statistics/monthly";
export const PREFIX_MONTHLY = "/ghg-flux/statistics/daily";

export function useGHGFluxApi() {
  const axios = useAxios();
  const [data, setData] = useState<GHGFlux[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$get(PREFIX, options);
      setData(lists);
      setMeta(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useGHGFluxStatisticsYearlyApi() {
  const axios = useAxios();
  const [data, setData] = useState<GHGFluxStatisticsProp[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$getByObject(
        PREFIX_YEARLY,
        options
      );
      setData(lists);
    } catch (err: any) {
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useGHGFluxStatisticsMonthlyApi() {
  const axios = useAxios();
  const [data, setData] = useState<GHGFluxStatisticsProp[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$getByObject(
        PREFIX_MONTHLY,
        options
      );
      setData(lists);
    } catch (err: any) {
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}
