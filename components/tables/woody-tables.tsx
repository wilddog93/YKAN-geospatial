"use client";

import React, {
  ChangeEvent,
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import { Input } from "@nextui-org/input";

import { Chip, ChipProps } from "@nextui-org/chip";

import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Selection,
  SortDescriptor,
  Spinner,
} from "@nextui-org/react";

import { Pagination } from "@nextui-org/pagination";

import { Button } from "@nextui-org/button";

import {
  MdCalendarMonth,
  MdCalendarToday,
  MdMoreVert,
  MdOutlineSearch,
  MdPlace,
  MdSort,
} from "react-icons/md";
import { useGHGFluxApi } from "@/api/ghg-flux.api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { objectToQueryString } from "@/utils/useFunction";
import { ColumnProps, SelectTypes } from "@/utils/propTypes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  subMonths,
  subYears,
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { WoodyTypes, useWoodyApi } from "@/api/carbon-stocks.api";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  banned: "danger",
  inactive: "warning",
};

const periodeOptions: SelectTypes[] = [
  { label: "Yearly", value: "Yearly" },
  { label: "Monthly", value: "Monthly" },
];

const sortOptions: SelectTypes[] = [
  { label: "ID", value: "id" },
  { label: "DATE", value: "date" },
  { label: "PLOT", value: "plot" },
  { label: "LAND COVER", value: "landCover" },
  // { label: "REGION", value: "region" },
  { label: "SITE", value: "site" },
];

const columns: ColumnProps[] = [
  { name: "NO", uid: "no", sortable: true },
  { name: "ID", uid: "id", sortable: true },
  { name: "DATE", uid: "date", sortable: true },
  { name: "PLOT", uid: "plot", sortable: true },
  { name: "LAND COVER", uid: "landCover", sortable: true },
  { name: "SITE", uid: "site", sortable: true },
  { name: "VOLUME ROTTEN", uid: "volumeRotten" },
  { name: "VOLUME SOUND", uid: "volumeSound" },
  { name: "VOLUME MEDIUM", uid: "volumeMedium" },
  { name: "MASS ROTTEN", uid: "massRotten" },
  { name: "MASS SOUND", uid: "massSound" },
  { name: "MASS MEDIUM", uid: "massMedium" },
  { name: "TOTAL", uid: "total" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "date",
  "plot",
  "landCover",
  "site",
  "volumeRotten",
  "volumeSound",
  "volumeMedium",
  "massRotten",
  "massSound",
  "massMedium",
  "total",
];

type TableProps = {
  params?: any;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  landCoverOptions?: SelectTypes[] | any[];
  locationKey?: Key | null;
  locationOptions?: SelectTypes[] | any[];
};

export default function WoodyTables({
  params,
  page,
  setPage,
  limit,
  setLimit,
  filterValue,
  setFilterValue,
  landCoverOptions,
  locationKey,
  locationOptions,
}: TableProps) {
  // const [filterValue, setFilterValue] = useState("");
  // data-table-with-api
  const { fetch, data, meta, fetching } = useWoodyApi();
  const [dataTables, setdataTables] = useState<WoodyTypes[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");

  // const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });

  // dropdown
  const [landCoverKey, setLandCoverKey] = useState<Key | null>(
    "Secondary Forest"
  );
  const [landCoverFilter, setLandCoverFilter] = useState("Secondary Forest");
  const [periodeKey, setPeriodeKey] = useState<Key | null>("Yearly");
  const [periodeFilter, setPeriodeFilter] = useState("Yearly");
  const [sortKey, setSortKey] = useState<Key | null>("id");
  const [sortFilter, setSortFilter] = useState("id");

  // page-count
  // const [pages, setPages] = useState(0)

  let router = useRouter();
  let pathname = usePathname();
  let search = useSearchParams();

  // date-format
  const dateFormat = (date: any) => {
    let _dt = format(new Date(date), "yyyy-MM-dd");
    if (!date) return;
    return _dt;
  };

  // function dropdown
  const onSelectionLandCoverChange = (key: Key) => {
    setLandCoverKey(key);
  };

  const onInputLandCoverChange = (value: string) => {
    setLandCoverFilter(value);
    setPage(1);
  };

  const onSelectionPeriodeChange = (key: Key) => {
    setPeriodeKey(key);
  };

  const onInputPeriodeChange = (value: string) => {
    setPeriodeFilter(value);
    setPage(1);
  };

  const onSelectionSortChange = (key: Key) => {
    setSortKey(key);
  };

  const onInputSortChange = (value: string) => {
    setSortFilter(value);
    setPage(1);
  };
  // end function dropdown

  // filter location key
  const getFilterLocation = useCallback(
    (key: Key) => {
      let state = locationOptions
        ?.filter((item) => item.location == key)
        .map((item) => item.state)
        .toString();
      return { state };
    },
    [locationOptions]
  );

  // filter periode
  const periodeFilterred = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const today = new Date();
    let start: string | null | any = "";
    let end: string | null | any = "";
    if (periodeKey == "Monthly") {
      start = format(startOfMonth(currentDate), "yyyy-MM-dd");
      end = format(endOfMonth(currentDate), "yyyy-MM-dd");
    } else {
      start = format(startOfYear(currentDate), "yyyy-MM-dd");
      end = format(endOfYear(currentDate), "yyyy-MM-dd");
    }

    // console.log({start, end}, "periode")

    return { start, end };
  }, [periodeKey]);
  // filter perioded end

  // query-prams
  useEffect(() => {
    let isSearch = search.has("search");
    let isPage = search.has("page");
    let isLimit = search.has("limit");

    let newSearch = search.get("search");
    let newPage = search.get("page");
    let newLimit = search.get("limit");

    if (isPage) setPage(Number(newPage));
    if (isLimit) setLimit(Number(newLimit));
    if (isSearch) setFilterValue(newSearch as string);
  }, [search]);

  const getQuery = useMemo(() => {
    let query: any = {
      page,
      limit,
    };
    if (filterValue) query = { ...query, search: filterValue };
    if (locationKey)
      query = {
        ...query,
        location: getFilterLocation(locationKey as any).state,
      };
    if (landCoverKey) query = { ...query, landCover: landCoverKey };
    return query;
  }, [page, limit, filterValue, locationKey, landCoverKey]);

  const filterParams = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search: any = {
      $and: [
        { region: { $contL: getQuery?.location } },
        { landCover: { $cont: getQuery?.landCover } },
        {
          $or: [
            { site: { $contL: getQuery?.search } },
            { landCover: { $contL: getQuery?.search } },
            { plot: { $contL: getQuery?.search } },
            { region: { $contL: getQuery?.search } },
          ],
        },
      ],
    };

    if (periodeKey)
      search?.$and?.push({
        date: {
          $gte: periodeFilterred.start,
          $lte: periodeFilterred.end,
        },
      });
    if (getQuery?.page) qb.setPage(Number(getQuery?.page) || 1);
    if (getQuery?.limit) qb.setLimit(Number(getQuery?.limit) || 5);

    qb.search(search);
    if (sortKey) {
      qb.sortBy({
        field: `${sortKey}`,
        order: "ASC",
      });
    } else {
      qb.sortBy({
        field: `id`,
        order: "ASC",
      });
    }
    qb.query();
    return qb;
  }, [getQuery, periodeFilterred, sortKey, periodeKey]);

  useEffect(() => {
    router.replace(
      `${pathname}${getQuery ? `?${objectToQueryString(getQuery)}` : ""}`,
      { scroll: false }
    );
    console.log(objectToQueryString(getQuery), "query");
  }, [getQuery]);
  // query-params end

  // get-data
  const getCarbonWoody = async (params: any) => {
    await fetch({ params: params?.queryObject });
  };
  useEffect(() => {
    if (filterParams) {
      getCarbonWoody(filterParams);
    }
  }, [filterParams]);
  // end get-data

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const pages = useMemo(() => {
    let pages = meta.pageCount;
    return pages;
  }, [meta.pageCount]);

  // const pages = meta.pageCount;

  const items = useMemo(() => {
    let arr: any[] = [];
    data.map((item, i) => {
      arr.push({
        ...item,
        no: 1 + i,
      });
    });

    return arr;
  }, [data]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: WoodyTypes, b: WoodyTypes) => {
      const first = a[sortDescriptor.column as keyof WoodyTypes] as number;
      const second = b[sortDescriptor.column as keyof WoodyTypes] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((item: WoodyTypes, columnKey: Key) => {
    const cellValue = item[columnKey as keyof WoodyTypes];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {cellValue || "-"}
            </p>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {cellValue ? dateFormat(cellValue) : "-"}
            </p>
          </div>
        );
      case "plot":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {cellValue || "-"}
            </p>
          </div>
        );
      case "landCover":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || ""}</p>
          </div>
        );
      case "site":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {cellValue || "-"}
            </p>
          </div>
        );
      case "valumeRotten":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "valumeSound":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "valumeMedium":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "massRotten":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "massSound":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "massMedium":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      case "total":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue || 0}</p>
          </div>
        );
      // case "actions":
      //   return (
      //     <div className="relative flex justify-end items-center gap-2">
      //       <Dropdown>
      //         <DropdownTrigger>
      //           <Button isIconOnly size="sm" variant="light">
      //             <MdMoreVert className="text-default-300" />
      //           </Button>
      //         </DropdownTrigger>
      //         <DropdownMenu color="primary" className="text-black">
      //           <DropdownItem>View</DropdownItem>
      //           <DropdownItem>Edit</DropdownItem>
      //           <DropdownItem>Delete</DropdownItem>
      //         </DropdownMenu>
      //       </Dropdown>
      //     </div>
      //   );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      // setRowsPerPage(Number(e.target.value));
      setLimit(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col lg:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            radius="full"
            placeholder="Search..."
            labelPlacement="outside"
            startContent={<MdOutlineSearch className="w-4 h-4" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            variant="faded"
            color="primary"
            className="w-full sm:max-w-[44%] rounded-full bg-white dark:bg-default/60 backdrop-blur-xl hover:bg-default-200/70 dark:hover:bg-default/70 group-data-[focused=true]:bg-default-200/50 dark:group-data-[focused=true]:bg-default/60"
          />
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex w-full max-w-[12rem] flex-col gap-2">
              <Autocomplete
                radius="full"
                labelPlacement="outside"
                placeholder="Select land cover"
                defaultItems={landCoverOptions}
                defaultSelectedKey="Secondary Forest"
                variant="faded"
                color="primary"
                className="w-full max-w-xs rounded-full bg-white dark:bg-default/60 backdrop-blur-xl hover:bg-default-200/70 dark:hover:bg-default/70 group-data-[focused=true]:bg-default-200/50 dark:group-data-[focused=true]:bg-default/60"
                allowsCustomValue={true}
                onSelectionChange={onSelectionLandCoverChange}
                onInputChange={onInputLandCoverChange}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className="w-full max-w-[12rem] flex flex-col gap-2">
              <Autocomplete
                radius="full"
                labelPlacement="outside"
                placeholder="Sort By"
                defaultItems={sortOptions}
                defaultSelectedKey="id"
                variant="faded"
                color="primary"
                className="w-full max-w-xs rounded-full bg-white dark:bg-default/60 backdrop-blur-xl hover:bg-default-200/70 dark:hover:bg-default/70 group-data-[focused=true]:bg-default-200/50 dark:group-data-[focused=true]:bg-default/60"
                allowsCustomValue={true}
                onSelectionChange={onSelectionSortChange}
                onInputChange={onInputSortChange}
                endContent={<MdSort className="w-5 h-5" />}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className="w-full max-w-[12rem] flex flex-col gap-2">
              <Autocomplete
                radius="full"
                labelPlacement="outside"
                placeholder="Select periode"
                defaultItems={periodeOptions}
                defaultSelectedKey="Yearly"
                variant="faded"
                color="primary"
                className="w-full max-w-xs rounded-full bg-white dark:bg-default/60 backdrop-blur-xl hover:bg-default-200/70 dark:hover:bg-default/70 group-data-[focused=true]:bg-default-200/50 dark:group-data-[focused=true]:bg-default/60"
                allowsCustomValue={true}
                onSelectionChange={onSelectionPeriodeChange}
                onInputChange={onInputPeriodeChange}
                startContent={<MdCalendarToday className="w-5 h-5" />}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    landCoverFilter,
    landCoverOptions,
    onSelectionLandCoverChange,
    onInputLandCoverChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="w-[30%] flex justify-between items-center">
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={limit}
              onChange={onRowsPerPageChange}
            >
              {[5, 10, 20, 30].map((pageSize, idx) => (
                <option key={idx} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    items.length,
    setPage,
    page,
    pages,
    hasSearchFilter,
    onRowsPerPageChange,
    limit,
  ]);

  const getSelect = useMemo(() => {
    // console.log(Array.from(selectedKeys).includes("3"), "filter-check");
    if (selectedKeys == "all") return items;
    return items.filter((column) =>
      Array.from(selectedKeys).includes(column.id.toString())
    );
  }, [selectedKeys]);

  return (
    <Table
      isStriped
      removeWrapper
      color="primary"
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
        base: "overflow-x-auto overflow-y-hidden py-5",
      }}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            // className="bg-primary/20"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No items found"}
        items={sortedItems}
        isLoading={fetching}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="bg-white py-3">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}