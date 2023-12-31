import useAxios from "@/hooks/use-axios";
import type { AxiosRequestConfig } from "axios";
import { useState } from "react";
import Meta from "./meta.interface";
import defaultMeta from "./utils";
import { toast } from "react-toastify";

export interface Files {
  file: File[];
}

export const PREFIX_GHG = "/ghg-flux/import";
export const PREFIX_SOILS = "/soils/import";
export const PREFIX_WEATHER = "/weather/import";
export const PREFIX_LOCATION = "/locations/import";
// carbon
export const PREFIX_CARBON = "/carbon-stocks/import";
export const PREFIX_CARBON_WOODY = "/carbon-stocks/woody-debris/import";
export const PREFIX_CARBON_LITTERS = "/carbon-stocks/litters/import";
export const PREFIX_CARBON_SOILS = "/carbon-stocks/soils/import";
export const PREFIX_CARBON_TREES = "/carbon-stocks/trees/import";

export function useGHGFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_GHG,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("GHG Fluxes Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useSoilsFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_SOILS,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Soils Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useWeatherFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_WEATHER,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("AWS Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useLocationFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_LOCATION,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("NCS Location Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err?.response?.data?.message);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

// carbon-stocks
export function useCarbonFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_CARBON,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Carbon Stock Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useWoodyFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_CARBON_WOODY,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Carbon Stock Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useLittersFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_CARBON_LITTERS,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Carbon Stock - Litter Mass Document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useCarbonSoilsFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_CARBON_SOILS,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Carbon Stock - Carbon soils document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}

export function useTreesFilesApi() {
  const axios = useAxios();
  const [data, setData] = useState<Files[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [meta, setMeta] = useState<Meta>(defaultMeta());

  const fetch = async (body?: any, options?: AxiosRequestConfig) => {
    try {
      setFetching(true);
      const { data: lists, ...result } = await axios.$post(
        PREFIX_CARBON_TREES,
        body,
        options
      );
      setData(lists);
      setMeta(result);
      toast.info("Carbon Stock - Carbon trees document has been imported!");
    } catch (err: any) {
      setError(err);
      toast.error(err);
    } finally {
      setFetching(false);
    }
  };

  return { fetch, data, meta, error, fetching };
}
