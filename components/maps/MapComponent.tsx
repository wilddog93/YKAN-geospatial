// components/MapContainer.tsx
import React, { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import "ol/ol.css";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import TileLayer from "ol/layer/Tile";
import { Feature, Map, Overlay, View } from "ol";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import MVT from "ol/format/MVT";
import { Icon, Style } from "ol/style";
import { Point } from "ol/geom";
// import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import { convertDMS } from "@/utils/useFunction";
import { fromLonLat } from "ol/proj";
import { Image, Input, Select, SelectItem } from "@nextui-org/react";
import { MdLocationPin, MdSearch } from "react-icons/md";

const dataMaps = [
  {
    lat: "00°22'05.67840000\"N",
    long: "109°07'07.18320000\"E",
    project: "Bezos Earth Fund – Peatland Playbook",
    locationName: "Anjungan Dalam Village",
    villages: "Mempawah",
    category: "Oil Palm Plantation",
    description: [
      "GHG Fluxes",
      "Carbon Stock",
      "Environmental variables",
      "Soil physical chemistry",
      "Weather data",
    ],
  },
  {
    lat: "00°22'05.67840000\"N",
    long: "109°07'07.18320000\"E",
    project: "Bezos Earth Fund – Peatland Playbook",
    locationName: "Anjungan Dalam Village",
    villages: "Mempawah",
    category: "Secondary Forest",
    description: [
      "GHG Fluxes",
      "Carbon Stock",
      "Environmental variables",
      "Soil physical chemistry",
      "Weather data",
    ],
  },
  // {
  //   lat: "00°22'20.45640000\"N",
  //   long: "109°06'35.39880000\"E",
  //   project: "Bezos Earth Fund – Peatland Playbook",
  //   villages: "Mempawah",
  //   locationName: "Antibar Village",
  //   category: "Shrubs",
  //   description: ["GHG Fluxes", "Carbon Stock"],
  // },
  {
    lat: "00°16'17.35000106\"S",
    long: "109°26'03.11999747\"E",
    project: "Bezos Earth Fund – Peatland Playbook",
    villages: "Kubu Raya",
    locationName: "Rasau Jaya Village",
    category: "Oil Palm Plantation",
    description: [
      "GHG Fluxes",
      "Environmental variables",
      "Soil physical chemistry",
    ],
  },
];

type Props = {
  items: any;
  setItems: Dispatch<SetStateAction<any | null>>;
};

const MapComponent = ({ items, setItems }: Props) => {
  const overlayRef = useRef<Overlay | null>(null);
  const [overlayContent, setOverlayContent] = useState<any | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedKeys, setSelectedKeys] = useState<string | any>("oil-palm-plantation")

  const [itemMaps, setItemMaps] = useState<Feature<Point>[]>([]);

  const coordinates = convertDMS("0°22'05.7\"N", "109°07'07.2\"E");

  const iconFeatures = useMemo(() => {
    let newArr: Feature<Point>[] = [];
    if (dataMaps?.length > 0) {
      dataMaps?.map((item) => {
        const coordinate = convertDMS(item.lat, item.long);
        const coordinates = fromLonLat([
          coordinate.longitude,
          coordinate.latitude,
        ]);
        newArr.push(
          new Feature({
            // geometry: new Point([coordinates?.latitude, coordinates?.longitude]),fromLonLat
            ...item,
            geometry: new Point(coordinates),
          })
        );
      });
    }
    return newArr;
  }, [dataMaps]);

  const iconPopups = (feature: any) => {
    const category = feature;
    let iconSrc = "";
    // Tentukan ikon berdasarkan kategori
    switch (category) {
      case "Oil Palm Plantation":
        iconSrc = "/icons/oil-palm.png";
        break;
      case "Secondary Forest":
        iconSrc = "/icons/forest.png";
        break;
      default:
        iconSrc = "/icons/icon-shrub.png";
        break;
    }

    return iconSrc;
  };

  useEffect(() => {
    // Initialize the map
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new XYZ({
            attributions:
              'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
              'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            url:
              "https://server.arcgisonline.com/ArcGIS/rest/services/" +
              "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([109.4342, -0.271486]),
        // center: [13164840.120333597, -191866.6366120975],
        zoom: 8,
        minZoom: 4,
        constrainOnlyCenter: true,
      }),
    });

    const iconFeature = [
      new Feature({
        geometry: new Point([11886463.76, -697838.04]),
        name: "Jakarta Selatan",
        category: "Oil Palm",
        population: 4000,
        rainfall: 500,
      }),
      new Feature({
        geometry: new Point([11178245.135473102, -111678.44319488533]),
        name: "Padang",
        category: "Secondary Forest",
        population: 4000,
        rainfall: 500,
      }),
      new Feature({
        geometry: new Point([11629259.353076728, 119001.71560729994]),
        name: "Kepulauan Riau",
        category: "Shrubs",
        population: 4000,
        rainfall: 500,
      }),
      new Feature({
        geometry: new Point([11293214.772411833, 53536.545708957245]),
        name: "Pekanbaru",
        category: "Secondary Forest",
        population: 4000,
        rainfall: 500,
      }),
      new Feature({
        geometry: new Point([12702275.599202517, 19263.569483857485]),
        name: "Kalimantan Tengah",
        category: "Oil Palm",
        population: 4000,
        rainfall: 500,
      }),
    ];

    const featureStyleFunction = (feature: any) => {
      const category = feature.get("category");
      let iconSrc = "";
      // Tentukan ikon berdasarkan kategori
      switch (category) {
        case "Oil Palm Plantation":
          iconSrc = "/icons/oil-palm.png";
          break;
        case "Secondary Forest":
          iconSrc = "/icons/forest.png";
          break;
        default:
          iconSrc = "/icons/icon-shrub.png";
          break;
      }
      console.log(iconSrc, "icon");

      return new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: iconSrc,
          scale: 0.6,
        }),
      });
    };

    iconFeatures?.forEach((feature) => {
      const newIcon = featureStyleFunction(feature);
      feature.setStyle(newIcon);
    });

    const vectorSource = new VectorSource({
      features: iconFeatures,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      // style: featureStyleFunction,
    });

    map.addLayer(vectorLayer);

    if (popupRef?.current) {
      const popup = new Overlay({
        element: popupRef.current,
        autoPan: true,
        positioning: "top-center",
      });
      map.addOverlay(popup);

      map.on("click", (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
        console.log(event.coordinate, "event click map");
        const coordinate = event.coordinate;
        if (feature) {
          const data = feature.getGeometry()?.getExtent();
          console.log(feature.getProperties(), "event click map 2");
          popup.setPosition(data);
          let items = feature.getProperties();
          if (data) {
            items = {
              ...items,
              longLat: data,
            };
            setOverlayContent(items);
          }
        } else {
          popup.setPosition(undefined);
        }
      });
    }

    return () => {
      // Cleanup when the component unmounts
      map.setTarget(undefined);
    };
  }, [iconFeatures]); // Empty dependency array ensures useEffect runs once after the initial render

  useEffect(() => {
    if(overlayContent !== null) {
      setItems(overlayContent)
    } else {
      setItems(null)
    }
  }, [overlayContent])

  const dataSelectMap = [
    { label: "Oil Palm Plantation", value: "oil-palm-plantation" },
    { label: "Second Forest", value: "second-forest" },
    { label: "Shrubs", value: "shrubs" },
  ];

  return (
    <Fragment>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <div className="absolute z-10 right-10 top-10"><Image alt="kompas" src="image/kompas.png" className="w-10 h-10" /></div>
      <div className="w-full lg:w-2/3 flex flex-col lg:flex-row items-center gap-1 absolute z-10 top-14 lg:top-5 lg:inset-x-20 p-4">
        <Select
          radius="full"
          label="" 
          className="max-w-xs shadow-sm rounded-full bg-white dark:bg-default/60 backdrop-blur-xl hover:bg-default-200/70 dark:hover:bg-default/70 group-data-[focused=true]:bg-default-200/50 dark:group-data-[focused=true]:bg-default/60"
          labelPlacement="outside"
          variant="bordered"
          listboxProps={{
            itemClasses: {
              base: [
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "data-[hover=true]:bg-default-100",
                "dark:data-[hover=true]:bg-default-50",
                "data-[selectable=true]:focus:bg-default-50",
                "data-[pressed=true]:opacity-70",
                "data-[focus-visible=true]:ring-default-500",
              ],
            },
          }}
          color="primary"
          selectedKeys={[selectedKeys]}
          onChange={({target}:any) => setSelectedKeys(target?.value)}
          >
          {dataSelectMap.map((data) => (
            <SelectItem key={data.value} value={data.value}>
              {data.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          color="primary"
          placeholder="Search"
          radius="full"
          labelPlacement="outside"
          variant="bordered"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => console.log("search")}
            >
              <MdSearch className="w-5 h-5 text-default-400 pointer-events-none" />
            </button>
          }
          type="text"
          className="w-full max-w-md"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60 py-2",
            ],
            innerWrapper: "bg-transparent py-1.5",
            inputWrapper: [
              "shadow-sm",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
              "py-4 bg-white",
            ],
          }}
        />
      </div>

      {/* <div ref={overlayRef} id="overlay" style={{ display: overlayContent ? 'block' : 'none' }}>
        {overlayContent}
      </div> */}

      <div
        ref={popupRef}
        id="popup"
        className="ol-popup lg:w-96 flex flex-col gap-2 transform duration-300 animate-appearance-in"
      >
        {/* <a href="#" id="popup-closer" className="ol-popup-closer"></a> */}
        <div id="popup-content">
          <div className="w-full flex items-center gap-2 p-3">
            <Image
              src={iconPopups(overlayContent?.category)}
              className="shadow-sm bg-gray-2"
            />
            <div className="w-full flex flex-col">
              <h3 className="text-md font-bold">
                {overlayContent?.locationName}
              </h3>
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <span>
                    <MdLocationPin className="w-4 h-4" />
                  </span>
                  <p className="font-bold">{overlayContent?.villages}</p>
                </div>
                <div>
                  <p>{overlayContent?.long}</p>
                  <p>{overlayContent?.lat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-b border-gray w-full"></div>
          <div className="w-full pl-5 p-2 flex flex-wrap gap-1 items-start">
            <ul className="list-disc">
              {overlayContent?.description?.map((item: any) => {
                return <li key={item} className="text-xs">{item}</li>;
              })}
            </ul>
          </div>
          <div className="text-xs flex flex-col p-2">
            <p className="w-full border border-gray-4 bg-gray p-1">
              {overlayContent?.project}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MapComponent;